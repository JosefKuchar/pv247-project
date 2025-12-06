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
import { withAuth } from '@/lib/server-actions';
import { revalidatePath } from 'next/cache';

async function internalFollowUserAction(
  userId: string,
  targetUserHandle: string,
) {
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
}
export const followUserAction = withAuth(internalFollowUserAction);

async function internalUnfollowUserAction(
  userId: string,
  targetUserHandle: string,
) {
  const targetUser = await getUserByHandle(targetUserHandle);
  if (!targetUser) {
    throw new Error('User not found');
  }

  // Delete follow relationship
  await deleteUserFollow(userId, targetUser.id);

  revalidatePath(`/(app)/(profile)/${targetUserHandle}`);

  return { success: true };
}
export const unfollowUserAction = withAuth(internalUnfollowUserAction);

async function internalFollowLocationAction(
  userId: string,
  locationHandle: string,
) {
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
}
export const followLocationAction = withAuth(internalFollowLocationAction);

async function internalUnfollowLocationAction(
  userId: string,
  locationHandle: string,
) {
  const targetLocation = await getLocationByHandle(locationHandle);
  if (!targetLocation) {
    throw new Error('Location not found');
  }

  // Delete follow relationship
  await deleteLocationFollow(userId, targetLocation.id);

  revalidatePath(`/(app)/(profile)/place/${locationHandle}`);

  return { success: true };
}
export const unfollowLocationAction = withAuth(internalUnfollowLocationAction);

async function internalGetFollowStatusAction(
  userId: string,
  targetHandle: string,
  type: 'user' | 'location',
) {
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
}
export const getFollowStatusAction = withAuth(internalGetFollowStatusAction);
