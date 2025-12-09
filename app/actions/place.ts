'use server';

import {
  updatePlaceProfile,
  checkPlaceHandleAvailability,
  checkUserCanManagePlace,
} from '@/modules/place/server';
import { withAuth } from '@/lib/server-actions';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { location } from '@/db/schema';
import { nameSchema, handleSchema, descriptionSchema } from '@/lib/validation';

const updatePlaceSchema = z.object({
  name: nameSchema,
  handle: handleSchema,
  description: descriptionSchema,
  address: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export type UpdatePlaceData = z.infer<typeof updatePlaceSchema>;

type FormState = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

async function internalUpdatePlaceAction(
  userId: string,
  placeId: string,
  data: UpdatePlaceData,
): Promise<FormState> {
  try {
    // Validate input
    const validatedData = updatePlaceSchema.parse(data);

    // Check if user can manage this place
    const canManage = await checkUserCanManagePlace(userId, placeId);
    if (!canManage) {
      return {
        success: false,
        message: 'You are not authorized to edit this place',
      };
    }

    // Get current place data to check what's changing
    const currentPlace = await db.query.location.findFirst({
      where: eq(location.id, placeId),
    });

    if (!currentPlace) {
      return { success: false, message: 'Place not found' };
    }

    // Collect all validation errors
    const fieldErrors: Record<string, string> = {};

    // Check handle availability if it's changing
    if (validatedData.handle !== currentPlace.handle) {
      const handleCheck = await checkPlaceHandleAvailability(
        validatedData.handle,
        placeId,
      );
      if (!handleCheck.available) {
        fieldErrors.handle = 'This handle is already taken';
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
    const oldHandle = currentPlace.handle;

    // Update place profile
    await updatePlaceProfile(placeId, validatedData);

    // Revalidate relevant paths
    revalidatePath('/(app)/(profile)/place/[handle]');
    revalidatePath(`/(app)/(profile)/place/${oldHandle}`);
    if (validatedData.handle !== oldHandle) {
      revalidatePath(`/(app)/(profile)/place/${validatedData.handle}`);
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

export const updatePlaceAction = withAuth(internalUpdatePlaceAction);
