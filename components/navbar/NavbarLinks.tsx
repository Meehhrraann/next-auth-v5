import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavbarLinks = () => {
  const pathname = usePathname();
  return (
    <div>
      {/* links */}
      <div className="flex gap-1">
        <Link
          className={`${pathname === "/settings" ? "bg-teal-700 text-white" : "border-teal-700 text-teal-700"} rounded-lg p-1`}
          href={"/settings"}
        >
          setting
        </Link>
        <Link
          className={`${pathname === "/server" ? "bg-teal-700 text-white" : "border-teal-700 text-teal-700"} rounded-lg p-1`}
          href={"/server"}
        >
          server
        </Link>
        <Link
          className={`${pathname === "/client" ? "bg-teal-700 text-white" : "border-teal-700 text-teal-700"} rounded-lg p-1`}
          href={"/client"}
        >
          client
        </Link>
        <Link
          className={`${pathname === "/admin" ? "bg-teal-700 text-white" : "border-teal-700 text-teal-700"} rounded-lg p-1`}
          href={"/admin"}
        >
          admin
        </Link>
      </div>
    </div>
  );
};

export default NavbarLinks;
