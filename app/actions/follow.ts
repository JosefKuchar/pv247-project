'use server';

import { randomUUID } from 'crypto';
import { db } from '@/db';
import { follow, userLocationFollow, user, location } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
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

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function followUserAction(targetUserHandle: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  // Get target user by handle
  const targetUser = await getUserByHandle(targetUserHandle);

  if (!targetUser) {
    throw new Error('User not found');
  }

  if (targetUser.id === session.user.id) {
    throw new Error('Cannot follow yourself');
  }

  // Check if already following
  const existingFollow = await checkUserFollowStatus(
    session.user.id,
    targetUser.id,
  );

  if (existingFollow) {
    throw new Error('Already following this user');
  }

  // Create follow relationship
  await createUserFollow(session.user.id, targetUser.id);

  revalidatePath(`/(app)/(profile)/${targetUserHandle}`);

  return { success: true };
}

export async function unfollowUserAction(targetUserHandle: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  // Get target user by handle
  const targetUser = await getUserByHandle(targetUserHandle);

  if (!targetUser) {
    throw new Error('User not found');
  }

  // Delete follow relationship
  await deleteUserFollow(session.user.id, targetUser.id);

  revalidatePath(`/(app)/(profile)/${targetUserHandle}`);

  return { success: true };
}

export async function followLocationAction(locationHandle: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  // Get location by handle
  const targetLocation = await getLocationByHandle(locationHandle);

  if (!targetLocation) {
    throw new Error('Location not found');
  }

  // Check if already following
  const existingFollow = await checkLocationFollowStatus(
    session.user.id,
    targetLocation.id,
  );

  if (existingFollow) {
    throw new Error('Already following this location');
  }

  // Create follow relationship
  await createLocationFollow(session.user.id, targetLocation.id);

  // Revalidate the profile page
  revalidatePath(`/(app)/(profile)/place/${locationHandle}`);

  return { success: true };
}

export async function unfollowLocationAction(locationHandle: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  // Get location by handle
  const targetLocation = await getLocationByHandle(locationHandle);

  if (!targetLocation) {
    throw new Error('Location not found');
  }

  // Delete follow relationship
  await deleteLocationFollow(session.user.id, targetLocation.id);

  // Revalidate the profile page
  revalidatePath(`/(app)/(profile)/place/${locationHandle}`);

  return { success: true };
}

export async function getFollowStatusAction(
  targetHandle: string,
  type: 'user' | 'location',
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { isFollowing: false };
  }

  if (type === 'user') {
    const targetUser = await getUserByHandle(targetHandle);

    if (!targetUser) {
      return { isFollowing: false };
    }

    if (targetUser.id === session.user.id) {
      return { isFollowing: false, isOwnProfile: true };
    }

    const existingFollow = await checkUserFollowStatus(
      session.user.id,
      targetUser.id,
    );

    return { isFollowing: !!existingFollow, isOwnProfile: false };
  } else {
    // Get location by handle
    const targetLocation = await getLocationByHandle(targetHandle);

    if (!targetLocation) {
      return { isFollowing: false };
    }

    const existingFollow = await checkLocationFollowStatus(
      session.user.id,
      targetLocation.id,
    );

    return { isFollowing: !!existingFollow, isOwnProfile: false };
  }
}
