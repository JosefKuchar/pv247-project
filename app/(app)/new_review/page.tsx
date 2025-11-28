'use client';

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
          onSubmit={methods.handleSubmit(() => {
            console.log(methods.getValues());
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
