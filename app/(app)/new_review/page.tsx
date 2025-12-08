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

export default function Page() {
  const methods = useForm();

  return (
    <div>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(async () => {
            const formData = new FormData();
            formData.append('description', methods.getValues('description'));
            formData.append('rating', methods.getValues('rating'));
            formData.append('locationId', methods.getValues('location'));
            // formData.append('photos', methods.getValues('photos'));
            await createReview(formData);
          })}
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
          <FormDropzone name="image" />
          <FormRating name="rating" label="Rating" />
          <Button type="submit">Submit</Button>
        </form>
      </FormProvider>
    </div>
  );
}
