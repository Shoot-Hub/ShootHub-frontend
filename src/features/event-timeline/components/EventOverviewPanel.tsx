import {
  CheckCircle2,
  Clock3,
  Film,
  Hourglass,
  Images,
  ListChecks,
} from 'lucide-react';
import type { EventTimelineStats } from '../types';

type Props = {
  stats: EventTimelineStats;
  totalCoverageLabel: string;
};

const CARDS = [
  { key: 'totalEvents', label: 'Total Events', icon: ListChecks, color: 'text-[#6B46FE] bg-[#F3EEFF]' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
  { key: 'inProgress', label: 'In Progress', icon: Clock3, color: 'text-violet-600 bg-violet-50' },
  { key: 'upcoming', label: 'Upcoming', icon: Hourglass, color: 'text-slate-600 bg-slate-100' },
  { key: 'videos', label: 'Videos', icon: Film, color: 'text-sky-600 bg-sky-50' },
  { key: 'hoursCoverage', label: 'Hours Coverage', icon: Images, color: 'text-indigo-600 bg-indigo-50' },
] as const;

export function EventOverviewPanel({ stats, totalCoverageLabel }: Props) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-extrabold text-slate-900">Event Overview</h3>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {CARDS.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-2.5">
            <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${color}`}>
              <Icon className="h-3.5 w-3.5" />
            </span>
            <p className="mt-2 text-lg font-extrabold tabular-nums text-slate-900">
              {stats[key]}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-gradient-to-br from-[#F3EEFF] to-[#E8F4FD] p-3">
          <p className="text-lg font-extrabold text-slate-900">{totalCoverageLabel}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Total Coverage
          </p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-[#E4F8ED] to-[#E8F4FD] p-3">
          <p className="text-lg font-extrabold text-slate-900">{stats.clientSatisfaction}%</p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Client Satisfaction
          </p>
        </div>
      </div>
    </section>
  );
}
