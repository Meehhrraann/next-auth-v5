import Navbar from "@/components/navbar/Navbar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-bl from-teal-400 to-teal-900">
      <Navbar />
      <div className="flex flex-col rounded-lg bg-teal-50 p-10">{children}</div>
    </div>
  );
}
