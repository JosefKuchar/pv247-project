import { z } from 'zod';

export const createReviewFormSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  rating: z
    .number()
    .min(1, 'Rating is required')
    .max(5, 'Rating must be between 1 and 5'),
  image: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      files => {
        if (!files || files.length === 0) return true;
        return files.every(file => file.size <= 10 * 1024 * 1024); // 10MB max
      },
      {
        message: 'Each photo must be less than 10MB',
      },
    )
    .refine(
      files => {
        if (!files || files.length === 0) return true;
        return files.length <= 10; // Max 10 photos
      },
      {
        message: 'Maximum 10 photos allowed',
      },
    ),
});

export type CreateReviewFormSchema = z.infer<typeof createReviewFormSchema>;
