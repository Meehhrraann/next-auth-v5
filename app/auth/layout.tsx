export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-bl from-sky-400 to-sky-900 text-center">
      {children}
    </div>
  );
}
