'use server';

import { randomUUID } from 'crypto';
import { db } from '@/db';
import { follow, userLocationFollow, user, location } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function followUser(targetUserHandle: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  // Get target user by handle
  const targetUser = await db.query.user.findFirst({
    where: eq(user.handle, targetUserHandle),
  });

  if (!targetUser) {
    throw new Error('User not found');
  }

  if (targetUser.id === session.user.id) {
    throw new Error('Cannot follow yourself');
  }

  // Check if already following
  const existingFollow = await db.query.follow.findFirst({
    where: and(
      eq(follow.followerId, session.user.id),
      eq(follow.followingId, targetUser.id),
    ),
  });

  if (existingFollow) {
    throw new Error('Already following this user');
  }

  // Create follow relationship
  await db.insert(follow).values({
    id: randomUUID(),
    followerId: session.user.id,
    followingId: targetUser.id,
  });

  // Revalidate the profile page
  revalidatePath(`/(app)/(profile)/${targetUserHandle}`);

  return { success: true };
}

export async function unfollowUser(targetUserHandle: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  // Get target user by handle
  const targetUser = await db.query.user.findFirst({
    where: eq(user.handle, targetUserHandle),
  });

  if (!targetUser) {
    throw new Error('User not found');
  }

  // Delete follow relationship
  await db
    .delete(follow)
    .where(
      and(
        eq(follow.followerId, session.user.id),
        eq(follow.followingId, targetUser.id),
      ),
    );

  // Revalidate the profile page
  revalidatePath(`/(app)/(profile)/${targetUserHandle}`);

  return { success: true };
}

export async function followLocation(locationHandle: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  // Get location by handle
  const targetLocation = await db.query.location.findFirst({
    where: eq(location.handle, locationHandle),
  });

  if (!targetLocation) {
    throw new Error('Location not found');
  }

  // Check if already following
  const existingFollow = await db.query.userLocationFollow.findFirst({
    where: and(
      eq(userLocationFollow.userId, session.user.id),
      eq(userLocationFollow.locationId, targetLocation.id),
    ),
  });

  if (existingFollow) {
    throw new Error('Already following this location');
  }

  // Create follow relationship
  await db.insert(userLocationFollow).values({
    id: randomUUID(),
    userId: session.user.id,
    locationId: targetLocation.id,
  });

  // Revalidate the profile page
  revalidatePath(`/(app)/(profile)/place/${locationHandle}`);

  return { success: true };
}

export async function unfollowLocation(locationHandle: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  // Get location by handle
  const targetLocation = await db.query.location.findFirst({
    where: eq(location.handle, locationHandle),
  });

  if (!targetLocation) {
    throw new Error('Location not found');
  }

  // Delete follow relationship
  await db
    .delete(userLocationFollow)
    .where(
      and(
        eq(userLocationFollow.userId, session.user.id),
        eq(userLocationFollow.locationId, targetLocation.id),
      ),
    );

  // Revalidate the profile page
  revalidatePath(`/(app)/(profile)/place/${locationHandle}`);

  return { success: true };
}

export async function getFollowStatus(
  targetHandle: string,
  type: 'user' | 'location',
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { isFollowing: false };
  }

  if (type === 'user') {
    // Get target user by handle
    const targetUser = await db.query.user.findFirst({
      where: eq(user.handle, targetHandle),
    });

    if (!targetUser) {
      return { isFollowing: false };
    }

    if (targetUser.id === session.user.id) {
      return { isFollowing: false, isOwnProfile: true };
    }

    const existingFollow = await db.query.follow.findFirst({
      where: and(
        eq(follow.followerId, session.user.id),
        eq(follow.followingId, targetUser.id),
      ),
    });

    return { isFollowing: !!existingFollow, isOwnProfile: false };
  } else {
    // Get location by handle
    const targetLocation = await db.query.location.findFirst({
      where: eq(location.handle, targetHandle),
    });

    if (!targetLocation) {
      return { isFollowing: false };
    }

    const existingFollow = await db.query.userLocationFollow.findFirst({
      where: and(
        eq(userLocationFollow.userId, session.user.id),
        eq(userLocationFollow.locationId, targetLocation.id),
      ),
    });

    return { isFollowing: !!existingFollow, isOwnProfile: false };
  }
}
