import { z } from 'zod';

// TODO: proper filtering of valid strings
export const registerFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    handle: z.string().min(1, 'Handle is required'),
    email: z.email('Email is required'),
    password: z.string().min(8, 'Password is required'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
    image: z.mime(['image/jpeg', 'image/png', 'image/jpg']),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords are not the same',
        path: ['confirmPassword'],
      });
    }
  });

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
