"use client";
import { useCurrentSession } from "@/hooks/use-current-session";
import { getSession, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

// auto logout when the RefreshTokenExpired error happens
const AuthProvider = ({ children }) => {
  const { session, status } = useCurrentSession();

  if (status === "loading") return <p>please wait...</p>;
  if (session && session?.error === "RefreshTokenExpired") signOut();

  return <>{children}</>;
};

export default AuthProvider;
