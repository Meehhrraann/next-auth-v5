"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { LoginSchema } from "@/validation";
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
import { loginAction } from "@/lib/actions/auth/login.action";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import Link from "next/link";
import Socials from "./Socials";
import { useSearchParams } from "next/navigation";
import TwoFAConfirmation from "@/models/twoFAConfirmation";
import { generateTwoFACode } from "@/lib/tokens";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError = searchParams.get("error");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isTwoFA, setIsTwoFA] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    "",
  );
  const [successMessage, setSuccessMessage] = React.useState<
    string | undefined
  >("");
  // const searchParams = useSearchParams();

  React.useEffect(() => {
    if (urlError === "OAuthAccountNotLinked") {
      setErrorMessage(
        "This email before used with other account like google | github",
      );
    }
  }, [urlError]);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);
    try {
      const result = await loginAction({ values, callbackUrl });
      if (result?.success) setSuccessMessage(result.success);
      if (result?.error) setErrorMessage(result.error);
      if (result?.isTwoFA) setIsTwoFA(true);
    } catch (error: any) {
      if (error.message === "NEXT_REDIRECT") return;
      // setErrorMessage("somthing went wrong with login action");
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const resendNewCode = async (email) => {
    await TwoFAConfirmation.findOneAndDelete({ email });
    const code = await generateTwoFACode({ email });
    console.log("new code is:", code);
    TwoFAConfirmation.create({ email });
    return { isTwoFA: true };
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8 rounded-md border-t-4 border-sky-600 pt-5"
        >
          {!isTwoFA && (
            <>
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
                    <FormDescription>
                      <Link className="text-gray-400" href={"/auth/reset"}>
                        forget your password ?
                      </Link>
                    </FormDescription>
                  </FormItem>
                )}
              />
            </>
          )}

          {isTwoFA && (
            <>
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="font-semibold">code :</FormLabel>
                    <FormControl>
                      <Input
                        className="text-black"
                        placeholder="123456"
                        {...field}
                        type="string"
                      />
                    </FormControl>

                    <FormMessage className="text-wrap text-red-600" />
                    <FormDescription>
                      <button
                        onClick={() => resendNewCode}
                        className="text-gray-400"
                      >
                        resend a new code
                      </button>
                    </FormDescription>
                  </FormItem>
                )}
              />
            </>
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
            Login
          </Button>
        </form>
      </Form>
      <Socials isSubmmiting={isSubmitting} setIsSubmmiting={setIsSubmitting} />
    </div>
  );
};

export default LoginForm;
