export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-1 flex-col pb-16 md:pb-0">{children}</div>;
}
