'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';

import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';

type Status = {
  value: string;
  label: string;
};

export function ComboBoxResponsive() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const isMobile = useIsMobile();

  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
    null,
  );

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" className="w-[150px] justify-start" disabled>
        {selectedStatus ? <>{selectedStatus.label}</> : <>+ Set status</>}
      </Button>
    );
  }

  if (!isMobile) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedStatus ? <>{selectedStatus.label}</> : <>+ Set status</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedStatus ? <>{selectedStatus.label}</> : <>+ Set status</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <VisuallyHidden>
          <DrawerTitle>Select status</DrawerTitle>
        </VisuallyHidden>
        <div className="mt-4 border-t">
          <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({
  setOpen,
  setSelectedStatus,
}: {
  setOpen: (open: boolean) => void;
  setSelectedStatus: (status: Status | null) => void;
}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');

  // Debounce the search query
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const { data: statuses = [], isLoading } = useQuery<Status[]>({
    queryKey: ['statuses', debouncedQuery],
    queryFn: async () => {
      const queryParam = debouncedQuery
        ? `?q=${encodeURIComponent(debouncedQuery)}`
        : '';
      const response = await fetch(`/api/search/status${queryParam}`);
      if (!response.ok) {
        throw new Error('Failed to fetch statuses');
      }
      return response.json();
    },
  });

  return (
    <Command shouldFilter={false}>
      <CommandInput
        placeholder="Filter status..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Spinner />
          </div>
        ) : (
          <>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {statuses.map(status => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  onSelect={value => {
                    setSelectedStatus(
                      statuses.find(s => s.value === value) || null,
                    );
                    setOpen(false);
                  }}
                >
                  {status.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
}
