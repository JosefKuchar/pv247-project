'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateProfileAction } from '@/app/actions/profile';
import { userType } from '@/db/schema';
import {
  nameSchema,
  handleSchema,
  emailSchema,
  descriptionSchema,
} from '@/lib/validation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ProfileImageUploader } from './profile-image-uploader';
import { FormInput } from '@/components/form/form-input';
import { FormTextarea } from '@/components/form/form-textarea';

const updateProfileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  handle: handleSchema,
  description: descriptionSchema,
  image: z.string(),
});

type FormData = z.infer<typeof updateProfileSchema>;

type EditProfileDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  currentUser: userType;
};

export const EditProfileDialog = ({
  isOpen,
  onClose,
  currentUser,
}: EditProfileDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const methods = useForm<FormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: currentUser.name,
      email: currentUser.email,
      handle: currentUser.handle,
      description: currentUser.description,
      image: currentUser.image || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const result = await updateProfileAction(data);

      if (result?.data?.success) {
        // If handle changed, redirect to new profile URL
        if (data.handle !== currentUser.handle) {
          router.push(`/${data.handle}`);
        }

        onClose();
        methods.reset(data); // Reset form with new values
      } else if (result?.serverError) {
        methods.setError('root', { message: result.serverError });
      } else if (result?.validationErrors) {
        Object.entries(result.validationErrors).forEach(([field, errors]) => {
          if (Array.isArray(errors) && errors.length > 0) {
            methods.setError(field as keyof FormData, { message: errors[0] });
          }
        });
      } else if (result?.data?.fieldErrors) {
        Object.entries(result.data.fieldErrors).forEach(([field, message]) => {
          methods.setError(field as keyof FormData, { message });
        });
      } else if (result?.data?.message) {
        methods.setError('root', { message: result.data.message });
      } else {
        methods.setError('root', { message: 'An unexpected error occurred' });
      }
    } catch {
      // Handle unexpected errors (network issues, etc.)
      methods.setError('root', {
        message: 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    methods.reset(); // Reset form when closing
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information. Changes will be visible to other
            users.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {methods.formState.errors.root && (
              <div className="text-destructive text-sm">
                {methods.formState.errors.root.message}
              </div>
            )}

            <FormInput
              name="name"
              label="Display Name"
              placeholder="Your display name"
              disabled={isLoading}
            />

            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <FormInput
                  name="handle"
                  label="@ Handle"
                  placeholder="username"
                  maxLength={30}
                  showCharCount={true}
                  warningThreshold={24}
                  disabled={isLoading}
                  className="flex-1"
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Your unique handle. This will change your profile URL.
              </p>
            </div>

            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              disabled={isLoading}
            />

            <FormTextarea
              name="description"
              label="Description"
              placeholder="Tell others about yourself..."
              maxLength={150}
              showCharCount={true}
              warningThreshold={120}
              disabled={isLoading}
              className="min-h-[100px] resize-none"
            />

            <FormField
              control={methods.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <FormControl>
                    <ProfileImageUploader
                      value={field.value || ''}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
