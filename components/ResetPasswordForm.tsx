"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { ResetPasswordSchema } from "@/validation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { forgetPasswordAction } from "@/lib/actions/auth/forgetPassword.action";

const ResetPasswordForm = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    "",
  );
  const [successMessage, setSuccessMessage] = React.useState<
    string | undefined
  >("");

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);
    try {
      const result = await forgetPasswordAction(values);

      if (result?.success) setSuccessMessage(result.success);
      if (result?.error) setErrorMessage(result.error);
    } catch (error: any) {
      setErrorMessage("somthing went wrong with forgetting password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-y-3 rounded-lg bg-slate-50 p-10 md:w-[350px]">
      <p className="text-2xl font-semibold">🗝️Forget Password</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4 rounded-md border-t-4 border-sky-600 pt-5"
        >
          {/* field 1 */}
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
            send email
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
