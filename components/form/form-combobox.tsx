'use client';

import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
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
}: OptionsListProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');

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

  return (
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
            <CommandEmpty>{emptyMessage}</CommandEmpty>
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
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
}
