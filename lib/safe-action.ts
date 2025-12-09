import { createSafeActionClient } from 'next-safe-action';
import { headers } from 'next/headers';
import { auth } from './auth';

export const actionClient = createSafeActionClient();

export const authActionClient = createSafeActionClient().use(
  async ({ next }) => {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    return next({
      ctx: {
        userId: session.user.id,
      },
    });
  },
);

export const adminActionClient = createSafeActionClient().use(
  async ({ next }) => {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    if (!session.user.isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }

    return next({
      ctx: {
        userId: session.user.id,
      },
    });
  },
);
