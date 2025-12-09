'use server';

import {
  updateUserProfile,
  checkHandleAvailability,
  checkEmailAvailability,
  getUserById,
} from '@/modules/user/server';
import { withAuth } from '@/lib/server-actions';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { nameSchema, handleSchema, emailSchema, descriptionSchema } from '@/lib/validation';

const updateProfileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  handle: handleSchema,
  description: descriptionSchema,
  image: z
    .string()
    .nullable()
    .optional()
    .refine(
      val =>
        !val ||
        val === null ||
        val.trim() === '' ||
        z.url().safeParse(val).success,
      'Invalid image URL',
    )
    .transform(val => (!val || val === null || val.trim() === '' ? null : val)),
});

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;

type FormState = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

async function internalUpdateProfileAction(
  userId: string,
  data: UpdateProfileData,
): Promise<FormState> {
  try {
    // Validate input
    const validatedData = updateProfileSchema.parse(data);

    // Get current user data to check what's changing
    const currentUser = await getUserById(userId);

    if (!currentUser) {
      return { success: false, message: 'User not found' };
    }

    // Collect all validation errors
    const fieldErrors: Record<string, string> = {};

    // Check handle availability if it's changing
    if (validatedData.handle !== currentUser.handle) {
      const handleCheck = await checkHandleAvailability(
        validatedData.handle,
        userId,
      );
      if (!handleCheck.available) {
        fieldErrors.handle = 'This handle is already taken';
      }
    }

    // Check email availability if it's changing
    if (validatedData.email !== currentUser.email) {
      const emailCheck = await checkEmailAvailability(
        validatedData.email,
        userId,
      );
      if (!emailCheck.available) {
        fieldErrors.email = 'This email is already in use';
      }
    }

    // If there are any validation errors, return them all
    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        fieldErrors,
      };
    }

    // Store old handle for revalidation
    const oldHandle = currentUser.handle;

    // Update user profile
    await updateUserProfile(userId, validatedData);

    // Revalidate relevant paths
    if (validatedData.handle !== oldHandle) {
      revalidatePath(`/(app)/(profile)/${validatedData.handle}`);
    } else {
      revalidatePath(`/(app)/(profile)/${oldHandle}`);
    }

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.issues.forEach(err => {
        const field = err.path[0]?.toString();
        if (field) {
          fieldErrors[field] = err.message;
        }
      });
      return { success: false, fieldErrors };
    }

    return { success: false, message: 'An unexpected error occurred' };
  }
}

export const updateProfileAction = withAuth(internalUpdateProfileAction);
