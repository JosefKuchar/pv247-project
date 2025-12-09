'use server';

import { db } from '@/db';
import { locationManagement } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { adminActionClient } from '@/lib/safe-action';
import { z } from 'zod';

export async function getPendingClaims() {
  const claims = await db.query.locationManagement.findMany({
    where: eq(locationManagement.approved, false),
    orderBy: (locationManagement, { asc }) => [
      asc(locationManagement.createdAt),
    ],
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          handle: true,
          image: true,
        },
      },
      location: {
        columns: {
          id: true,
          name: true,
          handle: true,
          address: true,
        },
      },
    },
  });

  return claims.map(claim => ({
    id: claim.id,
    userId: claim.userId,
    locationId: claim.locationId,
    approved: claim.approved,
    createdAt: claim.createdAt,
    userName: claim.user.name,
    userHandle: claim.user.handle,
    userImage: claim.user.image,
    locationName: claim.location.name,
    locationHandle: claim.location.handle,
    locationAddress: claim.location.address,
  }));
}

const claimIdSchema = z.object({
  claimId: z.string().min(1, 'Claim ID is required'),
});

export const approveClaim = adminActionClient
  .inputSchema(claimIdSchema)
  .action(async ({ parsedInput }) => {
    const { claimId } = parsedInput;

    await db
      .update(locationManagement)
      .set({ approved: true })
      .where(eq(locationManagement.id, claimId));

    revalidatePath('/admin/claims');
    return { success: true };
  });

export const rejectClaim = adminActionClient
  .inputSchema(claimIdSchema)
  .action(async ({ parsedInput }) => {
    const { claimId } = parsedInput;

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
  });
