'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updatePlaceAction } from '@/app/actions/place';
import { locationType } from '@/db/schema';
import { nameSchema, handleSchema, descriptionSchema } from '@/lib/validation';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LocationPicker } from '@/components/map/location-picker';
import { MapPin } from 'lucide-react';
import { FormInput } from '@/components/form/form-input';
import { FormTextarea } from '@/components/form/form-textarea';

const updatePlaceSchema = z.object({
  name: nameSchema,
  handle: handleSchema,
  description: descriptionSchema,
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

  const methods = useForm<FormData>({
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
    methods.setValue('latitude', coords.lat);
    methods.setValue('longitude', coords.lng);
  };

  const handleLatChange = (value: string) => {
    const lat = parseFloat(value);
    if (!isNaN(lat)) {
      methods.setValue('latitude', lat);
      const lng = methods.getValues('longitude');
      if (lng !== undefined) {
        setSelectedMapPosition({ lat, lng });
      }
    } else {
      methods.setValue('latitude', undefined);
    }
  };

  const handleLngChange = (value: string) => {
    const lng = parseFloat(value);
    if (!isNaN(lng)) {
      methods.setValue('longitude', lng);
      const lat = methods.getValues('latitude');
      if (lat !== undefined) {
        setSelectedMapPosition({ lat, lng });
      }
    } else {
      methods.setValue('longitude', undefined);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const result = await updatePlaceAction({
        placeId: currentPlace.id,
        ...data,
      });

      if (result?.data?.success) {
        // If handle changed, redirect to new profile URL
        if (data.handle !== currentPlace.handle) {
          router.push(`/place/${data.handle}`);
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
        message: 'Failed to update place profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    methods.reset(); // Reset form when closing
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

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {methods.formState.errors.root && (
              <div className="text-destructive text-sm">
                {methods.formState.errors.root.message}
              </div>
            )}

            <FormInput
              name="name"
              label="Place Name"
              placeholder="Place name"
              disabled={isLoading}
            />

            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <FormInput
                  name="handle"
                  label="@ Handle"
                  placeholder="place-handle"
                  maxLength={30}
                  showCharCount={true}
                  warningThreshold={24}
                  disabled={isLoading}
                  className="flex-1"
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Unique identifier for this place. This will change the place
                URL.
              </p>
            </div>

            <FormTextarea
              name="description"
              label="Description"
              placeholder="Describe this place..."
              maxLength={150}
              showCharCount={true}
              warningThreshold={120}
              disabled={isLoading}
              className="min-h-[100px] resize-none"
            />

            <FormInput
              name="address"
              label="Address"
              placeholder="123 Main Street, City, State"
              disabled={isLoading}
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
                control={methods.control}
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
                control={methods.control}
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
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
