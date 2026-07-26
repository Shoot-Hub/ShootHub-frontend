import { Check, ImageIcon, MapPin, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_LABEL, STATUS_STYLES } from '../constants';
import type { TimelineSlot, TimelineTeamMember } from '../types';
import { formatClock, formatDuration } from '../utils';
import { EventSlotIcon } from './EventSlotIcon';

type Props = {
  slots: TimelineSlot[];
  team: TimelineTeamMember[];
  onSelect: (slot: TimelineSlot) => void;
};

export function EventListView({ slots, team, onSelect }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="hidden grid-cols-[1fr_120px_120px_100px_120px] gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 md:grid">
        <span>Event</span>
        <span>Start</span>
        <span>Duration</span>
        <span>Media</span>
        <span>Status</span>
      </div>
      <ul className="divide-y divide-slate-100">
        {slots.map((slot) => {
          const styles = STATUS_STYLES[slot.status];
          const assigned = team.filter((m) => slot.teamIds.includes(m.id));
          return (
            <li key={slot.id}>
              <button
                type="button"
                onClick={() => onSelect(slot)}
                className="grid w-full grid-cols-1 gap-2 px-4 py-3 text-left transition hover:bg-slate-50 md:grid-cols-[1fr_120px_120px_100px_120px] md:items-center md:gap-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={slot.thumbnail}
                    alt=""
                    className="h-11 w-11 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <EventSlotIcon name={slot.icon} className="h-3.5 w-3.5 text-[#6B46FE]" />
                      <p className="truncate text-sm font-bold text-slate-900">{slot.title}</p>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-slate-400">
                      <MapPin className="h-3 w-3" />
                      {slot.venue}
                    </p>
                    <div className="mt-1 flex -space-x-1.5 md:hidden">
                      {assigned.slice(0, 3).map((m) => (
                        <img
                          key={m.id}
                          src={m.avatar}
                          alt=""
                          className="h-5 w-5 rounded-full border border-white object-cover"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  {formatClock(slot.startTime)}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {formatDuration(slot.startTime, slot.endTime)}
                </span>
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <span className="inline-flex items-center gap-0.5">
                    <ImageIcon className="h-3 w-3" />
                    {slot.photoCount}
                  </span>
                  <span className="inline-flex items-center gap-0.5">
                    <Video className="h-3 w-3" />
                    {slot.videoCount}
                  </span>
                </span>
                <span
                  className={cn(
                    'inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold',
                    styles.badge,
                  )}
                >
                  {slot.status === 'completed' ? <Check className="h-3 w-3" /> : null}
                  {STATUS_LABEL[slot.status]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
