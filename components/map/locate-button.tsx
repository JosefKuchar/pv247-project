import { LocateFixed } from 'lucide-react';

interface LocateButtonProps {
  onClick: () => void;
}

export function LocateButton({ onClick }: LocateButtonProps) {
  return (
    <button
      className="fixed right-6 bottom-24 z-[1000] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-blue-600 drop-shadow-lg transition-colors hover:bg-blue-700 md:right-6 md:bottom-6"
      title="Najít moji polohu"
      onClick={onClick}
    >
      <LocateFixed className="h-8 w-8 text-white" />
    </button>
  );
}
