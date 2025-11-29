'use client';

import { Input } from '@/components/ui/input';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutationEmail, useLoginGithub } from './hooks';

import { loginFormSchema, type LoginFormSchema } from './schema';

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useLoginMutationEmail();

  const onSubmit = (data: LoginFormSchema) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <div className="mb-4 space-y-2">
        <div>
          <label htmlFor="email">Email:</label>
          <Input type="text" id="email" {...register('email')} required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <Input
            type="password"
            id="password"
            {...register('password')}
            required
          />
        </div>
      </div>
      <div className="flex justify-between">
        <Button type="submit">Login</Button>
        <div className="flex flex-col items-end text-sm">
          <span>Don&apos;t have an account?</span>
          <Link href="/register" className="mr-1 text-blue-600 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </form>
  );
};
