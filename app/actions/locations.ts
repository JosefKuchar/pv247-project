'use server';

import {
  searchLocations,
  createLocation,
  getAllLocations,
  type Location,
} from '@/modules/location/server';
import { db } from '@/db';
import { locationManagement, location } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { authActionClient, actionClient } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';
import { z } from 'zod';

const searchLocationsSchema = z.object({
  query: z.string(),
  limit: z.number().int().positive().max(100).default(20),
});

export const searchLocationsAction = actionClient
  .inputSchema(searchLocationsSchema)
  .action(async ({ parsedInput }) => {
    const { query, limit } = parsedInput;
    return searchLocations(query, limit);
  });

export { type Location } from '@/modules/location/server';

export async function getAllLocationsAction(): Promise<Location[]> {
  try {
    return await getAllLocations();
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

const createLocationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().nullable().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const createLocationAction = actionClient
  .inputSchema(createLocationSchema)
  .action(async ({ parsedInput }) => {
    const { name, address, latitude, longitude } = parsedInput;

    try {
      const newLocation = await createLocation(
        name,
        address,
        latitude ?? 0,
        longitude ?? 0,
      );
      return {
        success: true,
        data: {
          value: newLocation.id,
          label: newLocation.address
            ? `${newLocation.name} - ${newLocation.address}`
            : newLocation.name,
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to create location',
      };
    }
  });

const locationHandleSchema = z.object({
  locationHandle: z.string().min(1, 'Location handle is required'),
});

export const claimPlaceAction = authActionClient
  .inputSchema(locationHandleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { locationHandle } = parsedInput;
    const userId = ctx.userId;

    try {
      // Get location by handle
      const targetLocation = await db.query.location.findFirst({
        where: eq(location.handle, locationHandle),
      });

      if (!targetLocation) {
        return { success: false, message: 'Location not found' };
      }

      // Check if user already has a claim (approved or pending)
      const existingClaim = await db.query.locationManagement.findFirst({
        where: and(
          eq(locationManagement.userId, userId),
          eq(locationManagement.locationId, targetLocation.id),
        ),
      });

      if (existingClaim) {
        if (existingClaim.approved) {
          return {
            success: false,
            message: 'You already manage this location',
          };
        }
        return {
          success: false,
          message: 'You already have a pending claim for this location',
        };
      }

      // Create new claim (pending approval)
      await db.insert(locationManagement).values({
        id: randomUUID(),
        userId,
        locationId: targetLocation.id,
        approved: false,
      });

      revalidatePath(`/(app)/(profile)/place/${locationHandle}`);
      revalidatePath('/admin/claims');

      return {
        success: true,
        message: 'Claim submitted successfully. Waiting for admin approval.',
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to submit claim. Please try again.',
      };
    }
  });

export const unclaimPlaceAction = authActionClient
  .inputSchema(locationHandleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { locationHandle } = parsedInput;
    const userId = ctx.userId;

    try {
      // Get location by handle
      const targetLocation = await db.query.location.findFirst({
        where: eq(location.handle, locationHandle),
      });

      if (!targetLocation) {
        return { success: false, message: 'Location not found' };
      }

      // Find the user's management record (must be approved)
      const existingManagement = await db.query.locationManagement.findFirst({
        where: and(
          eq(locationManagement.userId, userId),
          eq(locationManagement.locationId, targetLocation.id),
          eq(locationManagement.approved, true),
        ),
      });

      if (!existingManagement) {
        return {
          success: false,
          message: 'You are not managing this location',
        };
      }

      // Delete the management record
      await db
        .delete(locationManagement)
        .where(eq(locationManagement.id, existingManagement.id));

      revalidatePath(`/(app)/(profile)/place/${locationHandle}`);
      revalidatePath('/admin/claims');

      return {
        success: true,
        message: 'Location unclaimed successfully',
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to unclaim location. Please try again.',
      };
    }
  });
