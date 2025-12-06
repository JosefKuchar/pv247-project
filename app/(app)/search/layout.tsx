export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-full pb-16 md:w-3xl md:pb-0">{children}</div>
  );
}
