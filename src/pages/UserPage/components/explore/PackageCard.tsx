import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatINR } from '../../data/dashboardData';
import type { PopularPackage } from '../../types/dashboard.types';
import { GlassCard } from '../shared/GlassCard';

interface PackageCardProps {
  pkg: PopularPackage;
}

export function PackageCard({ pkg }: PackageCardProps) {
  return (
    <GlassCard
      className={`relative flex h-full flex-col p-5 sm:p-6 ${
        pkg.highlight ? 'ring-2 ring-[#6B46FE]/40' : ''
      }`}
    >
      {pkg.highlight ? (
        <span className="absolute -top-3 left-5 rounded-full bg-[#6B46FE] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
          Most loved
        </span>
      ) : null}

      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B46FE]">
        {pkg.tier}
      </p>
      <h3 className="mt-2 text-lg font-bold text-[#111827]">{pkg.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#6B7280]">{pkg.description}</p>

      <p className="mt-5 text-2xl font-bold tracking-tight text-[#111827]">
        {formatINR(pkg.startingPrice)}
        <span className="ml-1 text-xs font-medium text-[#9CA3AF]">starting</span>
      </p>

      <ul className="mt-4 space-y-2">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-[#4B5563]">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6B46FE]" />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        to="/user/explore-creators"
        className={`mt-6 inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
          pkg.highlight
            ? 'bg-[#6B46FE] text-white shadow-lg shadow-[#6B46FE]/30 hover:bg-[#5530e8]'
            : 'border border-[#E5E7EB] text-[#111827] hover:border-[#6B46FE]/40 hover:text-[#6B46FE]'
        }`}
      >
        Book Now
      </Link>
    </GlassCard>
  );
}
