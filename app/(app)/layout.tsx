import { AppSidebar } from '@/components/navigation/app-sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      <main>{children}</main>
    </>
  );
}
