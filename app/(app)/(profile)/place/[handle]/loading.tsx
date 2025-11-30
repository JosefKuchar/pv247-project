import { Loader } from 'lucide-react';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader className="w-6 h-6 animate-spin" />
          <span className="text-muted-foreground">Loading place profile...</span>
        </div>
      </div>
    </div>
  );
}
