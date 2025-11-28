import {
  MapIcon,
  NewspaperIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from 'lucide-react';

export const navItems = [
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
    url: '/new_review',
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
] as const;

export function isNavItemActive(itemUrl: string, pathname: string): boolean {
  return itemUrl === '/' ? pathname === '/' : pathname.startsWith(itemUrl);
}
