'use client';

import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

export type ComboboxOption = {
  value: string;
  label: string;
};

export interface FormComboboxProps {
  name: string;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  errorClassName?: string;
  className?: string;
  disabled?: boolean;
  /** Static options - use this when you don't need async fetching */
  options?: ComboboxOption[];
  /** Query key for TanStack Query - required for async fetching */
  queryKey?: string;
  /** Async fetch function - receives the debounced search query */
  fetchOptions?: (query: string) => Promise<ComboboxOption[]>;
  /** Debounce delay in ms (default: 300) */
  debounceMs?: number;
  /** Enable creating new options when no results found */
  allowCreate?: boolean;
  /** Callback when creating a new option - receives the new option data */
  onCreateNew?: (data: { name: string; address?: string }) => Promise<{
    success: boolean;
    data?: ComboboxOption;
    error?: string;
  }>;
  /** Label for the create new option */
  createLabel?: string;
}

export const FormCombobox: React.FC<FormComboboxProps> = ({
  name,
  label,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  errorClassName,
  className,
  disabled,
  options: staticOptions,
  queryKey,
  fetchOptions,
  debounceMs = 300,
  allowCreate = false,
  onCreateNew,
  createLabel = 'Create new...',
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ComboboxResponsive
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            className={cn(error && 'border-destructive', className)}
            disabled={disabled}
            staticOptions={staticOptions}
            queryKey={queryKey}
            fetchOptions={fetchOptions}
            debounceMs={debounceMs}
            hasError={!!error}
            name={name}
            allowCreate={allowCreate}
            onCreateNew={onCreateNew}
            createLabel={createLabel}
          />
        )}
      />
      {error && (
        <p
          id={`${name}-error`}
          className={cn('text-destructive mt-1.5 text-sm', errorClassName)}
        >
          {typeof error.message === 'string'
            ? error.message
            : 'This field is required'}
        </p>
      )}
    </div>
  );
};

interface ComboboxResponsiveProps {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  className?: string;
  disabled?: boolean;
  staticOptions?: ComboboxOption[];
  queryKey?: string;
  fetchOptions?: (query: string) => Promise<ComboboxOption[]>;
  debounceMs: number;
  hasError: boolean;
  name: string;
  allowCreate?: boolean;
  onCreateNew?: (data: { name: string; address?: string }) => Promise<{
    success: boolean;
    data?: ComboboxOption;
    error?: string;
  }>;
  createLabel?: string;
}

