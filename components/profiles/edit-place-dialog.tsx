'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updatePlaceAction } from '@/app/actions/place';
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
import { LocationPicker } from '@/components/map/location-picker';
import { MapPin } from 'lucide-react';

const updatePlaceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  handle: z.string().min(1, 'Handle is required'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less'),
  address: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

type FormData = z.infer<typeof updatePlaceSchema>;

type Coordinates = {
  lat: number;
  lng: number;
};

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
  const [selectedMapPosition, setSelectedMapPosition] =
    useState<Coordinates | null>(
      currentPlace.latitude && currentPlace.longitude
        ? { lat: currentPlace.latitude, lng: currentPlace.longitude }
        : null,
    );
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(updatePlaceSchema),
    defaultValues: {
      name: currentPlace.name,
      handle: currentPlace.handle,
      description: currentPlace.description || '',
      address: currentPlace.address || '',
      latitude: currentPlace.latitude || undefined,
      longitude: currentPlace.longitude || undefined,
    },
  });

  // Reset map position when dialog opens with new place data
  useEffect(() => {
    if (isOpen) {
      setSelectedMapPosition(
        currentPlace.latitude && currentPlace.longitude
          ? { lat: currentPlace.latitude, lng: currentPlace.longitude }
          : null,
      );
    }
  }, [isOpen, currentPlace.latitude, currentPlace.longitude]);

  const handleMapLocationSelect = (coords: Coordinates) => {
    setSelectedMapPosition(coords);
    form.setValue('latitude', coords.lat);
    form.setValue('longitude', coords.lng);
  };

  const handleLatChange = (value: string) => {
    const lat = parseFloat(value);
    if (!isNaN(lat)) {
      form.setValue('latitude', lat);
      const lng = form.getValues('longitude');
      if (lng !== undefined) {
        setSelectedMapPosition({ lat, lng });
      }
    } else {
      form.setValue('latitude', undefined);
    }
  };

  const handleLngChange = (value: string) => {
    const lng = parseFloat(value);
    if (!isNaN(lng)) {
      form.setValue('longitude', lng);
      const lat = form.getValues('latitude');
      if (lat !== undefined) {
        setSelectedMapPosition({ lat, lng });
      }
    } else {
      form.setValue('longitude', undefined);
    }
  };

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
    } catch {
      // Handle unexpected errors (network issues, etc.)
      form.setError('root', {
        message: 'Failed to update place profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset(); // Reset form when closing
    setSelectedMapPosition(
      currentPlace.latitude && currentPlace.longitude
        ? { lat: currentPlace.latitude, lng: currentPlace.longitude }
        : null,
    );
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Place Profile</DialogTitle>
          <DialogDescription>
            Update the place information. Changes will be visible to other
            users.
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
                    Unique identifier for this place. This will change the place
                    URL.
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
                    {(field.value || '').length}/500 characters. This appears on
                    the place profile.
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
                    Physical address of this place. Leave empty if not
                    applicable.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location on Map
              </FormLabel>
              <p className="text-muted-foreground text-xs">
                Click on the map to select coordinates, or enter them manually
                below
              </p>
              <LocationPicker
                selectedPosition={selectedMapPosition}
                onLocationSelect={handleMapLocationSelect}
                initialCenter={
                  currentPlace.latitude && currentPlace.longitude
                    ? {
                        lat: currentPlace.latitude,
                        lng: currentPlace.longitude,
                      }
                    : undefined
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g., 49.1951"
                        value={field.value ?? ''}
                        onChange={e => handleLatChange(e.target.value)}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g., 16.6068"
                        value={field.value ?? ''}
                        onChange={e => handleLngChange(e.target.value)}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
