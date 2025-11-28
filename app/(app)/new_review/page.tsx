'use client';

import { createReview } from '@/actions/review/create-review';
import { FormDropzone, FormInput, FormTextarea } from '@/components/form';
import { Button } from '@/components/ui/button';
import { ComboBoxResponsive } from '@/components/ui/combobox';
import { FormProvider, useForm } from 'react-hook-form';

export default function Page() {
  const methods = useForm();

  return (
    <div>
      <ComboBoxResponsive />
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(async () => {
            const formData = new FormData();
            formData.append('locationId', methods.getValues('locationId'));
            formData.append('description', methods.getValues('description'));
            formData.append('rating', methods.getValues('rating'));
            formData.append('photos', methods.getValues('photos'));
            await createReview(formData);
          })}
        >
          <FormInput name="title" label="Title" />
          <FormTextarea name="description" label="Description" />
          <FormDropzone name="image" />
          <Button type="submit">Submit</Button>
        </form>
      </FormProvider>
    </div>
  );
}
