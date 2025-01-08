import { currentRole, currentUser } from "@/lib/actions/currentSession.action";
import React from "react";

const AdminGate = async ({ children }) => {
  const role = await currentRole();
  const user = await currentUser();

  if (role === "ADMIN") {
    return <div>{children}</div>;
  }

  return (
    <p className="rounded-lg bg-red-200 p-2 text-red-900">
      You cant access here!
    </p>
  );
};

export default AdminGate;
