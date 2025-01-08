"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { RegisterSchema } from "@/validation";
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
import { Input } from "@/components/ui/input";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { registerAction } from "@/lib/actions/auth/register.action";

const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    "",
  );
  const [successMessage, setSuccessMessage] = React.useState<
    string | undefined
  >("");

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof RegisterSchema>) {
    setIsSubmitting(true);
    try {
      // console.log(values);
      // router.push(`/question/${parsedQuestionDetails._id}`);
      const result = await registerAction(values);
      setSuccessMessage(result?.success);
      setErrorMessage(result?.error);
    } catch (error: any) {
      setErrorMessage(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex w-full">
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8 rounded-md border-t-4 border-sky-600 pt-5"
        >
          {/* field 1 */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel className="font-semibold">Name :</FormLabel>
                <FormControl>
                  <Input
                    className="text-black"
                    placeholder="what's your name..."
                    {...field}
                    type="text"
                  />
                </FormControl>

                <FormMessage className="text-wrap text-red-600" />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel className="font-semibold">Password :</FormLabel>
                <FormControl>
                  <Input
                    className="text-black"
                    placeholder="*****"
                    {...field}
                    type="password"
                  />
                </FormControl>

                <FormMessage className="text-wrap text-red-600" />
              </FormItem>
            )}
          />

          {successMessage && (
            <div className="flex h-9 w-full items-center justify-start gap-1 rounded-lg bg-emerald-200 pl-3 text-emerald-600">
              <FaCheckCircle size={18} />
              <p>{successMessage}</p>
            </div>
          )}
          {errorMessage && (
            <div className="flex h-9 w-full items-center justify-start gap-1 rounded-lg bg-red-200 pl-3 text-red-600">
              <FaExclamationCircle size={18} />
              <p>{errorMessage}</p>
            </div>
          )}

          <Button
            disabled={!!isSubmitting}
            className={"flex w-full bg-sky-600 text-white"}
            type="submit"
          >
            create account
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
