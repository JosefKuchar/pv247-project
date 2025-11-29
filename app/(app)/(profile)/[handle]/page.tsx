export default async function Page({ params }: { params: { handle: string } }) {
  const wrappedParams = await Promise.resolve(params);

  return <div>Profile name: {wrappedParams.handle}</div>;
}
