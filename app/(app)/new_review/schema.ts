import { z } from 'zod';

export const uploadedFileSchema = z.object({
  url: z.url(),
  name: z.string(),
});

export type UploadedFile = z.infer<typeof uploadedFileSchema>;

export const createReviewFormSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  description: z
    .string()
    .max(2500, 'Description must be under 2,500 characters'),
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
