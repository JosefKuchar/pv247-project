'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ComponentProps, FC } from 'react';

export interface FormInputProps
  extends Omit<ComponentProps<typeof Input>, 'name'> {
  name: string;
  label?: string;
  errorClassName?: string;
  maxLength?: number;
  showCharCount?: boolean;
  warningThreshold?: number;
}

export const FormInput: FC<FormInputProps> = ({
  name,
  label,
  className,
  errorClassName,
  maxLength,
  showCharCount = false,
  warningThreshold,
  ...props
}) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const error = errors[name];
  const currentValue = watch(name) ?? '';
  const currentLength = currentValue.length;

  const isApproachingLimit = warningThreshold && maxLength && currentLength >= warningThreshold && currentLength < maxLength;
  const isOverLimit = maxLength && currentLength > maxLength;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        {label && (
          <label
            htmlFor={name}
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        {showCharCount && maxLength && (
          <span
            className={cn(
              'text-xs',
              isOverLimit
                ? 'text-destructive font-medium'
                : isApproachingLimit
                  ? 'text-yellow-600 font-medium'
                  : 'text-muted-foreground'
            )}
          >
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            {...props}
            value={field.value ?? ''}
            id={name}
            maxLength={maxLength}
            className={cn(
              error && 'aria-invalid',
              isApproachingLimit && 'border-yellow-500',
              isOverLimit && 'border-destructive',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          />
        )}
      />
      {showCharCount && isApproachingLimit && !error && maxLength && (
        <p className="text-yellow-600 mt-1.5 text-sm">
          Approaching character limit ({currentLength}/{maxLength})
        </p>
      )}
      {error && (
        <p
          id={`${name}-error`}
          className={cn('text-destructive mt-1.5 text-sm', errorClassName)}
        >
          {typeof error.message === 'string' && maxLength
            ? `${error.message} (${currentLength}/${maxLength})`
            : typeof error.message === 'string'
              ? error.message
              : 'This field is required'}
        </p>
      )}
    </div>
  );
};
