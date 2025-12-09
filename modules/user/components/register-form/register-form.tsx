'use client';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterMutation } from './hooks';
import { registerFormSchema, type RegisterFormSchema } from './schema';
import { ProfileImageUploader } from '@/components/profiles/profile-image-uploader';
import { FormInput } from '@/components/form/form-input';

export const RegisterForm = () => {
  const mutation = useRegisterMutation();

  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      handle: '',
      email: '',
      password: '',
      confirmPassword: '',
      image: '',
    },
  });

  const onSubmit = (data: RegisterFormSchema) => {
    mutation.mutate(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="mb-4 text-center text-2xl font-bold">Register</h2>

        {mutation.error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
            {mutation.error.message}
          </div>
        )}

        <FormInput
          name="name"
          label="Name"
          type="text"
          disabled={mutation.isPending}
        />

        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-sm">@</span>
            <FormInput
              name="handle"
              label="Handle"
              type="text"
              maxLength={30}
              showCharCount={true}
              warningThreshold={24}
              disabled={mutation.isPending}
              className="flex-1"
            />
          </div>
        </div>

        <FormInput
          name="email"
          label="Email"
          type="email"
          disabled={mutation.isPending}
        />

        <FormInput
          name="password"
          label="Password"
          type="password"
          disabled={mutation.isPending}
        />

        <FormInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          disabled={mutation.isPending}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image (Optional)</FormLabel>
              <FormControl>
                <ProfileImageUploader
                  value={field.value || ''}
                  onChange={field.onChange}
                  disabled={mutation.isPending}
                  endpoint="registrationImageUploader"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Registering...' : 'Register'}
          </Button>
          <div className="flex flex-col items-end text-sm">
            <span>Already have an account?</span>
            <Link href="/login" className="mr-1 text-blue-600 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
