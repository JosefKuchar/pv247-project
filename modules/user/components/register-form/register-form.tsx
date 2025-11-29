'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterMutation } from './hooks';
import { registerFormSchema, type RegisterFormSchema } from './schema';

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: '', handle: '', email: '', password: '', image: '' },
  });

  const mutation = useRegisterMutation();

  const onSubmit = (data: RegisterFormSchema) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="mb-4 text-center text-2xl font-bold">Register</h2>
      <div className="mb-4 space-y-2">
        <div>
          <label htmlFor="name">Name:</label>
          <Input type="text" id="name" {...register('name')} required />
        </div>
        <div>
          <label htmlFor="handle">Handle:</label>
          <Input type="text" id="handle" {...register('handle')} required />
        </div>
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
        <div>
          <label htmlFor="image">Image URL:</label>
          <Input type="text" id="image" {...register('image')} />
        </div>
      </div>
      <div className="flex justify-between">
        <Button type="submit">Register</Button>
        <div className="flex flex-col items-end text-sm">
          <span>Already have an account?</span>
          <Link href="/login" className="mr-1 text-blue-600 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </form>
  );
};
