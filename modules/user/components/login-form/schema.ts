import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
