'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating';
import { cn } from '@/lib/utils';
import { ComponentProps, FC } from 'react';

export interface FormRatingProps
  extends Omit<
    ComponentProps<typeof Rating>,
    'name' | 'value' | 'onValueChange'
  > {
  name: string;
  label?: string;
  errorClassName?: string;
  maxRating?: number;
}

export const FormRating: FC<FormRatingProps> = ({
  name,
  label,
  className,
  errorClassName,
  maxRating = 5,
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="w-full space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Rating
            {...props}
            value={field.value ?? 0}
            onValueChange={value => field.onChange(value)}
            className={cn('flex', error && 'aria-invalid', className)}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          >
            {Array.from({ length: maxRating }).map((_, index) => (
              <RatingButton key={index} size={24} />
            ))}
          </Rating>
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
