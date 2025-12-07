'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updatePlaceAction, type UpdatePlaceData } from '@/app/actions/place';
import { locationType } from '@/db/schema';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const updatePlaceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  handle: z.string().min(1, 'Handle is required'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less'),
  address: z.string().optional(),
});

type FormData = z.infer<typeof updatePlaceSchema>;

type EditPlaceDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  currentPlace: locationType;
};

export const EditPlaceDialog = ({
  isOpen,
  onClose,
  currentPlace,
}: EditPlaceDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(updatePlaceSchema),
    defaultValues: {
      name: currentPlace.name,
      handle: currentPlace.handle,
      description: currentPlace.description || '',
      address: currentPlace.address || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const result = await updatePlaceAction(currentPlace.id, data);

      if (result.success) {
        // If handle changed, redirect to new profile URL
        if (data.handle !== currentPlace.handle) {
          router.push(`/place/${data.handle}`);
        }

        onClose();
        form.reset(data); // Reset form with new values
      } else {
        // Handle field-specific errors
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, message]) => {
            form.setError(field as keyof FormData, { message });
          });
        } else if (result.message) {
          // Handle general error message
          form.setError('root', { message: result.message });
        } else {
          form.setError('root', { message: 'An unexpected error occurred' });
        }
      }
    } catch (error) {
      // Handle unexpected errors (network issues, etc.)
      form.setError('root', {
        message: 'Failed to update place profile. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset(); // Reset form when closing
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Place Profile</DialogTitle>
          <DialogDescription>
            Update the place information. Changes will be visible to other users.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {form.formState.errors.root && (
              <div className="text-destructive text-sm">
                {form.formState.errors.root.message}
              </div>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Place Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Place name"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    The name of this place as it should appear to visitors.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="handle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Handle</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-1">@</span>
                      <Input
                        placeholder="place-handle"
                        {...field}
                        disabled={isLoading}
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Unique identifier for this place. This will change the place URL.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe this place..."
                      className="min-h-[100px] resize-none"
                      {...field}
                      disabled={isLoading}
                      maxLength={500}
                    />
                  </FormControl>
                  <FormDescription>
                    {(field.value || '').length}/500 characters. This appears on the place profile.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Main Street, City, State"
                      {...field}
                      value={field.value || ''}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Physical address of this place. Leave empty if not applicable.
                  </FormDescription>
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};
