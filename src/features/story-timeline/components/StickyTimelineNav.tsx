import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { TimelineEvent } from '../types';
import { TimelineIcon } from './TimelineIcon';

type Props = {
  events: TimelineEvent[];
  activeId: string | null;
  onSelect: (id: TimelineEvent['id']) => void;
};

export function StickyTimelineNav({ events, activeId, onSelect }: Props) {
  return (
    <nav
      aria-label="Wedding timeline"
      className="rounded-[24px] border border-[#EEF0F4] bg-white/90 p-4 shadow-[var(--shadow-gallery-soft)] backdrop-blur-xl"
    >
      <p className="mb-3 px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#A0A4B0]">
        Timeline
      </p>

      <ol className="relative space-y-0.5">
        <div
          className="absolute bottom-3 left-[19px] top-3 w-px bg-gradient-to-b from-[#6C3BFF]/50 via-[#6C3BFF]/20 to-transparent"
          aria-hidden="true"
        />

        {events.map((event) => {
          const active = activeId === event.id;
          return (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => onSelect(event.id)}
                className={cn(
                  'relative flex w-full items-center gap-3 rounded-2xl px-2.5 py-2.5 text-left transition',
                  active
                    ? 'bg-[#F3EEFF] text-[#6C3BFF]'
                    : 'text-[#636E72] hover:bg-[#F8F9FB]',
                )}
              >
                <span
                  className={cn(
                    'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition',
                    active
                      ? 'border-[#6C3BFF] bg-[#6C3BFF] text-white shadow-md shadow-[#6C3BFF]/30'
                      : event.completed
                        ? 'border-[#6C3BFF]/40 bg-white text-[#6C3BFF]'
                        : 'border-[#EEF0F4] bg-white text-[#A0A4B0]',
                  )}
                >
                  <TimelineIcon name={event.icon} className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      'block truncate text-[13px] font-semibold',
                      active ? 'text-[#6C3BFF]' : 'text-[#111827]',
                    )}
                  >
                    {event.title}
                  </span>
                  <span className="block text-[11px] text-[#A0A4B0]">{event.timeLabel}</span>
                </span>
                {active ? (
                  <motion.span
                    layoutId="timeline-active-dot"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#6C3BFF]"
                  />
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
