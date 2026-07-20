import { motion } from 'framer-motion';
import { BadgeCheck, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { recentReviews, type Review } from './data';

function ReviewCard({ review, highlight }: { review: Review; highlight?: boolean }) {
  return (
    <article
      className={cn(
        'rounded-xl border bg-[#FAFBFC] p-4 transition hover:shadow-sm',
        highlight ? 'border-[#6C3BFF]/30 bg-[#F8F6FF]/50 ring-1 ring-[#6C3BFF]/10' : 'border-[#EEF0F4]',
      )}
    >
      <div className="flex items-start gap-3">
        <img
          src={review.avatar}
          alt={review.name}
          className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-[#111827]">{review.name}</h3>
            {highlight && (
              <span className="rounded-full bg-[#6C3BFF] px-2 py-0.5 text-[10px] font-bold text-white">
                Your review
              </span>
            )}
            {review.verified && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#E8F9EF] px-2 py-0.5 text-[10px] font-bold text-[#28C76F]">
                <BadgeCheck className="h-3 w-3" /> Verified
              </span>
            )}
            <span className="text-xs text-[#A0A4B0]">{review.timeAgo}</span>
          </div>
          <div className="mt-1 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-3.5 w-3.5',
                  i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-[#E5E7EB]',
                )}
              />
            ))}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[#636E72]">{review.text}</p>
          {review.reply && (
            <div className="mt-3 rounded-lg border-l-2 border-[#6C3BFF] bg-[#F3EEFF]/60 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#6C3BFF]">
                Reply from ShootHub
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#636E72]">{review.reply}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

type Props = {
  prepend?: Review[];
};

export function RecentReviews({ prepend = [] }: Props) {
  const allReviews = [...prepend, ...recentReviews];
  const highlightId = prepend[0]?.id;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-[24px] border border-[#EEF0F4] bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[#111827]">Community Reviews</h2>
        <span className="text-xs font-medium text-[#A0A4B0]">
          {allReviews.length} reviews
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {allReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            highlight={review.id === highlightId}
          />
        ))}
      </div>
    </motion.section>
  );
}
