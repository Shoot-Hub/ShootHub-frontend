import {
  BadgeCheck,
  CalendarCheck2,
  Images,
  ScanFace,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { WhyShootHubItem } from '../../types/dashboard.types';
import { GlassCard } from '../shared/GlassCard';

const iconMap: Record<WhyShootHubItem['icon'], LucideIcon> = {
  verified: BadgeCheck,
  ai: ScanFace,
  gallery: Images,
  delivery: Zap,
  booking: CalendarCheck2,
};

interface WhyShootHubProps {
  items: WhyShootHubItem[];
}

export function WhyShootHub({ items }: WhyShootHubProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item) => {
        const Icon = iconMap[item.icon];
        return (
          <GlassCard key={item.id} className="p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3EEFF] text-[#6B46FE]">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-sm font-bold text-[#111827]">{item.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[#6B7280]">{item.description}</p>
          </GlassCard>
        );
      })}
    </div>
  );
}
