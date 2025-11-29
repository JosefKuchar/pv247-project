import { LogoutButton } from '@/modules/user/components/logout-button';

export default async function Page({ params }: { params: { name: string } }) {
  const wrappedParams = await Promise.resolve(params);

  return (
    <>
      <div>Profile name: {wrappedParams.name}</div>
      <LogoutButton />
    </>
  );
}
