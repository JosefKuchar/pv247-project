import { Loader } from 'lucide-react';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader className="h-6 w-6 animate-spin" />
          <span className="text-muted-foreground">
            Loading place profile...
          </span>
        </div>
      </div>
    </div>
  );
}
