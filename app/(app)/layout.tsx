import { AppSidebar } from '@/components/navigation/app-sidebar';
import { BottomNav } from '@/components/navigation/bottom-nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="mx-auto pb-16 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
