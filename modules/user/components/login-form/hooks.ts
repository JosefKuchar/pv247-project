import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { authClient } from '@/lib/auth-client';
import { type LoginFormSchema } from './schema';

export const useLoginMutationEmail = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginFormSchema) => {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        // callbackURL doesn't work for client-side email login
      });

      // Check if the result indicates an error
      if (result.error) {
        throw new Error(result.error.message || 'Login failed');
      }

      return result;
    },
    onSuccess: () => {
      // Handle redirect manually like with registration
      router.push('/');
    },
  });
};

export const useLoginGithub = async () => {
  const data = await authClient.signIn.social({
    provider: 'github',
    callbackURL: '/',
  });

  console.log('Github reply', data);
};
