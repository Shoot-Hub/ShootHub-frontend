import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Calendar,
  Clock,
  CheckCircle2,
  DollarSign,
  Plus,
  Link2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Activity,
  MoreHorizontal,
  Sparkles,
} from 'lucide-react';

const tabs = ['All', 'Upcoming', 'Today', 'This Week', 'Completed', 'Cancelled'] as const;

const sparkPaths = {
  purple: 'M0,22 C10,18 15,24 25,14 C35,6 42,16 50,10 C55,6 58,8 60,4',
  orange: 'M0,20 C8,24 14,12 22,16 C30,20 38,8 46,12 C52,14 56,6 60,8',
  green: 'M0,24 C10,20 16,22 24,12 C32,4 40,14 48,8 C54,4 57,10 60,6',
  blue: 'M0,18 C10,22 18,10 28,14 C36,18 44,6 52,10 C56,12 58,6 60,4',
};

function Sparkline({ color, path }: { color: string; path: string }) {
  return (
    <svg viewBox="0 0 60 28" className="mt-2 h-7 w-full" preserveAspectRatio="none">
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d={`${path} L60,28 L0,28 Z`} fill={color} fillOpacity="0.1" stroke="none" />
    </svg>
  );
}

function EmptyCalendarArt() {
  return (
    <div className="relative mx-auto mb-5 h-28 w-28">
      <div className="absolute inset-x-4 top-2 h-24 rounded-2xl bg-gradient-to-br from-[#EDE5FF] to-[#D4C4FF] shadow-inner" />
      <div className="absolute inset-x-2 top-0 overflow-hidden rounded-2xl border border-[#E0D4FF] bg-white shadow-lg shadow-[#6B46FE]/15">
        <div className="flex h-7 items-center justify-center bg-gradient-to-r from-[#6B46FE] to-[#8A60FF]">
          <div className="flex gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-2.5 rounded-sm bg-[#F3EEFF]" />
          ))}
        </div>
      </div>
      <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6B46FE] to-[#8A60FF] text-white shadow-lg shadow-[#6B46FE]/35">
        <span className="text-lg font-bold leading-none">×</span>
      </div>
      <Sparkles className="absolute -left-1 top-1 h-4 w-4 text-[#C4B5FD]" />
      <Sparkles className="absolute -right-2 top-8 h-3 w-3 text-[#A78BFA]" />
    </div>
  );
}

function MiniCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const currentDay = today.getDate();

  const monthLabel = today.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = useMemo(() => {
    const list: Array<number | null> = [];
    for (let i = 0; i < firstDay; i++) list.push(null);
    for (let d = 1; d <= daysInMonth; d++) list.push(d);
    return list;
  }, [firstDay, daysInMonth]);

  return (
    <div className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#2D3436]">{monthLabel}</h3>
        <div className="flex items-center gap-0.5">
          <button className="rounded-lg p-1 text-[#A0A4B0] hover:bg-[#F8F9FB] hover:text-[#636E72]">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="rounded-lg p-1 text-[#A0A4B0] hover:bg-[#F8F9FB] hover:text-[#636E72]">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mb-1 grid grid-cols-7 gap-0.5 text-center">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span key={d} className="py-1 text-[10px] font-semibold text-[#A0A4B0]">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {cells.map((day, i) => (
          <span
            key={i}
            className={`flex h-8 items-center justify-center rounded-full text-xs ${
              day === currentDay
                ? 'bg-[#6B46FE] font-bold text-white shadow-sm shadow-[#6B46FE]/30'
                : day
                  ? 'font-medium text-[#2D3436] hover:bg-[#F3EEFF]'
                  : ''
            }`}
          >
            {day || ''}
          </span>
        ))}
      </div>
    </div>
  );
}

const stats = [
  {
    label: 'Total Bookings',
    value: '0',
    change: '— 0% from last month',
    icon: CalendarCheck,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#6B46FE]',
    sparkColor: '#6B46FE',
    sparkPath: sparkPaths.purple,
  },
  {
    label: 'Upcoming',
    value: '0',
    change: '— 0% from last month',
    icon: Clock,
    iconBg: 'bg-[#FFF4E5]',
    iconColor: 'text-[#FF9F43]',
    sparkColor: '#FF9F43',
    sparkPath: sparkPaths.orange,
  },
  {
    label: 'Completed',
    value: '0',
    change: '— 0% from last month',
    icon: CheckCircle2,
    iconBg: 'bg-[#E4F8ED]',
    iconColor: 'text-[#28C76F]',
    sparkColor: '#28C76F',
    sparkPath: sparkPaths.green,
  },
  {
    label: 'Total Earnings',
    value: '₹0',
    change: '— 0% from last month',
    icon: DollarSign,
    iconBg: 'bg-[#E8F4FD]',
    iconColor: 'text-[#3498DB]',
    sparkColor: '#3498DB',
    sparkPath: sparkPaths.blue,
  },
];

