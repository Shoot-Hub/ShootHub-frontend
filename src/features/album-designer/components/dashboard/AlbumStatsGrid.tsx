import {
  BookImage,
  CheckCircle2,
  FileEdit,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { AlbumStats } from '../../types';

const cards: {
  key: keyof AlbumStats;
  label: string;
  icon: typeof BookImage;
  color: string;
  bg: string;
}[] = [
  { key: 'total', label: 'Total Albums', icon: BookImage, color: 'text-[#6B46FE]', bg: 'bg-[#F3EEFF]' },
  { key: 'drafts', label: 'Drafts', icon: FileEdit, color: 'text-[#E0A100]', bg: 'bg-[#FFF4E5]' },
  { key: 'inProgress', label: 'In Progress', icon: Sparkles, color: 'text-[#00CFE8]', bg: 'bg-[#E6FAFD]' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-[#28C76F]', bg: 'bg-[#E4F8ED]' },
  { key: 'templatesUsed', label: 'Templates Used', icon: Layers, color: 'text-[#EA5455]', bg: 'bg-[#FCE8E8]' },
];

export function AlbumStatsGrid({ stats }: { stats: AlbumStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {cards.map((c) => (
        <div
          key={c.key}
          className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg}`}>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#2D3436]">{stats[c.key]}</p>
              <p className="text-xs font-medium text-[#A0A4B0]">{c.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
