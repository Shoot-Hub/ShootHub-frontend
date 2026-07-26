import { motion } from 'framer-motion';
import { Check, ImageIcon, MapPin, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_LABEL, STATUS_STYLES } from '../constants';
import type { TimelineSlot, TimelineTeamMember } from '../types';
import { formatDuration, formatTimeRange } from '../utils';
import { EventSlotIcon } from './EventSlotIcon';

type Props = {
  slot: TimelineSlot;
  team: TimelineTeamMember[];
  index: number;
  isLast: boolean;
  onOpenGallery?: (slot: TimelineSlot) => void;
};

export function EventTimelineCard({ slot, team, index, isLast, onOpenGallery }: Props) {
  const styles = STATUS_STYLES[slot.status];
  const assigned = team.filter((m) => slot.teamIds.includes(m.id));

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.18) }}
      className="relative grid grid-cols-[88px_28px_1fr] gap-2 sm:grid-cols-[120px_36px_1fr] sm:gap-3"
    >
      {/* Time + status */}
      <div className="pt-3 text-right">
        <p className="text-[11px] font-bold leading-snug text-slate-700 sm:text-xs">
          {formatTimeRange(slot.startTime, slot.endTime)}
        </p>
        <p className={cn('mt-1 text-[10px] font-bold sm:text-[11px]', styles.text)}>
          {STATUS_LABEL[slot.status]}
        </p>
        <p className="mt-1 text-[10px] font-medium text-slate-400">
          {formatDuration(slot.startTime, slot.endTime)}
        </p>
      </div>

      {/* Spine */}
      <div className="relative flex flex-col items-center">
        <span
          className={cn(
            'relative z-10 mt-3 flex h-7 w-7 items-center justify-center rounded-full border-2',
            styles.node,
            slot.status === 'live' && styles.glow,
          )}
        >
          {slot.status === 'completed' ? (
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          ) : slot.status === 'live' ? (
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6B46FE] opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#6B46FE]" />
            </span>
          ) : (
            <span className="h-2 w-2 rounded-full bg-current opacity-40" />
          )}
        </span>
        {!isLast ? (
          <span className="absolute top-10 bottom-[-12px] w-px bg-gradient-to-b from-slate-200 via-slate-200 to-transparent" />
        ) : null}
      </div>

      {/* Card */}
      <div
        className={cn(
          'mb-4 overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md',
          slot.status === 'live'
            ? 'border-[#6B46FE]/35 ring-2 ring-[#6B46FE]/10'
            : 'border-slate-100',
        )}
      >
        <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-stretch sm:p-3.5">
          <button
            type="button"
            onClick={() => onOpenGallery?.(slot)}
            className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl sm:h-auto sm:w-28"
          >
            <img
              src={slot.thumbnail}
              alt={slot.title}
              className="h-full w-full object-cover transition hover:scale-105"
            />
            {slot.status === 'live' ? (
              <span className="absolute left-2 top-2 rounded-full bg-[#6B46FE] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                In Progress
              </span>
            ) : null}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3EEFF] text-[#6B46FE]">
                    <EventSlotIcon name={slot.icon} className="h-4 w-4" />
                  </span>
                  <h3 className="truncate text-[15px] font-extrabold text-slate-900">
                    {slot.title}
                  </h3>
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
                  {slot.description}
                </p>
                <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                  <MapPin className="h-3 w-3" />
                  {slot.venue}
                </p>
              </div>

              <div className="flex shrink-0 gap-1.5">
                <div className="rounded-xl bg-slate-50 px-2.5 py-1.5 text-center">
                  <div className="flex items-center justify-center gap-1 text-[#6B46FE]">
                    <ImageIcon className="h-3 w-3" />
                    <span className="text-xs font-extrabold tabular-nums">{slot.photoCount}</span>
                  </div>
                  <p className="text-[9px] font-semibold uppercase text-slate-400">Photos</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-2.5 py-1.5 text-center">
                  <div className="flex items-center justify-center gap-1 text-[#6B46FE]">
                    <Video className="h-3 w-3" />
                    <span className="text-xs font-extrabold tabular-nums">
                      {String(slot.videoCount).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-[9px] font-semibold uppercase text-slate-400">Videos</p>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex -space-x-2">
                {assigned.slice(0, 4).map((m) => (
                  <img
                    key={m.id}
                    src={m.avatar}
                    alt={m.name}
                    title={`${m.name} · ${m.roleLabel}`}
                    className="h-7 w-7 rounded-full border-2 border-white object-cover"
                  />
                ))}
                {assigned.length > 4 ? (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-bold text-slate-500">
                    +{assigned.length - 4}
                  </span>
                ) : null}
              </div>

              <span
                className={cn(
                  'rounded-full border px-2.5 py-0.5 text-[10px] font-bold',
                  styles.badge,
                )}
              >
                {STATUS_LABEL[slot.status]}
              </span>
            </div>

            {typeof slot.progressPercent === 'number' && slot.status === 'live' ? (
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-[10px] font-semibold text-slate-400">
                  <span>Progress</span>
                  <span className="text-[#6B46FE]">{slot.progressPercent}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#F3EEFF]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${slot.progressPercent}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-[#6B46FE] to-[#8B5CF6]"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
