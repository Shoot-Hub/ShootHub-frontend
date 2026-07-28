import { MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatINR } from '../../data/dashboardData';
import type { Photographer } from '../../types/dashboard.types';
import { GlassCard } from '../shared/GlassCard';
import { VerifiedBadge } from '../shared/VerifiedBadge';

interface CreatorCardProps {
  creator: Photographer;
}

export function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <GlassCard className="group overflow-hidden">
      <div className="relative h-40 overflow-hidden sm:h-48">
        <img
          src={creator.coverImage}
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <img
              src={creator.avatar}
              alt=""
              className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-md"
            />
            <div>
              <p className="text-sm font-bold text-white">{creator.name}</p>
              <p className="text-[11px] text-white/80">{creator.studio}</p>
            </div>
          </div>
          {creator.verified ? <VerifiedBadge className="bg-white/95 backdrop-blur" /> : null}
        </div>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
          <span className="inline-flex items-center gap-1 font-semibold text-[#111827]">
            <Star className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]" />
            {creator.rating.toFixed(1)}
            <span className="font-medium text-[#9CA3AF]">({creator.reviewCount})</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-[#6B46FE]" />
            {creator.location}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {creator.categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full bg-[#F3EEFF] px-2.5 py-1 text-[10px] font-semibold text-[#6B46FE]"
            >
              {cat}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#F3F4F6] pt-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#9CA3AF]">
              Starting from
            </p>
            <p className="text-sm font-bold text-[#111827]">{formatINR(creator.startingPrice)}</p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/user/explore-creators"
              className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-xs font-semibold text-[#374151] transition-colors hover:border-[#6B46FE]/30 hover:text-[#6B46FE]"
            >
              View Profile
            </Link>
            <Link
              to="/user/explore-creators"
              className="rounded-xl bg-[#6B46FE] px-3 py-2 text-xs font-bold text-white shadow-md shadow-[#6B46FE]/25 transition-all hover:bg-[#5530e8]"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
