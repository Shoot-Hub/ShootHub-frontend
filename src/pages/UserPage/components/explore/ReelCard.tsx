import { Eye, Heart, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCompact } from '../../data/dashboardData';
import type { TrendingReel } from '../../types/dashboard.types';

interface ReelCardProps {
  reel: TrendingReel;
}

export function ReelCard({ reel }: ReelCardProps) {
  return (
    <Link
      to="/user/reels"
      className="group relative block aspect-[9/16] overflow-hidden rounded-3xl bg-black shadow-[0_16px_40px_-16px_rgba(0,0,0,0.45)]"
    >
      <img
        src={reel.thumbnail}
        alt=""
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />

      <span className="absolute right-3 top-3 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
        {reel.duration}
      </span>

      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[#111827] shadow-xl">
          <Play className="h-6 w-6 fill-current pl-0.5" />
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 space-y-2 p-4">
        <div className="flex items-center gap-2">
          <img
            src={reel.creatorAvatar}
            alt=""
            className="h-7 w-7 rounded-full border border-white/40 object-cover"
          />
          <p className="truncate text-xs font-semibold text-white">{reel.creator}</p>
        </div>
        <p className="line-clamp-2 text-sm font-bold leading-snug text-white">{reel.title}</p>
        <div className="flex items-center gap-3 text-[11px] font-medium text-white/80">
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {formatCompact(reel.views)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {formatCompact(reel.likes)}
          </span>
          <span className="ml-auto font-semibold text-white">Watch Reel</span>
        </div>
      </div>
    </Link>
  );
}
