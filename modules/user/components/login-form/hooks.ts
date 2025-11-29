import { useMutation } from '@tanstack/react-query';

import { authClient } from '@/lib/auth-client';
import { type LoginFormSchema } from './schema';

export const useLoginMutationEmail = () => {
  return useMutation({
    mutationFn: async (data: LoginFormSchema) => {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: '/',
      });
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
