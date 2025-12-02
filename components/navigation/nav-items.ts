import {
  MapIcon,
  NewspaperIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from 'lucide-react';

export function getNavItems(userHandle?: string | null) {
  return [
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
      url: userHandle ? `/${userHandle}` : '/login', // if for whatever reason not authed - cant provide their handle, send user to login
    },
  ] as const;
}

export function isNavItemActive(itemUrl: string, pathname: string): boolean {
  return itemUrl === '/' ? pathname === '/' : pathname.startsWith(itemUrl);
}
