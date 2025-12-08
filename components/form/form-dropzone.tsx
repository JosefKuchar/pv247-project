'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { FC, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface FormDropzoneProps {
  name: string;
  multiple?: boolean;
  label?: string;
  errorClassName?: string;
  accept?: Record<string, string[]>;
  maxSize?: number;
}

export const FormDropzone: FC<FormDropzoneProps> = ({
  name,
  multiple,
  label,
  errorClassName,
  accept,
  maxSize,
  ...rest
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
          className="mb-2 block text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <Controller
        render={({ field: { onChange, value } }) => (
          <Dropzone
            multiple={multiple}
            onChange={onChange}
            value={value}
            accept={accept}
            maxSize={maxSize}
            className={cn(error && 'aria-invalid')}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            {...rest}
          />
        )}
        name={name}
        control={control}
        defaultValue={multiple ? [] : null}
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

const Dropzone: FC<{
  multiple?: boolean;
  onChange?: (value: File[] | File | null) => void;
  value?: File | File[] | null;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}> = ({
  multiple,
  onChange,
  value,
  accept,
  maxSize,
  className,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
  ...rest
}) => {
  const [files, setFiles] = useState<File[]>(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  });

  // Sync local state with form value
  useEffect(() => {
    if (!value) {
      setFiles([]);
    } else {
      const newFiles = Array.isArray(value) ? value : [value];
      setFiles(newFiles);
    }
  }, [value]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple,
    accept,
    maxSize,
    onDrop: acceptedFiles => {
      if (multiple) {
        // Append new files to existing ones
        const newFiles = [...files, ...acceptedFiles];
        setFiles(newFiles);
        // Call onChange directly with the array
        onChange?.(newFiles);
      } else {
        // Single file mode - replace
        const newFile = acceptedFiles[0] || null;
        setFiles(newFile ? [newFile] : []);
        onChange?.(newFile);
      }
    },
    ...rest,
  });

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);

    if (multiple) {
      // For multiple mode, pass array (empty if no files)
      onChange?.(newFiles.length > 0 ? newFiles : []);
    } else {
      // For single mode, pass null if no files
      onChange?.(newFiles.length > 0 ? newFiles[0] : null);
    }
  };

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          'relative flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors',
          'bg-background hover:bg-accent/50',
          isDragActive && 'border-primary bg-accent',
          ariaInvalid && 'border-destructive',
          className,
        )}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center px-4 pt-5 pb-6 text-center">
          <Upload
            className={cn(
              'text-muted-foreground mb-3 h-10 w-10',
              isDragActive && 'text-primary',
            )}
          />
          <p className="text-foreground mb-2 text-sm">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-muted-foreground text-xs">
            {multiple ? 'Multiple photos allowed' : 'Single photo'}{' '}
            {accept
              ? `(${Object.values(accept).flat().join(', ')})`
              : '(PNG, JPG, GIF up to 50MB)'}
          </p>
        </div>
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="bg-background flex items-center justify-between rounded-md border p-3"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Upload className="text-muted-foreground h-4 w-4 shrink-0" />
                <span className="text-foreground truncate text-sm">
                  {file.name}
                </span>
                <span className="text-muted-foreground shrink-0 text-xs">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={e => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
