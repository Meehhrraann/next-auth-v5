import { currentUser } from "@/lib/actions/currentSession.action";
import React from "react";

const Page = async () => {
  const user = await currentUser();
  console.log(user);
  return (
    <div className="flex w-[300px] flex-col gap-3">
      <p className="mb-5 text-center text-xl">💻 server</p>
      <div className="flex items-center justify-between rounded-lg bg-white p-2 shadow-md">
        <p>name:</p>
        <p className="truncate rounded-lg bg-slate-200 p-1 text-sm">
          {user.name}
        </p>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-white p-2 shadow-md">
        <p>email:</p>
        <p className="truncate rounded-lg bg-slate-200 p-1 text-sm">
          {user.email}
        </p>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-white p-2 shadow-md">
        <p>user id:</p>
        <p className="truncate rounded-lg bg-slate-200 p-1 text-sm">
          {user.id}
        </p>
      </div>
    </div>
  );
};

export default Page;
