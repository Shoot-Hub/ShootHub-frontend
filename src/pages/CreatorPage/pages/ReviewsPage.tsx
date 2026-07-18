import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Send,
  Search,
  Filter,
  ChevronDown,
  MessageSquare,
  ThumbsUp,
  Calendar,
  Building2,
} from 'lucide-react';
import { useAuth } from '@/store';

export function ReviewsPage() {
  const { user } = useAuth();
  const rating = user?.rating;
  const average = rating?.average ?? 0;
  const totalReviews = rating?.totalReviews ?? 0;
  const breakdown = rating?.breakdown ?? { five: 0, four: 0, three: 0, two: 0, one: 0 };

  const [search, setSearch] = useState('');

  const breakdownRows = useMemo(() => {
    const counts = [
      { stars: 5, count: breakdown.five },
      { stars: 4, count: breakdown.four },
      { stars: 3, count: breakdown.three },
      { stars: 2, count: breakdown.two },
      { stars: 1, count: breakdown.one },
    ];
    return counts.map((row) => ({
      ...row,
      percent: totalReviews > 0 ? Math.round((row.count / totalReviews) * 100) : 0,
    }));
  }, [breakdown, totalReviews]);

  const filledStars = Math.round(average);
  const positiveCount = (breakdown.five ?? 0) + (breakdown.four ?? 0);
  const positivePercent =
    totalReviews > 0 ? Math.round((positiveCount / totalReviews) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2D3436]">Reviews</h2>
          <p className="mt-0.5 text-sm text-[#636E72]">
            See what clients are saying about your work.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B46FE]/25 transition-all hover:shadow-lg">
          <Send className="h-4 w-4" />
          Request Review
        </button>
      </div>

      {/* Top cards */}
      <div className="grid gap-4 md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-[#EEF0F4] bg-white p-8 text-center shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]"
        >
          <p className="text-sm font-medium text-[#636E72]">Overall Rating</p>
          <p className="mt-2 text-5xl font-bold tracking-tight text-[#2D3436]">
            {average > 0 ? average.toFixed(1) : '0.0'}
          </p>
          <div className="mt-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= filledStars
                    ? 'fill-[#FF9F43] text-[#FF9F43]'
                    : 'fill-none text-[#D1D5DB]'
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-[#A0A4B0]">
            {totalReviews} review{totalReviews === 1 ? '' : 's'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-col items-start justify-center rounded-2xl border border-[#EEF0F4] bg-white p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] sm:p-8"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F3EEFF]">
            <Star className="h-6 w-6 fill-[#6B46FE] text-[#6B46FE]" />
          </div>
          <h3 className="text-lg font-bold text-[#2D3436]">Reviews details coming soon</h3>
          <p className="mt-1 text-sm text-[#636E72]">
            Start getting reviews from your clients
          </p>
          <button className="mt-5 inline-flex items-center gap-1.5 rounded-xl border-2 border-[#6B46FE] px-4 py-2.5 text-sm font-bold text-[#6B46FE] transition-all hover:bg-[#F3EEFF]">
            Request Your First Review
          </button>
        </motion.div>
      </div>

      {/* Bottom section */}
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        {/* All Reviews */}
        <div className="overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
          <div className="border-b border-[#F5F6F8] px-5 py-4">
            <h3 className="text-base font-bold text-[#2D3436]">All Reviews</h3>
          </div>

          <div className="flex flex-col gap-2 border-b border-[#F5F6F8] p-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:p-4">
            <div className="relative w-full flex-1 sm:min-w-[180px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A4B0]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reviews..."
                className="h-11 w-full rounded-xl border border-[#EEF0F4] bg-[#F8F9FB] py-2 pl-10 pr-3 text-sm outline-none placeholder:text-[#A0A4B0] focus:border-[#6B46FE]/40 focus:bg-white focus:ring-2 focus:ring-[#6B46FE]/15"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 sm:flex">
              <button className="flex h-11 items-center justify-center gap-1 rounded-xl border border-[#EEF0F4] bg-white px-2 text-[11px] font-semibold text-[#636E72] hover:bg-[#F8F9FB] sm:gap-2 sm:px-3 sm:text-xs">
                Ratings
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <button className="flex h-11 items-center justify-center gap-1 rounded-xl border border-[#EEF0F4] bg-white px-2 text-[11px] font-semibold text-[#636E72] hover:bg-[#F8F9FB] sm:gap-2 sm:px-3 sm:text-xs">
                Recent
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <button className="flex h-11 items-center justify-center gap-1 rounded-xl border border-[#EEF0F4] bg-white px-2 text-[11px] font-semibold text-[#636E72] hover:bg-[#F8F9FB] sm:gap-2 sm:px-3 sm:text-xs">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="relative mb-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#F3EEFF]">
                <MessageSquare className="h-12 w-12 text-[#C4B5FD]" strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#6B46FE] to-[#8A60FF] shadow-md shadow-[#6B46FE]/30">
                <Star className="h-4 w-4 fill-white text-white" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#2D3436]">No reviews yet</h3>
            <p className="mt-1.5 max-w-sm text-sm text-[#636E72]">
              You don&apos;t have any reviews. Share your work and ask clients for reviews.
            </p>
            <button className="mt-5 inline-flex items-center gap-1.5 rounded-xl border-2 border-[#6B46FE] px-4 py-2.5 text-sm font-bold text-[#6B46FE] transition-all hover:bg-[#F3EEFF]">
              <Send className="h-4 w-4" />
              Request Review
            </button>
          </div>

          <div className="border-t border-[#F5F6F8] px-5 py-3">
            <p className="text-xs text-[#A0A4B0]">Showing {totalReviews} reviews</p>
          </div>
        </div>

        {/* Right column */}
        <aside className="space-y-4">
          {/* Rating Breakdown */}
          <div className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
            <h3 className="mb-4 text-sm font-bold text-[#2D3436]">Rating Breakdown</h3>
            <div className="space-y-3">
              {breakdownRows.map((row) => (
                <div key={row.stars} className="flex items-center gap-3">
                  <span className="w-14 shrink-0 text-xs font-semibold text-[#636E72]">
                    {row.stars} Stars
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#F0F1F5]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] transition-all"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                  <span className="w-14 shrink-0 text-right text-[11px] font-medium text-[#A0A4B0]">
                    {row.count} ({row.percent}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Overview */}
          <div className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
            <h3 className="mb-4 text-sm font-bold text-[#2D3436]">Review Overview</h3>
            <div className="space-y-3">
              {[
                {
                  label: 'Total Reviews',
                  value: String(totalReviews),
                  icon: Building2,
                  iconBg: 'bg-[#F3EEFF]',
                  iconColor: 'text-[#6B46FE]',
                },
                {
                  label: 'Positive Reviews',
                  value: `${positiveCount} (${positivePercent}%)`,
                  icon: ThumbsUp,
                  iconBg: 'bg-[#E4F8ED]',
                  iconColor: 'text-[#28C76F]',
                },
                {
                  label: 'Average Rating',
                  value: average > 0 ? average.toFixed(1) : '0.0',
                  icon: Star,
                  iconBg: 'bg-[#FFF4E5]',
                  iconColor: 'text-[#FF9F43]',
                },
                {
                  label: 'This Month',
                  value: '0',
                  icon: Calendar,
                  iconBg: 'bg-[#E8F4FD]',
                  iconColor: 'text-[#3498DB]',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl bg-[#FAFBFC] px-3 py-2.5"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
                  >
                    <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#A0A4B0]">{item.label}</p>
                    <p className="text-sm font-bold text-[#2D3436]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
