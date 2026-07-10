import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type StarRatingProps = {
  rating: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
};

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-[18px] w-[18px]',
};

export function StarRating({ rating, max = 5, size = 'md', className }: StarRatingProps) {
  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      aria-label={`${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={cn(sizeMap[size], 'fill-star text-star')}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}