const quickActions = [
  { label: 'New Booking', icon: Plus, color: 'bg-[#F3EEFF] text-[#6B46FE]' },
  { label: 'Share Booking Link', icon: Link2, color: 'bg-[#E8F4FD] text-[#3498DB]' },
  { label: 'Import Bookings', icon: Download, color: 'bg-[#E4F8ED] text-[#28C76F]' },
  { label: 'Calendar Sync', icon: RefreshCw, color: 'bg-[#FFE8E8] text-[#EA5455]' },
];

const tableHeaders = ['CLIENT', 'EVENT', 'DATE & TIME', 'LOCATION', 'STATUS', 'AMOUNT', 'ACTIONS'];

export function BookingsPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('All');

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
      {/* ── Main column ───────────────────────────────────── */}
      <div className="min-w-0 space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-[#2D3436]">Bookings</h2>
          <p className="mt-0.5 text-sm text-[#636E72]">
            Manage your client bookings and schedule.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]"
            >
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <p className="text-xs font-medium text-[#636E72]">{stat.label}</p>
              <p className="mt-0.5 text-2xl font-bold text-[#2D3436]">{stat.value}</p>
              <p className="mt-1 text-[11px] text-[#A0A4B0]">{stat.change}</p>
              <Sparkline color={stat.sparkColor} path={stat.sparkPath} />
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="-mx-1 overflow-x-auto px-1">
          <div className="flex min-w-max items-center gap-2 pb-1 lg:min-w-0 lg:flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-[#6B46FE] text-white shadow-sm shadow-[#6B46FE]/25'
                    : 'bg-white text-[#636E72] ring-1 ring-[#EEF0F4] hover:bg-[#F8F9FB] hover:text-[#2D3436]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#EEF0F4] bg-white px-3 text-xs font-semibold text-[#636E72] hover:bg-[#F8F9FB] sm:flex-none">
            <Calendar className="h-3.5 w-3.5" />
            Select Date
          </button>
          <button className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#EEF0F4] bg-white px-3 text-xs font-semibold text-[#636E72] hover:bg-[#F8F9FB] sm:flex-none">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </button>
        </div>

        {/* Empty state card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#EEF0F4] bg-white px-6 py-12 text-center shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]"
        >
          <EmptyCalendarArt />
          <h3 className="text-lg font-bold text-[#2D3436]">No bookings yet</h3>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-[#636E72]">
            Your upcoming shoots and client bookings will appear here.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B46FE]/25 transition-all hover:shadow-lg">
              <Plus className="h-4 w-4" />
              Create Booking
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#6B46FE] px-4 py-2.5 text-sm font-bold text-[#6B46FE] transition-all hover:bg-[#F3EEFF]">
              <Link2 className="h-4 w-4" />
              Share Booking Link
            </button>
          </div>
        </motion.div>

        {/* Recent Bookings table */}
        <div className="overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between border-b border-[#F5F6F8] px-5 py-4">
            <h3 className="text-base font-bold text-[#2D3436]">Recent Bookings</h3>
            <button className="text-xs font-semibold text-[#6B46FE] hover:underline">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[#F5F6F8] bg-[#FAFBFC]">
                  {tableHeaders.map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#A0A4B0]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3EEFF]">
                        <Calendar className="h-6 w-6 text-[#6B46FE]" />
                      </div>
                      <p className="text-sm font-medium text-[#636E72]">No bookings found.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Right widgets ─────────────────────────────────── */}
      <aside className="space-y-4">
        <MiniCalendar />

        {/* Today's Schedule */}
        <div className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
          <h3 className="mb-3 text-sm font-bold text-[#2D3436]">Today&apos;s Schedule</h3>
          <div className="flex flex-col items-center rounded-xl bg-[#FAFBFC] px-3 py-6 text-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3EEFF]">
              <Calendar className="h-5 w-5 text-[#C4B5FD]" />
            </div>
            <p className="text-sm font-semibold text-[#2D3436]">No events today</p>
            <p className="mt-0.5 text-xs text-[#A0A4B0]">Enjoy your day!</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
          <h3 className="mb-3 text-sm font-bold text-[#2D3436]">Quick Actions</h3>
          <div className="space-y-1.5">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-[#F8F9FB]"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${action.color}`}
                >
                  <action.icon className="h-4 w-4" />
                </span>
                <span className="flex-1 text-sm font-medium text-[#2D3436]">{action.label}</span>
                <ChevronRight className="h-4 w-4 text-[#A0A4B0]" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D3436]">Recent Activity</h3>
            <button className="rounded-lg p-1 text-[#A0A4B0] hover:bg-[#F8F9FB]">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-[#FAFBFC] px-3 py-6 text-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3EEFF]">
              <Activity className="h-5 w-5 text-[#6B46FE]" />
            </div>
            <p className="text-sm font-semibold text-[#2D3436]">No recent activity</p>
            <p className="mt-0.5 text-xs text-[#A0A4B0]">
              Booking updates will show up here.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
