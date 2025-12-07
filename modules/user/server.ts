'server only';

import { db } from '@/db';
import { follow, review, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { randomUUID } from 'crypto';

export const getUserProfile = async (handle: string) => {
  const userData = await db.query.user.findFirst({
    where: eq(user.handle, handle),
  });

  if (!userData) {
    return null;
  }

  const [reviewsCount, followersCount, followingCount] = await Promise.all([
    db.$count(review, eq(review.userId, userData.id)),
    db.$count(follow, eq(follow.followingId, userData.id)),
    db.$count(follow, eq(follow.followerId, userData.id)),
  ]);

  return { ...userData, reviewsCount, followersCount, followingCount };
};

export const getUserFollowStatus = async (targetUserHandle: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If not authenticated, return false
  if (!session?.user?.id) {
    return { isFollowing: false };
  }

  // If viewing own profile, return false (can't follow yourself)
  if (targetUserHandle === session.user.handle) {
    return { isFollowing: false };
  }

  // Get target user by handle
  const targetUser = await db.query.user.findFirst({
    where: eq(user.handle, targetUserHandle),
  });

  // If target user doesn't exist, return false
  if (!targetUser) {
    return { isFollowing: false };
  }

  const existingFollow = await db.query.follow.findFirst({
    where: and(
      eq(follow.followerId, session.user.id),
      eq(follow.followingId, targetUser.id),
    ),
  });

  return {
    isFollowing: !!existingFollow,
  };
};

export async function getUserByHandle(handle: string) {
  return db.query.user.findFirst({
    where: eq(user.handle, handle),
  });
}

export async function checkUserFollowStatus(
  userId: string,
  targetUserId: string,
) {
  return db.query.follow.findFirst({
    where: and(
      eq(follow.followerId, userId),
      eq(follow.followingId, targetUserId),
    ),
  });
}

export async function createUserFollow(userId: string, targetUserId: string) {
  await db.insert(follow).values({
    id: randomUUID(),
    followerId: userId,
    followingId: targetUserId,
  });
}

export async function deleteUserFollow(userId: string, targetUserId: string) {
  await db
    .delete(follow)
    .where(
      and(eq(follow.followerId, userId), eq(follow.followingId, targetUserId)),
    );
}

export async function updateUserProfile(
  userId: string,
  data: {
    name: string;
    email: string;
    handle: string;
    description: string;
    image?: string | null;
  },
) {
  await db.update(user).set(data).where(eq(user.id, userId));
}

export async function checkHandleAvailability(
  handle: string,
  excludeUserId?: string,
) {
  const existingUser = await db.query.user.findFirst({
    where: eq(user.handle, handle),
  });

  if (!existingUser) {
    return { available: true };
  }

  // If excluding current user, check if it's their own handle
  if (excludeUserId && existingUser.id === excludeUserId) {
    return { available: true };
  }

  return { available: false };
}

export async function checkEmailAvailability(
  email: string,
  excludeUserId?: string,
) {
  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (!existingUser) {
    return { available: true };
  }

  // If excluding current user, check if it's their own email
  if (excludeUserId && existingUser.id === excludeUserId) {
    return { available: true };
  }

  return { available: false };
}
