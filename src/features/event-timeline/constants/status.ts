import type { EventStatus, EventTimelineFutureFlags } from '../types';

export const STATUS_LABEL: Record<EventStatus, string> = {
  upcoming: 'Upcoming',
  live: 'Live Now',
  completed: 'Completed',
  delayed: 'Delayed',
  cancelled: 'Cancelled',
};

export const STATUS_STYLES: Record<
  EventStatus,
  { badge: string; text: string; node: string; glow?: string }
> = {
  completed: {
    badge: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    text: 'text-emerald-600',
    node: 'bg-emerald-500 border-emerald-500 text-white',
  },
  live: {
    badge: 'bg-[#F3EEFF] text-[#6B46FE] border-[#E4D9FF]',
    text: 'text-[#6B46FE]',
    node: 'bg-white border-[#6B46FE] text-[#6B46FE]',
    glow: 'shadow-[0_0_0_4px_rgba(107,70,254,0.18)]',
  },
  upcoming: {
    badge: 'bg-slate-50 text-slate-500 border-slate-100',
    text: 'text-slate-500',
    node: 'bg-white border-slate-200 text-slate-300',
  },
  delayed: {
    badge: 'bg-amber-50 text-amber-600 border-amber-100',
    text: 'text-amber-600',
    node: 'bg-amber-500 border-amber-500 text-white',
  },
  cancelled: {
    badge: 'bg-rose-50 text-rose-600 border-rose-100',
    text: 'text-rose-600',
    node: 'bg-rose-400 border-rose-400 text-white',
  },
};

export const FUTURE_FLAGS: EventTimelineFutureFlags = {
  liveTeamTracking: false,
  gpsLocation: false,
  realTimeProgress: false,
  clientNotifications: false,
  automaticReminders: true,
  aiScheduleSuggestions: false,
};
