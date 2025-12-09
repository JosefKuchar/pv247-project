'use server';

import {
  getUserByHandle,
  checkUserFollowStatus,
  createUserFollow,
  deleteUserFollow,
} from '@/modules/user/server';
import {
  checkLocationFollowStatus,
  createLocationFollow,
  deleteLocationFollow,
  getLocationByHandle,
} from '@/modules/location/server';
import { authActionClient } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const userHandleSchema = z.object({
  targetUserHandle: z.string().min(1, 'Target user handle is required'),
});

const locationHandleSchema = z.object({
  locationHandle: z.string().min(1, 'Location handle is required'),
});

const followStatusSchema = z.object({
  targetHandle: z.string().min(1, 'Target handle is required'),
  type: z.enum(['user', 'location']),
});

export const followUserAction = authActionClient
  .inputSchema(userHandleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { targetUserHandle } = parsedInput;
    const userId = ctx.userId;

    const targetUser = await getUserByHandle(targetUserHandle);
    if (!targetUser) {
      throw new Error('User not found');
    }

    if (targetUser.id === userId) {
      throw new Error('Cannot follow yourself');
    }

    // Check if already following
    const existingFollow = await checkUserFollowStatus(userId, targetUser.id);
    if (existingFollow) {
      throw new Error('Already following this user');
    }

    // Create follow relationship
    await createUserFollow(userId, targetUser.id);

    revalidatePath(`/(app)/(profile)/${targetUserHandle}`);

    return { success: true };
  });

export const unfollowUserAction = authActionClient
  .inputSchema(userHandleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { targetUserHandle } = parsedInput;
    const userId = ctx.userId;

    const targetUser = await getUserByHandle(targetUserHandle);
    if (!targetUser) {
      throw new Error('User not found');
    }

    // Delete follow relationship
    await deleteUserFollow(userId, targetUser.id);

    revalidatePath(`/(app)/(profile)/${targetUserHandle}`);

    return { success: true };
  });

export const followLocationAction = authActionClient
  .inputSchema(locationHandleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { locationHandle } = parsedInput;
    const userId = ctx.userId;

    const targetLocation = await getLocationByHandle(locationHandle);
    if (!targetLocation) {
      throw new Error('Location not found');
    }

    // Check if already following
    const existingFollow = await checkLocationFollowStatus(
      userId,
      targetLocation.id,
    );
    if (existingFollow) {
      throw new Error('Already following this location');
    }

    // Create follow relationship
    await createLocationFollow(userId, targetLocation.id);

    revalidatePath(`/(app)/(profile)/place/${locationHandle}`);

    return { success: true };
  });

export const unfollowLocationAction = authActionClient
  .inputSchema(locationHandleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { locationHandle } = parsedInput;
    const userId = ctx.userId;

    const targetLocation = await getLocationByHandle(locationHandle);
    if (!targetLocation) {
      throw new Error('Location not found');
    }

    // Delete follow relationship
    await deleteLocationFollow(userId, targetLocation.id);

    revalidatePath(`/(app)/(profile)/place/${locationHandle}`);

    return { success: true };
  });

export const getFollowStatusAction = authActionClient
  .inputSchema(followStatusSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { targetHandle, type } = parsedInput;
    const userId = ctx.userId;

    if (type === 'user') {
      const targetUser = await getUserByHandle(targetHandle);
      if (!targetUser) {
        return { isFollowing: false };
      }

      if (targetUser.id === userId) {
        return { isFollowing: false, isOwnProfile: true };
      }

      const existingFollow = await checkUserFollowStatus(userId, targetUser.id);

      return { isFollowing: !!existingFollow, isOwnProfile: false };
    } else {
      const targetLocation = await getLocationByHandle(targetHandle);
      if (!targetLocation) {
        return { isFollowing: false };
      }

      const existingFollow = await checkLocationFollowStatus(
        userId,
        targetLocation.id,
      );

      return { isFollowing: !!existingFollow, isOwnProfile: false };
    }
  });
