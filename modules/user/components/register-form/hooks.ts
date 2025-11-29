import { useMutation } from '@tanstack/react-query';

import { authClient } from '@/lib/auth-client';
import { type RegisterFormSchema } from './schema';

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (data: RegisterFormSchema) => {
      console.log('Registering user with data:', data);

      await authClient.signUp.email({
        name: data.name,
        handle: data.handle,
        email: data.email,
        password: data.password,
        image: data.image,
        callbackURL: '/',
      });
    },
  });
};
