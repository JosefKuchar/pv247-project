'use server';

import {
  searchLocations,
  createLocation,
  getAllLocations,
  type Location,
} from '@/modules/location/server';
import { db } from '@/db';
import { locationManagement, location, user } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
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

interface SearchLocation {
  id: string;
  name: string;
  handle: string;
  address: string | null;
  latitude: number;
  longitude: number;
}

interface SearchUser {
  id: string;
  name: string;
  handle: string;
  image: string | null;
}

export interface GlobalSearchResult {
  locations: SearchLocation[];
  users: SearchUser[];
}

export async function globalSearchAction(
  query: string,
): Promise<GlobalSearchResult> {
  if (!query || query.trim().length === 0) {
    return { locations: [], users: [] };
  }

  const escapedQuery = query.toLowerCase().replace(/[%_]/g, '\\$&');
  const searchTerm = `%${escapedQuery}%`;

  const [locations, users] = await Promise.all([
    db
      .select({
        id: location.id,
        name: location.name,
        handle: location.handle,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
      })
      .from(location)
      .where(
        sql`lower(${location.name}) like ${searchTerm} or lower(${location.address}) like ${searchTerm}`,
      )
      .limit(10),
    db
      .select({
        id: user.id,
        name: user.name,
        handle: user.handle,
        image: user.image,
      })
      .from(user)
      .where(
        sql`lower(${user.name}) like ${searchTerm} or lower(${user.handle}) like ${searchTerm}`,
      )
      .limit(10),
  ]);

  return { locations, users };
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
