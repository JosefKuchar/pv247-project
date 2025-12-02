import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

/**
 * Wraps a Server Action function to perform authentication first.
 * If successful, it calls the wrapped function with the authenticated userId.
 * @param actionFn The function containing your business logic.
 * @returns A new function ready to be exported as a Server Action.
 */
export function withAuth<T extends unknown[], R>(
  actionFn: (userId: string, ...args: T) => Promise<R>,
): (...args: T) => Promise<R> {
  return async function (...args: T): Promise<R> {
    const session = await getSession();

    // The essential check
    if (!session?.user?.id) {
      // For Server Actions that throw, Next.js handles the error
      throw new Error('Not authenticated');
    }

    const userId = session.user.id;

    // Call the original function
    // passing the userId as the first argument
    return actionFn(userId, ...args);
  };
}
