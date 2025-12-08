import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface ActionsCellProps {
  claimId: string;
  isLoading: boolean;
  onApprove: (claimId: string) => void;
  onReject: (claimId: string) => void;
}

export function ActionsCell({
  claimId,
  isLoading,
  onApprove,
  onReject,
}: ActionsCellProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => onApprove(claimId)}
        disabled={isLoading}
        size="sm"
        className="bg-green-600 hover:bg-green-700"
      >
        <Check className="h-4 w-4" />
        Approve
      </Button>
      <Button
        onClick={() => onReject(claimId)}
        disabled={isLoading}
        size="sm"
        variant="destructive"
      >
        <X className="h-4 w-4" />
        Reject
      </Button>
    </div>
  );
}
