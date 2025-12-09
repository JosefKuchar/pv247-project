'use client';

import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutationEmail, useLoginGithub } from './hooks';
import { loginFormSchema, type LoginFormSchema } from './schema';
import { FormInput } from '@/components/form/form-input';

export const LoginForm = () => {
  const mutation = useLoginMutationEmail();

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormSchema) => {
    mutation.mutate(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="mb-4 text-center text-2xl font-bold">
          Login with provider
        </h2>

        <div className="flex justify-around space-x-2">
          <button
            type="button"
            className="cursor-pointer text-center"
            onClick={useLoginGithub}
          >
            <Github size={46} />
          </button>
        </div>

        <div className="border-black-500 my-4 border-b" />
        <h2 className="mb-4 text-center text-2xl font-bold">or with email</h2>

        {mutation.error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
            {mutation.error.message}
          </div>
        )}

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

        <div className="flex justify-between">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Logging in...' : 'Login'}
          </Button>
          <div className="flex flex-col items-end text-sm">
            <span>Don&apos;t have an account?</span>
            <Link
              href="/register"
              className="mr-1 text-blue-600 hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
