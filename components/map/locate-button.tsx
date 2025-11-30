import { LocateFixed } from 'lucide-react';

interface LocateButtonProps {
  onClick: () => void;
}

export function LocateButton({ onClick }: LocateButtonProps) {
  return (
    <button
      className="fixed right-6 bottom-24 z-[1000] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-none bg-blue-600 shadow-lg md:right-6 md:bottom-6"
      title="Najít moji polohu"
      onClick={onClick}
    >
      <LocateFixed className="mx-auto my-auto block h-8 w-8 text-white" />
    </button>
  );
}
