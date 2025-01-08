"use server";

import { SettingsSchema } from "@/validation";
import { connectMongoDB } from "../mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import Account from "@/models/account";

export async function updateProfileAction(params) {
  try {
    await connectMongoDB();
    const { values, userId } = params;

    const user = await User.findById(userId);
    const account = await Account.findOne({ userId });
    if (!user) return { error: "User not found!" };

    const validatedFields = SettingsSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Invalid fields!" };
    const { email, password, role, isTwoFactorEnabled, name, newPassword } =
      validatedFields.data;

    let hashedPassword = undefined;
    if (account && !user.password && newPassword !== "" && password === "") {
      // create password
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }
    if (password && user.password) {
      const matchPassword = await bcrypt.compare(password, user.password);
      if (!matchPassword) {
        return { error: "password not match!" };
      } else {
        hashedPassword = await bcrypt.hash(newPassword, 10);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        email: email,
        name: name,
        isTwoFactorEnabled: isTwoFactorEnabled,
        role: role,
      },
      { new: true, upsert: true },
    );

    return { success: "update successfully" };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getUser(params) {
  try {
    await connectMongoDB();
    const { userId } = params;
    const user = await User.findById(userId);
    if (!user) return { error: "User not found!" };
    return { user };
  } catch (error) {
    return { error: error.message };
  }
}
