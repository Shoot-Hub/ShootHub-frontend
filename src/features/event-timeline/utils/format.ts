import type { EventTimelineDay, EventTimelineStats, EventStatus, TimelineSlot } from '../types';

export function formatTimeRange(startISO: string, endISO: string): string {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  return `${fmt(startISO)} – ${fmt(endISO)}`;
}

export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function getDurationMinutes(startISO: string, endISO: string): number {
  return Math.max(0, Math.round((new Date(endISO).getTime() - new Date(startISO).getTime()) / 60000));
}

export function formatDuration(startISO: string, endISO: string): string {
  const mins = getDurationMinutes(startISO, endISO);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function pad2(n: number) {
  return String(Math.max(0, n)).padStart(2, '0');
}

export type CountdownParts = { days: number; hours: number; mins: number; secs: number };

export function getCountdown(targetISO: string, now = Date.now()): CountdownParts {
  const diff = Math.max(0, new Date(targetISO).getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return { days, hours, mins, secs };
}

export function computeStats(day: EventTimelineDay): EventTimelineStats {
  const completed = day.slots.filter((s) => s.status === 'completed').length;
  const inProgress = day.slots.filter((s) => s.status === 'live' || s.status === 'delayed').length;
  const upcoming = day.slots.filter((s) => s.status === 'upcoming').length;
  const videos = day.slots.reduce((sum, s) => sum + s.videoCount, 0);
  const photosCaptured = day.slots.reduce((sum, s) => sum + s.photoCount, 0);

  return {
    totalEvents: day.slots.length,
    completed,
    inProgress,
    upcoming,
    videos,
    hoursCoverage: day.hoursCoverage,
    photosCaptured,
    clientSatisfaction: day.clientSatisfaction,
  };
}

export function getNextSlot(slots: TimelineSlot[]): TimelineSlot | null {
  return (
    slots.find((s) => s.status === 'upcoming') ||
    slots.find((s) => s.status === 'live') ||
    null
  );
}

export function getLiveSlot(slots: TimelineSlot[]): TimelineSlot | null {
  return slots.find((s) => s.status === 'live') ?? null;
}

export function statusSortWeight(status: EventStatus): number {
  switch (status) {
    case 'live':
      return 0;
    case 'delayed':
      return 1;
    case 'upcoming':
      return 2;
    case 'completed':
      return 3;
    case 'cancelled':
      return 4;
    default:
      return 5;
  }
}
