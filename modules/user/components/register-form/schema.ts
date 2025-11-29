import { z } from 'zod';

// TODO: proper filtering of valid strings
export const registerFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    handle: z.string().min(1, 'Handle is required'),
    email: z.email('Email is required'),
    password: z.string().min(8, 'Password must have at at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must have at at least 8 characters'),
    image: z.string().optional(),
    // image: z.file().mime(['image/jpeg', 'image/png', 'image/jpg']),
  }).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ['confirmPassword']
      });
    }
  });

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
