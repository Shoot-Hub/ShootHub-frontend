import {
  Download,
  Heart,
  ImageIcon,
  MessageCircle,
  Video,
} from 'lucide-react';
import type { EventStats } from '../types';
import { formatCompactCount } from '../utils';

const ITEMS = [
  { key: 'photos', icon: ImageIcon, label: 'Photos' },
  { key: 'videos', icon: Video, label: 'Videos' },
  { key: 'favorites', icon: Heart, label: 'Favorites' },
  { key: 'downloads', icon: Download, label: 'Downloads' },
  { key: 'comments', icon: MessageCircle, label: 'Comments' },
] as const;

type Props = {
  stats: EventStats;
  compact?: boolean;
};

export function EventStatsRow({ stats, compact }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      {ITEMS.map(({ key, icon: Icon, label }) => (
        <span
          key={key}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#636E72] sm:text-xs"
          title={label}
        >
          <Icon className="h-3.5 w-3.5 text-[#6C3BFF]/80" strokeWidth={2} />
          {formatCompactCount(stats[key])}
          {!compact ? (
            <span className="hidden text-[#A0A4B0] sm:inline">{label}</span>
          ) : null}
        </span>
      ))}
    </div>
  );
}
