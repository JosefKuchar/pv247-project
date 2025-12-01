"use client"

import { Settings, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ProfileOption = {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive';
};

type ProfileOptionsDropdownProps = {
  isOwner: boolean;
  options: ProfileOption[];
  className?: string;
};

export const ProfileOptionsDropdown = ({
  isOwner,
  options,
  className,
}: ProfileOptionsDropdownProps) => {
  const Icon = isOwner ? Settings : MoreHorizontal;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`inline-flex items-center justify-center rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 border border-input transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className || ''}`}
        >
          <Icon className="h-4 w-4" />
          <span className="sr-only">
            {isOwner ? 'Settings' : 'More options'}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.length > 0 ? (
          options.map((option, index) => (
            <DropdownMenuItem
              key={index}
              onClick={option.onClick}
              variant={option.variant}
            >
              {option.label}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>
            No options available
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};