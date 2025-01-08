import { useSession } from "next-auth/react";
import { useCurrentSession } from "./use-current-session";

export const useCurrentUser = () => {
  const { data: session } = useSession();
  return session?.user;
};
