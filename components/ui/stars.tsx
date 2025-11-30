import { Star } from 'lucide-react';

export function Stars({
  rating,
  className = '',
}: {
  rating: number;
  className?: string;
}) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const starSizeClass = className || 'h-5 w-5 md:h-6 md:w-6';

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star
          key={i}
          className={`${starSizeClass} fill-yellow-400 text-yellow-500`}
          strokeWidth={2}
        />,
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className={`relative ${starSizeClass}`}>
          <Star
            className={`absolute ${starSizeClass} text-yellow-500`}
            strokeWidth={2}
          />
          <div className="absolute overflow-hidden" style={{ width: '50%' }}>
            <Star
              className={`${starSizeClass} fill-yellow-400 text-yellow-500`}
              strokeWidth={2}
            />
          </div>
        </div>,
      );
    } else {
      stars.push(
        <Star
          key={i}
          className={`${starSizeClass} text-yellow-500`}
          strokeWidth={2}
        />,
      );
    }
  }
  return <span className="flex gap-0.5">{stars}</span>;
}
