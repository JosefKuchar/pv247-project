'use client';

import { FC, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDropzone } from '@uploadthing/react';
import { useUploadThing } from '@/lib/uploadthing-client';
import { generateClientDropzoneAccept } from 'uploadthing/client';

export interface ProfileImageUploaderProps {
  value?: string;
  onChange?: (url: string) => void;
  disabled?: boolean;
  className?: string;
  /** Use 'registrationImageUploader' for unauthenticated uploads (e.g. registration form) */
  endpoint?: 'profileImageUploader' | 'registrationImageUploader';
}

export const ProfileImageUploader: FC<ProfileImageUploaderProps> = ({
  value,
  onChange,
  disabled = false,
  className,
  endpoint = 'profileImageUploader',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { startUpload, routeConfig } = useUploadThing(endpoint, {
    onClientUploadComplete: res => {
      if (res && res.length > 0) {
        onChange?.(res[0].ufsUrl);
      }
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

      setIsUploading(true);
      await startUpload(acceptedFiles.slice(0, 1));
    },
    [startUpload],
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
    multiple: false,
    disabled: disabled || isUploading,
    maxFiles: 1,
  });

  const handleRemove = () => {
    onChange?.('');
  };

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Preview / Upload Area */}
      <div className="relative">
        {value ? (
          // Show current image with overlay for changing
          <div className="group relative">
            <div
              {...getRootProps()}
              className={cn(
                'relative h-28 w-28 cursor-pointer overflow-hidden rounded-full border-2 transition-all',
                'border-border hover:border-primary',
                isDragActive && 'border-primary ring-primary/20 ring-4',
                (disabled || isUploading) && 'pointer-events-none opacity-60',
              )}
            >
              <input {...getInputProps()} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Profile"
                className="h-full w-full object-cover"
              />
              {/* Hover overlay */}
              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-center transition-opacity',
                  'bg-black/50 opacity-0 group-hover:opacity-100',
                  isUploading && 'opacity-100',
                )}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center text-white">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="mt-1 text-xs">{uploadProgress}%</span>
                  </div>
                ) : (
                  <Upload className="h-6 w-6 text-white" />
                )}
              </div>
            </div>
            {/* Remove button */}
            {!isUploading && !disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-1 -right-1 h-7 w-7 rounded-full shadow-md"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            )}
          </div>
        ) : (
          // Empty state - dropzone
          <div
            {...getRootProps()}
            className={cn(
              'flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed transition-all',
              'bg-muted/30 hover:bg-accent/50 border-border hover:border-primary',
              isDragActive && 'border-primary bg-accent ring-primary/20 ring-4',
              (disabled || isUploading) && 'pointer-events-none opacity-60',
            )}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
                <span className="text-muted-foreground mt-1 text-xs">
                  {uploadProgress}%
                </span>
              </div>
            ) : (
              <>
                <User
                  className={cn(
                    'text-muted-foreground h-8 w-8',
                    isDragActive && 'text-primary',
                  )}
                />
                <Upload
                  className={cn(
                    'text-muted-foreground mt-1 h-4 w-4',
                    isDragActive && 'text-primary',
                  )}
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* Help text */}
      <p className="text-muted-foreground text-center text-xs">
        {isUploading
          ? 'Uploading...'
          : value
            ? 'Click to change or drag a new image'
            : 'Click to upload or drag and drop'}
        <br />
        <span className="text-muted-foreground/70">
          PNG, JPG, WEBP up to 4MB
        </span>
      </p>
    </div>
  );
};
