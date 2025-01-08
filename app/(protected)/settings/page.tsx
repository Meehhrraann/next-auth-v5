import { auth } from "@/auth";
import { LogoutButton } from "@/components/LogoutButton";
import SettingForm from "@/components/SettingForm";
import { logoutAction } from "@/lib/actions/auth/logout.action";
import React from "react";

const Page = async () => {
  const session = await auth();

  console.log(session?.user);
  return (
    <>
      settings {session && session?.user?.email}
      <p>
        RT Expires At:{" "}
        {session?.user?.RTExpireAt
          ? new Date(session?.user?.RTExpireAt * 1000).toLocaleString()
          : ""}
      </p>
      <p>
        AT Expires At:{" "}
        {session?.user?.ATExpireAt
          ? new Date(session?.user?.ATExpireAt * 1000).toLocaleString()
          : ""}
      </p>
      <LogoutButton>logout</LogoutButton>
      <SettingForm />
    </>
  );
};

export default Page;
