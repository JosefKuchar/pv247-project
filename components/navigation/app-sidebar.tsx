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
import {
  MapIcon,
  NewspaperIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';

const items = [
  {
    label: 'Feed',
    icon: NewspaperIcon,
    url: '/',
  },
  {
    label: 'Map',
    icon: MapIcon,
    url: '/map',
  },
  {
    label: 'Create',
    icon: PlusIcon,
    url: '/create',
  },
  {
    label: 'Search',
    icon: SearchIcon,
    url: '/search',
  },
  {
    label: 'Profile',
    icon: UserIcon,
    url: '/profile',
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
