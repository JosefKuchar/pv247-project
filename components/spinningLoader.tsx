import { LoaderCircle } from 'lucide-react';

export const SpinningLoader = () => {
  return (
    <LoaderCircle
      className="text-black-500 m-auto h-8 w-8 animate-spin"
      aria-label="Loading..."
    />
  );
};
