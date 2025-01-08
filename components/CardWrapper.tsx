import Link from "next/link";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { ImGithub } from "react-icons/im";
import Socials from "./Socials";

interface CardWrapperProps {
  children: React.ReactNode;
  goToLogin?: boolean;
}

const CardWrapper: React.FC<CardWrapperProps> = ({ children, goToLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-3 rounded-lg bg-slate-50 p-10 md:w-[450px]">
      <p className="text-6xl font-semibold text-gray-800 drop-shadow-md">
        🔐 Auth
      </p>
      <p className="text-xl text-gray-400">Welcom back!</p>
      <div className="w-full">{children}</div>
      {/* <Socials /> */}
      {goToLogin ? (
        <Link
          className="rounded-lg pt-5 text-sky-500 hover:underline"
          href={"/auth/register"}
        >
          don't have an account ?
        </Link>
      ) : (
        <Link
          className="rounded-lg pt-5 text-sky-500 hover:underline"
          href={"/auth/login"}
        >
          you ahve an account ?
        </Link>
      )}
    </div>
  );
};

export default CardWrapper;
