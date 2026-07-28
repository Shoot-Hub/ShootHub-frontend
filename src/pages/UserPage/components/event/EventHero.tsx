import { motion } from 'framer-motion';
import { CalendarDays, Clock3, MapPin } from 'lucide-react';
import type { CustomerBooking } from '../../types/dashboard.types';
import { CountdownTimer } from './CountdownTimer';

interface EventHeroProps {
  booking: CustomerBooking;
}

export function EventHero({ booking }: EventHeroProps) {
  const displayDate = new Date(booking.eventDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[28px] border border-[#E8E4F5] bg-[#0B0B0F] text-white shadow-[0_24px_60px_-20px_rgba(107,70,254,0.45)]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url('${booking.coverImage}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0F] via-[#1a1035]/90 to-[#6B46FE]/50" />

      <div className="relative z-10 grid gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.2fr_0.8fr] lg:px-12 lg:py-14">
        <div>
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur-md">
            Upcoming Event
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{booking.title}</h1>
          <p className="mt-2 text-sm text-white/70">{booking.type}</p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/85">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#C4B5FD]" />
              {displayDate}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-[#C4B5FD]" />
              {booking.eventTime}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#C4B5FD]" />
              {booking.venue}, {booking.city}
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/65">
            Countdown
          </p>
          <CountdownTimer targetDate={`${booking.eventDate}T10:30:00`} />
        </div>
      </div>
    </motion.section>
  );
}
