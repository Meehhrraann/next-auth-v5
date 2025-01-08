// import { UserRole } from "@prisma/client";
import { currentUser } from "@/lib/actions/currentSession.action";
import * as z from "zod";

const UserRole = {
  ADMIN: "ADMIN",
  USER: "USER",
};

// const user = await currentUser();

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string().max(6)),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required!",
  }),
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z
      .string()
      .refine((value) => value.length === 0 || value.length > 5, {
        message: "Password must be 0 or more than 6 characters long.",
      }),
    newPassword: z
      .string()
      .refine((value) => value.length === 0 || value.length > 5, {
        message: "Password must be 0 or more than 6 characters long.",
      }),
    // newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && data.newPassword.length === 0) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    },
  );
// .refine(
//   (data) => {
//     if (data.newPassword && data.password.length === 0) {
//       return false;
//     }

//     return true;
//   },
//   {
//     message: "Password is required!",
//     path: ["password"],
//   },
// );
