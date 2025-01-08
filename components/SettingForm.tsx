"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { SettingsSchema } from "@/validation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { Input } from "@/components/ui/input";
import { loginAction } from "@/lib/actions/auth/login.action";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import Link from "next/link";
import Socials from "./Socials";
import { useRouter, useSearchParams } from "next/navigation";
import TwoFAConfirmation from "@/models/twoFAConfirmation";
import { generateTwoFACode } from "@/lib/tokens";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getUser, updateProfileAction } from "@/lib/actions/user.action";
import { useSession } from "next-auth/react";
import { useCurrentSession } from "@/hooks/use-current-session";

const SettingForm = () => {
  const { update } = useSession();
  // const session = useSession();
  const { session, status } = useCurrentSession();
  console.log(session?.user?.name);

  const router = useRouter();
  const currentUser = useCurrentUser();
  // console.log("hellllllllllllllllo", currentUser);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    "",
  );
  const [successMessage, setSuccessMessage] = React.useState<
    string | undefined
  >("");

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      role: session?.user?.role || "",
      isTwoFactorEnabled: session?.user?.isTwoFactorEnabled || false,
    },
  });

  // update fields values after receiving session
  React.useEffect(() => {
    form.setValue("name", session?.user?.name);
    form.setValue("email", session?.user?.email);
    form.setValue("role", session?.user?.role);
    form.setValue("isTwoFactorEnabled", session?.user?.isTwoFactorEnabled);
  }, [session]);

  async function onSubmit(values: z.infer<typeof SettingsSchema>) {
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);
    try {
      console.log("values", values);
      const result = await updateProfileAction({
        values,
        userId: currentUser.id,
      });
      console.log("result:", result);
      if (result?.success) {
        // todo update session add to notion
        await update({
          ...session,
          user: { ...session?.user, ...values },
        });
        setSuccessMessage(result.success);
        form.reset();
      }
      if (result?.error) setErrorMessage(result.error);
    } catch (error: any) {
      if (error.message === "NEXT_REDIRECT") return;
      // setErrorMessage("somthing went wrong with login action");
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // for reload the new session just use this
  useEffect(() => {
    if (successMessage) window.location.reload();
  }, [successMessage, session?.user?.isOAuth]);

  // console.log(status);

  if (status === "loading") return <p>loading...</p>;
  // if (status === "authenticated") return <p>you are sign in</p>;

  return (
    <>
      <div className="flex w-96 flex-col gap-3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4 rounded-md border-t-4 border-sky-600 pt-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel className="font-semibold">Name :</FormLabel>
                  <FormControl>
                    <Input
                      className="text-black"
                      placeholder="Your Name"
                      {...field}
                      type="text"
                    />
                  </FormControl>

                  <FormMessage className="text-wrap text-red-600" />
                </FormItem>
              )}
            />

            {session?.user?.isPasswordExist && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="******" type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="******" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {session?.user?.isOAuth === false && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="font-semibold">Email :</FormLabel>
                    <FormControl>
                      <Input
                        className="text-black"
                        placeholder="example@email.com"
                        {...field}
                        type="email"
                      />
                    </FormControl>

                    <FormMessage className="text-wrap text-red-600" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Role :</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {session?.user?.isOAuth === false && (
              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between gap-3 rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="font-semibold">
                        Enable Two-Factore:
                      </FormLabel>
                      <FormDescription>
                        change the two-factore option{" "}
                        {field.value === true ? "ON" : "OFF"}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        className="data-[state=checked]:bg-sky-600 data-[state=unchecked]:bg-gray-200"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {/* display alert */}
            {successMessage && (
              <div className="flex w-full items-center justify-start gap-2 rounded-lg bg-emerald-200 p-1 text-start text-sm text-emerald-600">
                <FaCheckCircle size={18} />
                <p>{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="flex w-full items-center justify-start gap-2 rounded-lg bg-red-200 p-1 text-start text-sm text-red-600">
                <FaExclamationCircle size={18} />
                <p>{errorMessage!}</p>
              </div>
            )}

            <Button
              disabled={!!isSubmitting}
              className={"flex w-full bg-sky-600 text-white"}
              type="submit"
            >
              Update Profile
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default SettingForm;
