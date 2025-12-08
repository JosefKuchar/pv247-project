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
import { withAuth } from '@/lib/server-actions';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

export async function searchLocationsAction(query: string, limit: number = 20) {
  return searchLocations(query, limit);
}

export { type Location } from '@/modules/location/server';

export async function getAllLocationsAction(): Promise<Location[]> {
  try {
    return await getAllLocations();
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

export async function createLocationAction(
  name: string,
  address?: string | null,
  latitude?: number,
  longitude?: number,
) {
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
}

async function internalClaimPlaceAction(
  userId: string,
  locationHandle: string,
): Promise<{ success: boolean; message?: string }> {
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
}

async function internalUnclaimPlaceAction(
  userId: string,
  locationHandle: string,
): Promise<{ success: boolean; message?: string }> {
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
}

export const claimPlaceAction = withAuth(internalClaimPlaceAction);
export const unclaimPlaceAction = withAuth(internalUnclaimPlaceAction);
