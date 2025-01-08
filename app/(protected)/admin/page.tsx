import AdminGate from "@/components/AdminGate";
import { currentRole } from "@/lib/actions/currentSession.action";
import React from "react";

const Page = () => {
  const role = currentRole();
  return (
    <div className="flex w-[300px] flex-col gap-1">
      <p className="mb-5 text-center text-xl">🎟️ Admin</p>
      <AdminGate>
        <div className="flex items-center justify-between rounded-lg bg-white p-1 shadow-md">
          <p className="font-semibold">Role :</p>
          <p className="truncate rounded-lg bg-slate-200 p-1 text-sm">{role}</p>
        </div>
      </AdminGate>
    </div>
  );
};

export default Page;
