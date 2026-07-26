import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { STATUS_STYLES } from '../constants';
import type { TimelineSlot } from '../types';
import { formatClock } from '../utils';
import { EventSlotIcon } from './EventSlotIcon';

type Props = {
  slots: TimelineSlot[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

export function MobileSlotScroller({ slots, activeId, onSelect }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div className="lg:hidden">
      <div
        ref={trackRef}
        className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slots.map((slot) => {
          const active = activeId === slot.id;
          const styles = STATUS_STYLES[slot.status];
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => onSelect(slot.id)}
              className={cn(
                'w-[78%] shrink-0 snap-center overflow-hidden rounded-3xl border bg-white text-left shadow-sm transition sm:w-[60%]',
                active ? 'border-[#6B46FE] ring-2 ring-[#6B46FE]/15' : 'border-slate-100',
              )}
            >
              <div className="relative h-36">
                <img src={slot.thumbnail} alt="" className="h-full w-full object-cover" />
                <span
                  className={cn(
                    'absolute left-3 top-3 rounded-full border px-2 py-0.5 text-[10px] font-bold backdrop-blur-md',
                    styles.badge,
                  )}
                >
                  {slot.status === 'live' ? 'Live Now' : formatClock(slot.startTime)}
                </span>
              </div>
              <div className="p-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3EEFF] text-[#6B46FE]">
                    <EventSlotIcon name={slot.icon} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-slate-900">{slot.title}</p>
                    <p className="truncate text-[11px] text-slate-400">{slot.venue}</p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MobileBottomTimelineNav({ slots, activeId, onSelect }: Props) {
  const focus = slots.filter((s) =>
    ['completed', 'live', 'upcoming'].includes(s.status),
  );
  const items = [
    ...focus.filter((s) => s.status === 'live'),
    ...focus.filter((s) => s.status === 'upcoming').slice(0, 3),
    ...focus.filter((s) => s.status === 'completed').slice(-1),
  ].slice(0, 5);

  const navItems = items.length >= 3 ? items : slots.slice(0, 5);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-1 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {navItems.map((slot) => {
          const active = activeId === slot.id;
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => onSelect(slot.id)}
              className={cn(
                'flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1 text-[9px] font-semibold',
                active ? 'text-[#6B46FE]' : 'text-slate-400',
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  active ? 'bg-[#F3EEFF]' : '',
                )}
              >
                <EventSlotIcon name={slot.icon} className="h-4 w-4" />
              </span>
              <span className="truncate">{slot.title.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
