import { MapPin, MessageCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatINR } from '../../data/dashboardData';
import type { Photographer } from '../../types/dashboard.types';
import { GlassCard } from '../shared/GlassCard';
import { VerifiedBadge } from '../shared/VerifiedBadge';

interface PhotographerDetailsProps {
  photographer: Photographer;
}

export function PhotographerDetails({ photographer }: PhotographerDetailsProps) {
  return (
    <GlassCard className="overflow-hidden" hover={false}>
      <div className="relative h-28">
        <img src={photographer.coverImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <div className="relative px-5 pb-5">
        <img
          src={photographer.avatar}
          alt=""
          className="-mt-8 h-16 w-16 rounded-2xl border-4 border-white object-cover shadow-md"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <h3 className="text-base font-bold text-[#111827]">{photographer.name}</h3>
          {photographer.verified ? <VerifiedBadge /> : null}
        </div>
        <p className="text-xs text-[#6B7280]">{photographer.studio}</p>

        <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#6B7280]">
          <span className="inline-flex items-center gap-1 font-semibold text-[#111827]">
            <Star className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]" />
            {photographer.rating.toFixed(1)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-[#6B46FE]" />
            {photographer.location}
          </span>
        </div>

        <p className="mt-3 text-sm text-[#4B5563]">
          Packages from <span className="font-bold text-[#111827]">{formatINR(photographer.startingPrice)}</span>
        </p>

        <div className="mt-4 flex gap-2">
          <Link
            to="/user/my-photographer"
            className="flex-1 rounded-2xl bg-[#6B46FE] px-3 py-2.5 text-center text-xs font-bold text-white shadow-md shadow-[#6B46FE]/25"
          >
            View profile
          </Link>
          <Link
            to="/user/notifications"
            className="inline-flex items-center justify-center rounded-2xl border border-[#E5E7EB] px-3 py-2.5 text-[#6B46FE]"
            aria-label="Message photographer"
          >
            <MessageCircle className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}
