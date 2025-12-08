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
}

export const FormTextarea: FC<FormTextareaProps> = ({
  name,
  label,
  className,
  errorClassName,
  ...props
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
          <Textarea
            {...field}
            {...props}
            value={field.value ?? ''}
            id={name}
            className={cn(error && 'aria-invalid', className)}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
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
