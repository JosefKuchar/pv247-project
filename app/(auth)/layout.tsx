export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto flex min-h-screen w-full items-center justify-center pb-16 md:pb-0">
      <div className="w-full max-w-md px-4">{children}</div>
    </div>
  );
}
