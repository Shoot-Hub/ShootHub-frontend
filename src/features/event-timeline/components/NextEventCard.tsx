import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import type { TimelineSlot } from '../types';
import { formatClock, pad2, type CountdownParts } from '../utils';
import { EventSlotIcon } from './EventSlotIcon';

type Props = {
  slot: TimelineSlot;
  countdown: CountdownParts;
  onViewDetails: () => void;
};

export function NextEventCard({ slot, countdown, onViewDetails }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-[#6B46FE]/20 bg-gradient-to-br from-[#F3EEFF] to-white p-4 shadow-sm"
    >
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#6B46FE]">
        <Clock className="h-3.5 w-3.5" />
        Next Event
      </div>

      <div className="mt-3 flex gap-3">
        <img
          src={slot.thumbnail}
          alt={slot.title}
          className="h-16 w-16 rounded-2xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <EventSlotIcon name={slot.icon} className="h-3.5 w-3.5 text-[#6B46FE]" />
            <h4 className="truncate text-sm font-extrabold text-slate-900">{slot.title}</h4>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Starts at {formatClock(slot.startTime)}
          </p>
          <p className="mt-1 font-mono text-xs font-bold tabular-nums text-[#6B46FE]">
            Starts in {pad2(countdown.hours)}:{pad2(countdown.mins)}:{pad2(countdown.secs)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onViewDetails}
        className="mt-3 w-full rounded-xl bg-[#6B46FE] py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B46FE]/25 transition hover:bg-[#5A2FE0]"
      >
        View Details
      </button>
    </motion.section>
  );
}