function ComboboxResponsive({
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  className,
  disabled,
  staticOptions,
  queryKey,
  fetchOptions,
  debounceMs,
  hasError,
  name,
  allowCreate,
  onCreateNew,
  createLabel,
}: ComboboxResponsiveProps) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const isMobile = useIsMobile();

  // Track selected option for display
  const [selectedOption, setSelectedOption] =
    React.useState<ComboboxOption | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Update selected option when value changes externally
  React.useEffect(() => {
    if (staticOptions && value) {
      const option = staticOptions.find(o => o.value === value);
      if (option) setSelectedOption(option);
    }
  }, [value, staticOptions]);

  const handleSelect = (option: ComboboxOption | null) => {
    setSelectedOption(option);
    onChange(option?.value ?? null);
    setOpen(false);
  };

  const displayLabel = selectedOption?.label ?? placeholder;

  const triggerButton = (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      aria-invalid={hasError}
      aria-describedby={hasError ? `${name}-error` : undefined}
      className={cn(
        'w-full justify-between font-normal',
        !selectedOption && 'text-muted-foreground',
        className,
      )}
      disabled={disabled}
    >
      <span className="truncate">{displayLabel}</span>
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  if (!mounted) {
    return (
      <Button
        variant="outline"
        className={cn('w-full justify-between font-normal', className)}
        disabled
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  if (!isMobile) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <OptionsList
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            staticOptions={staticOptions}
            queryKey={queryKey}
            fetchOptions={fetchOptions}
            debounceMs={debounceMs}
            selectedValue={value}
            onSelect={handleSelect}
            setSelectedOption={setSelectedOption}
            allowCreate={allowCreate}
            onCreateNew={onCreateNew}
            createLabel={createLabel}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent>
        <VisuallyHidden>
          <DrawerTitle>Select option</DrawerTitle>
        </VisuallyHidden>
        <div className="mt-4 border-t">
          <OptionsList
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            staticOptions={staticOptions}
            queryKey={queryKey}
            fetchOptions={fetchOptions}
            debounceMs={debounceMs}
            selectedValue={value}
            onSelect={handleSelect}
            setSelectedOption={setSelectedOption}
            allowCreate={allowCreate}
            onCreateNew={onCreateNew}
            createLabel={createLabel}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

interface OptionsListProps {
  searchPlaceholder: string;
  emptyMessage: string;
  staticOptions?: ComboboxOption[];
  queryKey?: string;
  fetchOptions?: (query: string) => Promise<ComboboxOption[]>;
  debounceMs: number;
  selectedValue: string | null | undefined;
  onSelect: (option: ComboboxOption | null) => void;
  setSelectedOption: React.Dispatch<
    React.SetStateAction<ComboboxOption | null>
  >;
  allowCreate?: boolean;
  onCreateNew?: (data: { name: string; address?: string }) => Promise<{
    success: boolean;
    data?: ComboboxOption;
    error?: string;
  }>;
  createLabel?: string;
}

function OptionsList({
  searchPlaceholder,
  emptyMessage,
  staticOptions,
  queryKey,
  fetchOptions,
  debounceMs,
  selectedValue,
  onSelect,
  setSelectedOption,
  allowCreate,
  onCreateNew,
  createLabel,
}: OptionsListProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [createError, setCreateError] = React.useState<string | null>(null);
  const [newLocationName, setNewLocationName] = React.useState('');
  const [newLocationAddress, setNewLocationAddress] = React.useState('');

  const isAsync = !!fetchOptions;

  // Debounce the search query for async fetching
  React.useEffect(() => {
    if (!isAsync) return;

    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, debounceMs, isAsync]);

  // Async options fetching
  const { data: asyncOptions = [], isLoading } = useQuery<ComboboxOption[]>({
    queryKey: [queryKey, debouncedQuery],
    queryFn: async () => {
      if (!fetchOptions) return [];
      return fetchOptions(debouncedQuery);
    },
    enabled: isAsync,
  });

  // Filter static options based on search query
  const filteredStaticOptions = React.useMemo(() => {
    if (!staticOptions) return [];
    if (!searchQuery) return staticOptions;

    return staticOptions.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [staticOptions, searchQuery]);

  const options = isAsync ? asyncOptions : filteredStaticOptions;

  // Update selected option when async options are loaded
  React.useEffect(() => {
    if (isAsync && selectedValue && asyncOptions.length > 0) {
      const option = asyncOptions.find(o => o.value === selectedValue);
      if (option) setSelectedOption(option);
    }
  }, [asyncOptions, selectedValue, isAsync, setSelectedOption]);

  const handleCreateClick = () => {
    setNewLocationName(searchQuery.trim());
    setNewLocationAddress('');
    setCreateError(null);
    setCreateDialogOpen(true);
  };

  const handleCreateSubmit = async () => {
    if (!onCreateNew || !newLocationName.trim()) {
      setCreateError('Location name is required');
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      const result = await onCreateNew({
        name: newLocationName.trim(),
        address: newLocationAddress.trim() || undefined,
      });

      if (result.success && result.data) {
        setSelectedOption(result.data);
        onSelect(result.data);
        setCreateDialogOpen(false);
        setSearchQuery('');
        setNewLocationName('');
        setNewLocationAddress('');
      } else {
        setCreateError(result.error || 'Failed to create location');
      }
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : 'Failed to create location',
      );
    } finally {
      setIsCreating(false);
    }
  };

  const showCreateOption =
    allowCreate &&
    onCreateNew &&
    searchQuery.trim().length > 0 &&
    !isLoading &&
    options.length === 0;

  return (
    <>
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Location</DialogTitle>
            <DialogDescription>
              Add a new location to the platform
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-location-name">
                Location Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="new-location-name"
                type="text"
                value={newLocationName}
                onChange={e => setNewLocationName(e.target.value)}
                placeholder="Enter location name"
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-location-address">Address (optional)</Label>
              <Input
                id="new-location-address"
                type="text"
                value={newLocationAddress}
                onChange={e => setNewLocationAddress(e.target.value)}
                placeholder="Enter address"
                disabled={isCreating}
              />
            </div>
            {createError && (
              <p className="text-destructive text-sm">{createError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateSubmit} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Command shouldFilter={false}>
        <CommandInput
          placeholder={searchPlaceholder}
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
              <CommandEmpty>
                {showCreateOption ? (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <p>{emptyMessage}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCreateClick}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {createLabel} "{searchQuery}"
                    </Button>
                  </div>
                ) : (
                  emptyMessage
                )}
              </CommandEmpty>
              <CommandGroup>
                {options.map(option => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => onSelect(option)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedValue === option.value
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
                {showCreateOption && (
                  <CommandItem onSelect={handleCreateClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    {createLabel} "{searchQuery}"
                  </CommandItem>
                )}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </>
  );
}
