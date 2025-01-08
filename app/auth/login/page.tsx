import CardWrapper from "@/components/CardWrapper";
import LoginForm from "@/components/LoginForm";
import Link from "next/link";
import React from "react";

const Page = ({ children }) => {
  return (
    <div>
      <CardWrapper goToLogin>
        <LoginForm />
      </CardWrapper>
    </div>
  );
};

export default Page;
