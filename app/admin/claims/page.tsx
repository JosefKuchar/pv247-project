import { getPendingClaims } from '@/app/actions/admin';
import { ClaimsTable } from '@/components/admin/claims-table';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.isAdmin) {
    redirect('/');
  }

  const claims = await getPendingClaims();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Location management claims</h1>
        <p className="mt-2 text-gray-600">
          Review and approve requests from users to manage locations
        </p>
      </div>

      <ClaimsTable initialData={claims} />
    </div>
  );
}
