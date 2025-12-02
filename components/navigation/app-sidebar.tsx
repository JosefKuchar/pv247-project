'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isNavItemActive, navItems } from './nav-items';
import { SearchPanel } from '@/components/search/search-panel';
import { useIsMobile } from '@/hooks/use-mobile';

export function AppSidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [showSearch, setShowSearch] = useState(false);
  const searchPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSearch &&
        searchPanelRef.current &&
        !searchPanelRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearch]);

  const handleNavClick = (url: string) => {
    if (url === '/search' && !isMobile) {
      setShowSearch(!showSearch);
      return true;
    }
    setShowSearch(false);
    return false;
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map(item => {
                  const isSearch = item.url === '/search';
                  const isActive = isSearch
                    ? showSearch
                    : isNavItemActive(item.url, pathname);

                  if (isSearch && !isMobile) {
                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton
                          isActive={isActive}
                          onClick={() => handleNavClick(item.url)}
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        onClick={() => handleNavClick(item.url)}
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>

      {showSearch && !isMobile && (
        <div
          ref={searchPanelRef}
          className="bg-background fixed top-0 left-[var(--sidebar-width)] z-40 h-screen w-96 border-r"
        >
          <SearchPanel />
        </div>
      )}
    </>
  );
}
