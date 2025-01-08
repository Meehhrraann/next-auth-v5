import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-3 bg-gradient-to-bl from-sky-400 to-sky-900 text-center">
      <p className="text-6xl font-bold text-white drop-shadow-md">🔐 Auth</p>
      <p className="justify-center text-xl text-white">
        A simple authentication service
      </p>
      <Link
        className="rounded-lg bg-white px-6 py-3 font-semibold text-gray-900"
        href={"/auth/login"}
      >
        Sing in
      </Link>
    </div>
  );
}
