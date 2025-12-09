'use server';

import {
  updatePlaceProfile,
  checkPlaceHandleAvailability,
  checkUserCanManagePlace,
} from '@/modules/place/server';
import { authActionClient } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { location } from '@/db/schema';
import { nameSchema, handleSchema, descriptionSchema } from '@/lib/validation';

const updatePlaceSchema = z.object({
  placeId: z.string().min(1, 'Place ID is required'),
  name: nameSchema,
  handle: handleSchema,
  description: descriptionSchema,
  address: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export type UpdatePlaceData = z.infer<typeof updatePlaceSchema>;

export const updatePlaceAction = authActionClient
  .inputSchema(updatePlaceSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { placeId, name, handle, description, address, latitude, longitude } =
      parsedInput;
    const userId = ctx.userId;

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
    if (handle !== currentPlace.handle) {
      const handleCheck = await checkPlaceHandleAvailability(handle, placeId);
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
    await updatePlaceProfile(placeId, {
      name,
      handle,
      description,
      address,
      latitude,
      longitude,
    });

    // Revalidate relevant paths
    revalidatePath('/(app)/(profile)/place/[handle]');
    revalidatePath(`/(app)/(profile)/place/${oldHandle}`);
    if (handle !== oldHandle) {
      revalidatePath(`/(app)/(profile)/place/${handle}`);
    }

    return { success: true };
  });
