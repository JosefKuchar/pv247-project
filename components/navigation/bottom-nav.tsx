'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { isNavItemActive, getNavItems } from './nav-items';
import { authClient } from '@/lib/auth-client';

export function BottomNav() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { data: session } = authClient.useSession();

  if (!isMobile) {
    return null;
  }

  const navItems = getNavItems(session?.user?.handle);

  return (
    <nav className="bg-background fixed right-0 bottom-0 left-0 z-50 border-t md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map(item => {
          const isActive = isNavItemActive(item.url, pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                'flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
