export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="container mx-auto">
      <div>App Layout</div>
      {children}
    </main>
  );
}
