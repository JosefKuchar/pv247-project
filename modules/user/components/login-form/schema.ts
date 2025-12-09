import { z } from 'zod';
import { emailSchema } from '@/lib/validation';

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
