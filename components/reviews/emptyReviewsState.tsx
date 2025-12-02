import { MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

type EmptyReviewsStateProps = {
  isOwnProfile?: boolean;
  userName?: string;
};

export const EmptyReviewsState = ({
  isOwnProfile = false,
  userName = 'This user',
}: EmptyReviewsStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 px-4 py-12 text-center">
      <div className="relative">
        {/* Background circle */}
        <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
          {/* Stacked icons for visual appeal */}
          <div className="relative">
            <MessageCircle className="text-muted-foreground h-8 w-8" />
            <Star
              className="text-muted-foreground absolute -top-1 -right-1 h-4 w-4"
              fill="currentColor"
            />
          </div>
        </div>
      </div>

      <div className="max-w-md space-y-2">
        <h3 className="text-lg font-semibold">
          {isOwnProfile
            ? 'No reviews yet'
            : `${userName} hasn't shared any reviews yet`}
        </h3>

        <p className="text-muted-foreground text-sm">
          {isOwnProfile
            ? 'Start sharing your experiences by writing your first review. Help others discover great places!'
            : "Check back later to see what places they've discovered and reviewed."}
        </p>
      </div>

      {isOwnProfile && (
        <Button variant="outline" className="mt-4">
          <Star className="mr-2 h-4 w-4" />
          Write your first review
        </Button>
      )}
    </div>
  );
};
