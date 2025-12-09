import { z } from 'zod';
import { reviewDescriptionSchema } from '@/lib/validation';

export const uploadedFileSchema = z.object({
  url: z.url(),
  name: z.string(),
});

export type UploadedFile = z.infer<typeof uploadedFileSchema>;

export const createReviewFormSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  description: reviewDescriptionSchema,
  rating: z
    .number()
    .min(1, 'Rating is required')
    .max(5, 'Rating must be between 1 and 5'),
  image: z
    .array(uploadedFileSchema)
    .optional()
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
