'use server';

import {
  updateUserProfile,
  checkHandleAvailability,
  checkEmailAvailability,
  getUserById,
} from '@/modules/user/server';
import { authActionClient } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  nameSchema,
  handleSchema,
  emailSchema,
  descriptionSchema,
} from '@/lib/validation';

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
        z.string().url().safeParse(val).success,
      'Invalid image URL',
    )
    .transform(val => (!val || val === null || val.trim() === '' ? null : val)),
});

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;

export const updateProfileAction = authActionClient
  .inputSchema(updateProfileSchema)
  .action(async ({ parsedInput, ctx }) => {
    const userId = ctx.userId;
    const { name, email, handle, description, image } = parsedInput;

    // Get current user data to check what's changing
    const currentUser = await getUserById(userId);

    if (!currentUser) {
      return { success: false, message: 'User not found' };
    }

    // Collect all validation errors
    const fieldErrors: Record<string, string> = {};

    // Check handle availability if it's changing
    if (handle !== currentUser.handle) {
      const handleCheck = await checkHandleAvailability(handle, userId);
      if (!handleCheck.available) {
        fieldErrors.handle = 'This handle is already taken';
      }
    }

    // Check email availability if it's changing
    if (email !== currentUser.email) {
      const emailCheck = await checkEmailAvailability(email, userId);
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
    await updateUserProfile(userId, {
      name,
      email,
      handle,
      description,
      image,
    });

    // Revalidate relevant paths
    if (handle !== oldHandle) {
      revalidatePath(`/(app)/(profile)/${handle}`);
    } else {
      revalidatePath(`/(app)/(profile)/${oldHandle}`);
    }

    return { success: true };
  });
