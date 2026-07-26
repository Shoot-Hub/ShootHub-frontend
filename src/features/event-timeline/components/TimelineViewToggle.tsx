import { LayoutList, Timeline } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EventTimelineViewMode } from '../types';

type Props = {
  mode: EventTimelineViewMode;
  onChange: (mode: EventTimelineViewMode) => void;
};

export function TimelineViewToggle({ mode, onChange }: Props) {
  return (
    <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
      {(
        [
          { id: 'timeline' as const, label: 'Timeline View', icon: Timeline },
          { id: 'list' as const, label: 'List View', icon: LayoutList },
        ] as const
      ).map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition',
            mode === id
              ? 'bg-[#6B46FE] text-white shadow-md shadow-[#6B46FE]/25'
              : 'text-slate-500 hover:text-slate-700',
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
