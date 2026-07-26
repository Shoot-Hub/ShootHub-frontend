import { cn } from '@/lib/utils';
import type { TimelineEvent } from '../types';
import { TimelineIcon } from './TimelineIcon';

type Props = {
  events: TimelineEvent[];
  activeId: string | null;
  onSelect: (id: TimelineEvent['id']) => void;
};

export function MobileTimelineChips({ events, activeId, onSelect }: Props) {
  return (
    <div className="sticky top-[4.5rem] z-30 -mx-4 border-b border-[#EEF0F4]/80 bg-white/90 px-4 py-2.5 backdrop-blur-xl lg:hidden">
      <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {events.map((event) => {
          const active = activeId === event.id;
          return (
            <button
              key={event.id}
              type="button"
              onClick={() => onSelect(event.id)}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-[12px] font-semibold transition',
                active
                  ? 'border-[#6C3BFF] bg-[#6C3BFF] text-white shadow-sm'
                  : 'border-[#EEF0F4] bg-white text-[#636E72]',
              )}
            >
              <TimelineIcon name={event.icon} className="h-3.5 w-3.5" />
              {event.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MobileBottomNav({
  events,
  activeId,
  onSelect,
}: Props) {
  const compact = events.filter((e) =>
    ['getting-ready', 'haldi', 'mehendi', 'wedding-ceremony', 'reception'].includes(e.id),
  );
  const items = compact.length >= 3 ? compact : events.slice(0, 5);

  return (
    <nav
      aria-label="Timeline bottom navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#EEF0F4] bg-white/95 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {items.map((event) => {
          const active = activeId === event.id;
          return (
            <button
              key={event.id}
              type="button"
              onClick={() => onSelect(event.id)}
              className={cn(
                'flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-semibold',
                active ? 'text-[#6C3BFF]' : 'text-[#A0A4B0]',
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  active ? 'bg-[#F3EEFF]' : 'bg-transparent',
                )}
              >
                <TimelineIcon name={event.icon} className="h-4 w-4" />
              </span>
              <span className="truncate">{event.title.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
