import NextAuth, { type DefaultSession } from "next-auth";
import { encode, decode } from "next-auth/jwt";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { UserRole } from "@prisma/client";
// import { MongoClient } from "mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import client from "@/lib/db";

// import { getUserById } from "@/data/user";
// import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
// import { connectMongoDB } from "@/lib/db";
import authConfig from "@/auth.config";
// import { getAccountByUserId } from "./data/account";
// import TwoFactorConfirmation from "./models/TwoFactorConfirmation";
import User from "./models/user";
import { MongoClient, ServerApiVersion } from "mongodb";
import Account from "./models/account";
import { connectMongoDB } from "./lib/mongodb";
import jwt from "jsonwebtoken";
import TwoFAConfirmation from "./models/twoFAConfirmation";

// connectMongoDB();

const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

const UserRole = {
  ADMIN: "ADMIN",
  USER: "USER",
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    // async linkAccount({ user }) {
    //   await db.user.update({
    //     where: { id: user.id },
    //     data: { emailVerified: new Date() },
    //   });
    // },
    async linkAccount({ user }) {
      await connectMongoDB();
      await User.findByIdAndUpdate(user.id, { emailVerified: new Date() });
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await User.findById(user.id);

      // Prevent sign in without email verification
      // if (!existingUser?.emailVerified) return false;

      // if (existingUser.isTwoFactorEnabled) {
      //   const twoFactorConfirmation = await TwoFAConfirmation.findOne({
      //     email: existingUser?.email,
      //   });
      //   console.log("22222222222222222222222", twoFactorConfirmation);

      //   if (!twoFactorConfirmation) return false;

      //   // Delete two factor confirmation for next sign in
      //   await TwoFAConfirmation.findOneAndDelete({
      //     email: existingUser?.email,
      //   });
      // }

      return true;
    },
    // token.sub = user.id
    // session = jwt(token) + jwt(customFields like role)
    async session({ token, session }) {
      await connectMongoDB();
      // Check if the refresh token has expired
      if (token?.error === "RefreshTokenError") {
        console.log("RefreshTokenError");
        return { ...session, error: "RefreshTokenExpired" };
      }

      // Check if the access token has expired
      if (Date.now() >= token.ATExpireAt * 1000) {
        // return false
        return { ...session, error: "AccessTokenExpired" };
      }

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.isPasswordExist = token.isPasswordExist as boolean;
        session.user.accessToken = token.accessToken;
        session.user.ATExpireAt = token.ATExpireAt;
        session.user.RTExpireAt = token.RTExpireAt;
      }

      return session;
    },
    async jwt({ token, user, account, trigger, session }) {
      await connectMongoDB();

      if (!token.sub) return token;

      const existingUser = await User.findById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await Account.findOne({
        userId: existingUser.id,
      });

      //todo update session add to notion
      if (trigger === "update") {
        if (session.user) {
          token.email = session.user?.email;
          token.name = session.user?.name;
          token.role = session.user?.role;
          token.isTwoFactorEnabled = session.user?.isTwoFactorEnabled;
          token.isPasswordExist = !!existingUser.password;
        }
        console.log(token);
        return token;
      }

      // console.log("account is readyyyyyyyyyyyyyyyyyyyyyyyyyy", existingAccount);

      if (account) {
        // First-time login, generate the `access_token` and `refresh_token`
        const accessToken = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET,
          {
            expiresIn: "5m", //fix
          },
        );
        const refreshToken = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET,
          {
            expiresIn: "15m", //fix
          },
        );

        token.isOAuth = !!existingAccount;
        token.isPasswordExist = !!existingUser.password;
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.role = existingUser.role;
        token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
        token.ATExpireAt = Math.floor(Date.now() / 1000) + 5 * 60; //fix 5 min
        token.RTExpireAt = Math.floor(Date.now() / 1000) + 15 * 60; //fix 15 min
        // token.ATExpireAt = Math.floor(Date.now() / 1000) + 10; //fix 10s
        // token.RTExpireAt = Math.floor(Date.now() / 1000) + 20; //fix 20s
        return token;
      } else if (Date.now() < token.ATExpireAt * 1000) {
        // Subsequent logins, but the `access_token` is still valid
        return token;
      } else {
        // Subsequent logins, but the `access_token` has expired, try to refresh it
        if (!token.refreshToken) {
          throw new TypeError("Missing refresh_token");
        }

        // todo i add this for expired RT
        if (token?.error === "RefreshTokenError") return token;

        try {
          const decodedRefreshToken = jwt.verify(
            token.refreshToken,
            process.env.JWT_SECRET,
          );

          const newAccessToken = jwt.sign(
            { userId: decodedRefreshToken.userId },
            process.env.JWT_SECRET,
            {
              expiresIn: "5m", //fix
            },
          );
          const newRefreshToken = jwt.sign(
            { userId: decodedRefreshToken.userId },
            process.env.JWT_SECRET,
            {
              expiresIn: "15m", //fix
            },
          );

          token.accessToken = newAccessToken;
          token.refreshToken = newRefreshToken;
          token.ATExpireAt = Math.floor(Date.now() / 1000) + 5 * 60; //fix 5 min
          token.RTExpireAt = Math.floor(Date.now() / 1000) + 15 * 60; //fix 15 min
          // token.ATExpireAt = Math.floor(Date.now() / 1000) + 10; //fix 10s
          // token.RTExpireAt = Math.floor(Date.now() / 1000) + 20; //fix 20s

          return token;
        } catch (error) {
          console.log("Error refreshing access_token", error);
          token.error = "RefreshTokenError";
          return token;
        }
      }
    },
  },

  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  ...authConfig,
});
