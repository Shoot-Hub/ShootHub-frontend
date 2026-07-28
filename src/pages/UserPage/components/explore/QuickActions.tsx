import {
  Clapperboard,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { QuickAction } from '../../types/dashboard.types';

const iconMap: Record<QuickAction['icon'], LucideIcon> = {
  search: Search,
  reels: Clapperboard,
  map: MapPin,
  heart: Heart,
  users: Users,
  message: MessageCircle,
};

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {actions.map((action) => {
        const Icon = iconMap[action.icon];
        return (
          <Link
            key={action.id}
            to={action.path}
            className="group flex items-center gap-4 rounded-3xl border border-[#EEF0F4] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6B46FE]/25 hover:shadow-[0_16px_40px_-16px_rgba(107,70,254,0.28)]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F3EEFF] text-[#6B46FE] transition-colors group-hover:bg-[#6B46FE] group-hover:text-white">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#111827]">{action.label}</p>
              <p className="truncate text-xs text-[#9CA3AF]">{action.description}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
