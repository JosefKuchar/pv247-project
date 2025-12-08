'use client';

// import { createReview } from '@/app/actions/review/create-review';
import {
  searchLocationsAction,
  createLocationAction,
} from '@/app/actions/locations';
import {
  FormCombobox,
  FormDropzone,
  FormRating,
  FormTextarea,
} from '@/components/form';
import { Button } from '@/components/ui/button';
import { createReview } from '@/modules/review/action';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

export default function Page() {
  const methods = useForm();
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create Review</h1>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(async () => {
            const formData = new FormData();
            formData.append('description', methods.getValues('description'));
            formData.append('rating', methods.getValues('rating'));
            formData.append('locationId', methods.getValues('location'));

            // Handle multiple photos
            const photos = methods.getValues('image');
            if (photos) {
              const photoArray = Array.isArray(photos) ? photos : [photos];
              photoArray.forEach(photo => {
                if (photo instanceof File) {
                  formData.append('photos', photo);
                }
              });
            }

            const result = await createReview(formData);
            if (result?.data?.success) {
              router.push('/');
            }
          })}
          className="space-y-4"
        >
          <FormCombobox
            name="location"
            label="Location"
            queryKey="locations"
            fetchOptions={async (query: string) => {
              return searchLocationsAction(query);
            }}
            allowCreate={true}
            onCreateNew={async data => {
              return createLocationAction(data.name, data.address);
            }}
            createLabel="Create new location"
          />
          <FormTextarea name="description" label="Description" />
          <FormDropzone
            name="image"
            label="Photos"
            multiple={true}
            accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] }}
          />
          <FormRating name="rating" label="Rating" />
          <Button type="submit">Submit</Button>
        </form>
      </FormProvider>
    </div>
  );
}
