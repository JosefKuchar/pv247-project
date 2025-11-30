import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ReviewCardSkeleton = () => {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex flex-col gap-3 pb-4">
        {/* Location and ratings skeleton */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-3 w-3 rounded-sm" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-4 w-4 rounded-sm" />
              ))}
            </div>
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Photo placeholder skeleton */}
        <Skeleton className="mt-4 h-64 w-full rounded-lg" />
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4">
        {/* Action buttons skeleton */}
        <div className="flex gap-4">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-5" />
        </div>
        <Skeleton className="h-5 w-5" />
      </CardFooter>
    </Card>
  );
};

export const ReviewListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ReviewCardSkeleton key={index} />
      ))}
    </div>
  );
};
