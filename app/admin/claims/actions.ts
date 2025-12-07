'use server';

import { db } from '@/db';
import { locationManagement, location, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { withAdminAuth } from '@/lib/server-actions';

export async function getPendingClaims() {
  const claims = await db
    .select({
      id: locationManagement.id,
      userId: locationManagement.userId,
      locationId: locationManagement.locationId,
      approved: locationManagement.approved,
      createdAt: locationManagement.createdAt,
      userName: user.name,
      userHandle: user.handle,
      userImage: user.image,
      locationName: location.name,
      locationHandle: location.handle,
      locationAddress: location.address,
    })
    .from(locationManagement)
    .innerJoin(user, eq(locationManagement.userId, user.id))
    .innerJoin(location, eq(locationManagement.locationId, location.id))
    .where(eq(locationManagement.approved, false))
    .orderBy(locationManagement.createdAt);

  return claims;
}

export const approveClaim = withAdminAuth(
  async (_userId: string, claimId: string) => {
    await db
      .update(locationManagement)
      .set({ approved: true })
      .where(eq(locationManagement.id, claimId));

    revalidatePath('/admin/claims');
    return { success: true };
  },
);

export const rejectClaim = withAdminAuth(
  async (_userId: string, claimId: string) => {
    await db
      .delete(locationManagement)
      .where(
        and(
          eq(locationManagement.id, claimId),
          eq(locationManagement.approved, false),
        ),
      );

    revalidatePath('/admin/claims');
    return { success: true };
  },
);
