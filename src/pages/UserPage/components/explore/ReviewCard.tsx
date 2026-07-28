import { Star } from 'lucide-react';
import type { CustomerReview } from '../../types/dashboard.types';
import { GlassCard } from '../shared/GlassCard';

interface ReviewCardProps {
  review: CustomerReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <GlassCard className="h-full p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <img
          src={review.photo}
          alt=""
          className="h-12 w-12 rounded-full object-cover ring-2 ring-[#F3EEFF]"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[#111827]">{review.name}</p>
          <p className="text-xs text-[#9CA3AF]">{review.event}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < Math.round(review.rating)
                ? 'fill-[#FBBF24] text-[#FBBF24]'
                : 'fill-[#E5E7EB] text-[#E5E7EB]'
            }`}
          />
        ))}
        <span className="ml-1.5 text-xs font-semibold text-[#6B7280]">{review.rating}</span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[#4B5563]">&ldquo;{review.review}&rdquo;</p>
    </GlassCard>
  );
}
