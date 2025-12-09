import { z } from 'zod';
import {
  nameSchema,
  handleSchema,
  emailSchema,
  passwordSchema,
} from '@/lib/validation';

export const registerFormSchema = z
  .object({
    name: nameSchema,
    handle: handleSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
    image: z.string().optional(),
    // image: z.file().mime(['image/jpeg', 'image/png', 'image/jpg']),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
