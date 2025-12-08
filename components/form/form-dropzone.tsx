'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { FC, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDropzone } from '@uploadthing/react';
import { useUploadThing } from '@/lib/uploadthing-client';
import { generateClientDropzoneAccept } from 'uploadthing/client';

export interface UploadedFile {
  url: string;
  name: string;
}

export interface FormDropzoneProps {
  name: string;
  multiple?: boolean;
  label?: string;
  errorClassName?: string;
  maxFiles?: number;
}

export const FormDropzone: FC<FormDropzoneProps> = ({
  name,
  multiple = true,
  label,
  errorClassName,
  maxFiles = 10,
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
          <UploadthingDropzone
            multiple={multiple}
            onChange={onChange}
            value={value}
            maxFiles={maxFiles}
            className={cn(error && 'aria-invalid')}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          />
        )}
        name={name}
        control={control}
        defaultValue={[]}
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

const UploadthingDropzone: FC<{
  multiple?: boolean;
  onChange?: (value: UploadedFile[]) => void;
  value?: UploadedFile[];
  maxFiles?: number;
  className?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}> = ({
  multiple = true,
  onChange,
  value = [],
  maxFiles = 10,
  className,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { startUpload, routeConfig } = useUploadThing('reviewImageUploader', {
    onClientUploadComplete: res => {
      const newFiles: UploadedFile[] = res.map(file => ({
        url: file.ufsUrl,
        name: file.name,
      }));

      const updatedFiles = multiple ? [...value, ...newFiles] : newFiles;
      onChange?.(updatedFiles);
      setIsUploading(false);
      setUploadProgress(0);
    },
    onUploadError: error => {
      console.error('Upload error:', error);
      setIsUploading(false);
      setUploadProgress(0);
    },
    onUploadProgress: progress => {
      setUploadProgress(progress);
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      // Limit files if not multiple or if exceeding max
      const filesToUpload = multiple
        ? acceptedFiles.slice(0, maxFiles - value.length)
        : acceptedFiles.slice(0, 1);

      if (filesToUpload.length === 0) return;

      setIsUploading(true);
      await startUpload(filesToUpload);
    },
    [multiple, maxFiles, value.length, startUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: routeConfig
      ? generateClientDropzoneAccept(
          Object.keys(routeConfig).map(
            key => key as Parameters<typeof generateClientDropzoneAccept>[0][0],
          ),
        )
      : { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    multiple,
    disabled: isUploading || (!multiple && value.length >= 1),
    maxFiles: multiple ? maxFiles - value.length : 1,
  });

  const handleRemove = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange?.(newFiles);
  };

  const canAddMore = multiple ? value.length < maxFiles : value.length < 1;

  return (
    <div className="space-y-2">
      {canAddMore && (
        <div
          {...getRootProps()}
          className={cn(
            'relative flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors',
            'bg-background hover:bg-accent/50',
            isDragActive && 'border-primary bg-accent',
            ariaInvalid && 'border-destructive',
            isUploading && 'pointer-events-none opacity-60',
            className,
          )}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center px-4 pt-5 pb-6 text-center">
            {isUploading ? (
              <>
                <Loader2 className="text-primary mb-3 h-10 w-10 animate-spin" />
                <p className="text-foreground mb-2 text-sm font-semibold">
                  Uploading... {uploadProgress}%
                </p>
              </>
            ) : (
              <>
                <Upload
                  className={cn(
                    'text-muted-foreground mb-3 h-10 w-10',
                    isDragActive && 'text-primary',
                  )}
                />
                <p className="text-foreground mb-2 text-sm">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-muted-foreground text-xs">
                  {multiple
                    ? `Up to ${maxFiles} photos allowed`
                    : 'Single photo'}{' '}
                  (PNG, JPG, GIF, WEBP up to 50MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <div
              key={`${file.url}-${index}`}
              className="bg-background flex items-center justify-between rounded-md border p-3"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.url}
                  alt={file.name}
                  className="h-10 w-10 shrink-0 rounded object-cover"
                />
                <span className="text-foreground truncate text-sm">
                  {file.name}
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
                disabled={isUploading}
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
