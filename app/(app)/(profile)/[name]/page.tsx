export default async function Page({ params }: { params: { name: string } }) {
  const wrappedParams = await Promise.resolve(params);

  return <div>Profile name: {wrappedParams.name}</div>;
}
