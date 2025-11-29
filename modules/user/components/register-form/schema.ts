import { z } from 'zod';

export const registerFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  handle: z.string().min(1, 'Handle is required'),
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
  image: z.string().optional(),
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
