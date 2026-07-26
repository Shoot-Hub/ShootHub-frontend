import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import type { EventTimelineDay } from '../types';
import { pad2, type CountdownParts } from '../utils';

type Props = {
  day: EventTimelineDay;
  countdown: CountdownParts;
};

export function EventHeroBanner({ day, countdown }: Props) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference * (1 - day.progressPercent / 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl shadow-[0_20px_50px_-24px_rgba(107,70,254,0.4)]"
    >
      <div className="relative min-h-[220px] sm:min-h-[240px]">
        <img
          src={day.coverImage}
          alt={day.coupleLine}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(107,70,254,0.35),transparent_55%)]" />

        <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/65">
              Live Event Day
            </p>
            <h2 className="mt-1 min-w-0 break-words text-2xl font-extrabold text-white sm:text-3xl">
              {day.coupleLine}{' '}
              <span aria-hidden="true">💜</span>
            </h2>
            <p className="mt-1 text-sm font-medium text-white/85 sm:text-base">{day.eventName}</p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-white/80 sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {day.eventDate}
              </span>
              <span className="text-white/35">·</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {day.location}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {(
                [
                  { label: 'Days', value: countdown.days },
                  { label: 'Hours', value: countdown.hours },
                  { label: 'Mins', value: countdown.mins },
                  { label: 'Secs', value: countdown.secs },
                ] as const
              ).map((unit) => (
                <div
                  key={unit.label}
                  className="min-w-[58px] rounded-2xl border border-white/15 bg-black/35 px-2.5 py-2 text-center backdrop-blur-md"
                >
                  <p className="text-lg font-extrabold tabular-nums text-white sm:text-xl">
                    {pad2(unit.value)}
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                    {unit.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-center self-end sm:self-center">
            <div className="relative flex h-[108px] w-[108px] items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-xl">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="7"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#A78BFA"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <div className="relative text-center">
                <p className="text-xl font-extrabold text-white">{day.progressPercent}%</p>
                <p className="text-[9px] font-bold uppercase tracking-wide text-white/65">
                  Event
                  <br />
                  Progress
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
