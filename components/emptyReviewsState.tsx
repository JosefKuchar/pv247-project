import { MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

type EmptyReviewsStateProps = {
  isOwnProfile?: boolean;
  userName?: string;
};

export const EmptyReviewsState = ({
  isOwnProfile = false,
  userName = 'This user'
}: EmptyReviewsStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
      <div className="relative">
        {/* Background circle */}
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
          {/* Stacked icons for visual appeal */}
          <div className="relative">
            <MessageCircle className="w-8 h-8 text-muted-foreground" />
            <Star
              className="w-4 h-4 text-muted-foreground absolute -top-1 -right-1"
              fill="currentColor"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <h3 className="text-lg font-semibold">
          {isOwnProfile ? "No reviews yet" : `${userName} hasn't shared any reviews yet`}
        </h3>

        <p className="text-muted-foreground text-sm">
          {isOwnProfile
            ? "Start sharing your experiences by writing your first review. Help others discover great places!"
            : "Check back later to see what places they've discovered and reviewed."
          }
        </p>
      </div>

      {isOwnProfile && (
        <Button variant="outline" className="mt-4">
          <Star className="w-4 h-4 mr-2" />
          Write your first review
        </Button>
      )}
    </div>
  );
};