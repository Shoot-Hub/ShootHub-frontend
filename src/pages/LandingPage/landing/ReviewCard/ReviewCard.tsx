import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { StarRating } from '../StarRating';
import { createFloatAnimation } from '@/lib/motion';

export type ReviewCardProps = {
  rating: number;
  maxRating?: number;
  reviewCount: string;
  className?: string;
  floatDelay?: number;
};

export function ReviewCard({
  rating,
  maxRating = 5,
  reviewCount,
  className,
  floatDelay = 0,
}: ReviewCardProps) {
  return (
    <motion.div
      animate={createFloatAnimation({ delay: floatDelay, duration: 4.2, distance: 12 })}
      className={cn(
        'flex flex-col gap-1.5 rounded-2xl bg-white px-4 py-3.5 shadow-card-lg',
        className,
      )}
    >
      <StarRating rating={rating} size="sm" />
      <span className="text-sm font-bold leading-tight text-ink">
        {rating} / {maxRating}
      </span>
      <span className="text-xs font-medium text-ink-muted">From {reviewCount}</span>
    </motion.div>
  );
}
