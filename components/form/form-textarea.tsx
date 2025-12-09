'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ComponentProps, FC } from 'react';

export interface FormTextareaProps
  extends Omit<ComponentProps<typeof Textarea>, 'name'> {
  name: string;
  label?: string;
  errorClassName?: string;
  maxLength?: number;
  showCharCount?: boolean;
  warningThreshold?: number;
}

export const FormTextarea: FC<FormTextareaProps> = ({
  name,
  label,
  className,
  errorClassName,
  maxLength = 2500,
  showCharCount = true,
  warningThreshold = 1800,
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

  const isApproachingLimit = currentLength >= warningThreshold && currentLength < maxLength;
  const isOverLimit = currentLength > maxLength;

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
          <Textarea
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
      {showCharCount && isApproachingLimit && !error && (
        <p className="text-yellow-600 mt-1.5 text-sm">
          Approaching character limit ({currentLength}/{maxLength})
        </p>
      )}
      {error && (
        <p
          id={`${name}-error`}
          className={cn('text-destructive mt-1.5 text-sm', errorClassName)}
        >
          {typeof error.message === 'string'
            ? `${error.message} (${currentLength}/${maxLength})`
            : `This field is required (${currentLength}/${maxLength})`}
        </p>
      )}
    </div>
  );
};
