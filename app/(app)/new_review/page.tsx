'use client';

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
import { createReview } from '@/app/actions/reviews';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createReviewFormSchema, type CreateReviewFormSchema } from './schema';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';

export default function Page() {
  const methods = useForm<CreateReviewFormSchema>({
    resolver: zodResolver(createReviewFormSchema),
    defaultValues: {
      location: '',
      description: '',
      rating: 0,
      image: [],
    },
  });
  const router = useRouter();

  const createReviewMutation = useMutation({
    mutationFn: async (data: CreateReviewFormSchema) => {
      const photoUrls = data.image?.map(file => file.url) ?? [];

      return createReview({
        description: data.description,
        rating: data.rating,
        locationId: data.location,
        photoUrls,
      });
    },
    onSuccess: result => {
      if (result?.data?.success) {
        router.push('/');
      }
    },
  });

  return (
    <div className="mx-auto mt-6 max-w-5xl space-y-6 px-4 md:mt-10">
      <h1 className="text-3xl font-bold">Create Review</h1>
      <Card>
        <CardContent>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(data => {
                createReviewMutation.mutate(data);
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
                  return createLocationAction(
                    data.name,
                    data.address,
                    data.latitude,
                    data.longitude,
                  );
                }}
                createLabel="Create new location"
              />
              <FormTextarea name="description" label="Description" />
              <FormDropzone name="image" label="Photos" multiple={true} />
              <FormRating name="rating" label="Rating" />
              <Button type="submit" disabled={createReviewMutation.isPending}>
                Submit
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
