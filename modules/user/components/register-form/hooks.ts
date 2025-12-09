import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { authClient } from '@/lib/auth-client';
import { type RegisterFormSchema } from './schema';

export const useRegisterMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterFormSchema) => {
      const result = await authClient.signUp.email({
        name: data.name,
        handle: data.handle,
        email: data.email,
        password: data.password,
        image: data.image,
        // callbackURL doesn't work for client-side email signups
      });

      // Check if the result indicates an error
      if (result.error) {
        throw new Error(result.error.message || 'Registration failed');
      }

      // Check if user was not created
      if (!result.data) {
        throw new Error('Registration failed');
      }

      return result;
    },
    onSuccess: () => {
      // Better Auth callbackURL doesn't work for client-side email signups
      // Use router.push() instead as recommended by Better Auth community
      router.push('/');
    },
  });
};
