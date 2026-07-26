import { Download, Printer, Share2, X } from 'lucide-react';
import type { EventTimelineDay, EventTimelineStats, EventStatus } from '../types';
import { formatTimeRange } from '../utils';
import { cn } from '@/lib/utils';

const ICON_COLORS: Record<string, string> = {
  sparkles: 'bg-pink-100 text-pink-600',
  camera: 'bg-indigo-100 text-indigo-600',
  sun: 'bg-amber-100 text-amber-600',
  users: 'bg-blue-100 text-blue-600',
  utensils: 'bg-emerald-100 text-emerald-600',
  hand: 'bg-rose-100 text-rose-600',
  music: 'bg-violet-100 text-violet-600',
  party: 'bg-cyan-100 text-cyan-600',
  heart: 'bg-red-100 text-red-600',
  flower: 'bg-pink-100 text-pink-500',
  circle: 'bg-indigo-100 text-indigo-500',
  check: 'bg-emerald-100 text-emerald-600',
};

function StatusPill({ status }: { status: EventStatus }) {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
        ✓ Completed
      </span>
    );
  }
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-700">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-blue-600" />
        </span>
        Live
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
      Upcoming
    </span>
  );
}

type Props = {
  open: boolean;
  day: EventTimelineDay;
  stats: EventTimelineStats;
  onClose: () => void;
  onDownloadPdf: () => void;
  onPrint: () => void;
  onShare: () => void;
};

export function TimelineExportPreview({
  open,
  day,
  stats,
  onClose,
  onDownloadPdf,
  onPrint,
  onShare,
}: Props) {
  if (!open) return null;

  const lead =
    day.team.find((t) => t.role === 'lead') ||
    day.team.find((t) => t.role === 'photographer') ||
    day.team[0];
  const studio = lead ? `${lead.name} Photography` : 'ShootHub Photography';
  const photosLabel = `${(stats.photosCaptured || 1250).toLocaleString()}+`;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[96dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-[#F8FAFC] shadow-2xl sm:rounded-3xl">
        {/* Sticky actions matching design */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <div>
            <h2 className="text-lg font-extrabold text-[#2e1065] sm:text-xl">Event Timeline</h2>
            <p className="text-xs text-slate-400 sm:text-sm">Your complete wedding day schedule</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onDownloadPdf}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 sm:text-sm"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 sm:text-sm"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button
              type="button"
              onClick={onShare}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#6B46FE] px-3 py-2 text-xs font-bold text-white shadow-md shadow-[#6B46FE]/25 hover:bg-[#5A2FE0] sm:text-sm"
            >
              <Share2 className="h-4 w-4" />
              Share Timeline
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-5">
          <div className="mx-auto max-w-4xl rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            {/* Hero card */}
            <section className="relative overflow-hidden rounded-[22px] border border-[#e9e2ff] bg-gradient-to-br from-[#f7f3ff] via-[#eef2ff] to-[#f5f3ff] p-4 sm:p-5">
              <div className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full bg-[#6B46FE]/10" />
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#6B46FE]/10" />

              <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src={day.coverImage}
                    alt={day.coupleLine}
                    className="h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-lg"
                  />
                  <div>
                    <h3 className="text-xl font-extrabold text-[#6B46FE] sm:text-2xl">
                      {day.coupleLine} <span aria-hidden>💜</span>
                    </h3>
                    <p className="text-sm text-slate-500">{day.eventName}</p>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>📅 {day.eventDate}</span>
                      <span>📍 {day.location}</span>
                      <span>👤 {studio}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 rounded-2xl border border-[#ebe4ff] bg-white p-3 shadow-sm sm:min-w-[300px]">
                  {[
                    { label: 'Events', value: stats.totalEvents, tone: 'bg-[#F3EEFF]' },
                    { label: 'Completed', value: stats.completed, tone: 'bg-emerald-50' },
                    { label: 'Upcoming', value: stats.upcoming, tone: 'bg-amber-50' },
                    { label: 'Photos', value: photosLabel, tone: 'bg-blue-50' },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className={cn('mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-lg text-[10px]', s.tone)}>
                        ●
                      </div>
                      <p className="text-sm font-extrabold text-slate-900">{s.value}</p>
                      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Table */}
            <div className="mt-5 overflow-x-auto rounded-2xl border border-[#ede9fe] shadow-[0_10px_30px_rgba(107,70,254,0.08)]">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="bg-[#6B46FE] text-[11px] font-bold uppercase tracking-wider text-white">
                    <th className="px-3 py-3">#</th>
                    <th className="px-3 py-3">Time</th>
                    <th className="px-3 py-3">Event</th>
                    <th className="px-3 py-3">Location</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {day.slots.map((slot, i) => (
                    <tr
                      key={slot.id}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-[#faf9ff]'}
                    >
                      <td className="px-3 py-3">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#6B46FE] text-[11px] font-extrabold text-white">
                          {i + 1}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-xs font-bold text-slate-900">
                        {formatTimeRange(slot.startTime, slot.endTime)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold',
                              ICON_COLORS[slot.icon] || 'bg-[#F3EEFF] text-[#6B46FE]',
                            )}
                          >
                            {slot.title.charAt(0)}
                          </span>
                          <div>
                            <p className="text-xs font-extrabold text-slate-900">{slot.title}</p>
                            <p className="text-[10px] text-slate-400">
                              {slot.venue.split('·')[0]?.trim()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-[160px] px-3 py-3 text-xs text-slate-600">
                        📍 {slot.venue}
                      </td>
                      <td className="px-3 py-3">
                        <StatusPill status={slot.status} />
                      </td>
                      <td className="max-w-[180px] px-3 py-3 text-xs text-slate-500">
                        {slot.notes || slot.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <h4 className="text-base font-extrabold text-[#2e1065]">Thank You!</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                  We are honored to capture your beautiful moments. 💜
                </p>
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#2e1065]">Need Assistance?</h4>
                <p className="mt-1.5 text-xs text-slate-500">📞 +91 98765 43210</p>
                <p className="text-xs text-slate-500">✉️ hello@shoothub.com</p>
              </div>
              <div className="rounded-2xl border border-[#e9e2ff] bg-[#F3EEFF] p-3">
                <h4 className="text-xs font-extrabold text-[#2e1065]">📅 Important Note</h4>
                <p className="mt-1.5 text-[11px] leading-relaxed text-violet-800">
                  Timeline is subject to changes. We will keep you updated with any modifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
