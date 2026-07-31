import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ban,
  CalendarCheck2,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  MapPin,
  MoreVertical,
  Plus,
  UserRound,
  Wallet,
} from 'lucide-react';
import {
  bookingStats,
  formatINR,
  statusStyles,
  userBookings,
  type BookingListStatus,
} from '../data/bookingsData';

type TabId = 'all' | BookingListStatus;

const tabs: { id: TabId; label: string }[] = [
  { id: 'all', label: 'All Bookings' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const stats = [
  {
    label: 'Total Bookings',
    value: String(bookingStats.total),
    icon: CalendarDays,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#6B46FE]',
  },
  {
    label: 'Upcoming',
    value: String(bookingStats.upcoming),
    icon: CalendarCheck2,
    iconBg: 'bg-[#E8F1FF]',
    iconColor: 'text-[#2F6FED]',
  },
  {
    label: 'Completed',
    value: String(bookingStats.completed),
    icon: CheckCircle2,
    iconBg: 'bg-[#E8F8EF]',
    iconColor: 'text-[#1B9C5A]',
  },
  {
    label: 'Cancelled',
    value: String(bookingStats.cancelled),
    icon: Ban,
    iconBg: 'bg-[#FFF1E8]',
    iconColor: 'text-[#E67E22]',
  },
  {
    label: 'Total Spent',
    value: formatINR(bookingStats.totalSpent),
    icon: Wallet,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#6B46FE]',
  },
];

export function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const filtered = useMemo(() => {
    let list =
      activeTab === 'all'
        ? [...userBookings]
        : userBookings.filter((b) => b.status === activeTab);

    list = list.sort((a, b) => {
      const aKey = `${a.year}-${a.month}-${a.day}`;
      const bKey = `${b.year}-${b.month}-${b.day}`;
      return sortBy === 'oldest' ? aKey.localeCompare(bKey) : bKey.localeCompare(aKey);
    });

    return list;
  }, [activeTab, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">My Bookings</h2>
          <p className="mt-1 text-sm text-[#8B93A1]">Manage all your bookings in one place.</p>
        </div>
        <Link
          to="/user/find-professionals"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#6B46FE] px-4 text-sm font-bold text-white shadow-md shadow-[#6B46FE]/25 transition-all hover:bg-[#5530e8]"
        >
          <Plus className="h-4 w-4" />
          New Booking
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-[0_4px_16px_-8px_rgba(17,24,39,0.08)]"
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}
            >
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
            <p className="text-xl font-bold text-[#1A1A2E] sm:text-2xl">{stat.value}</p>
            <p className="mt-0.5 text-xs font-medium text-[#8B93A1]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs + filters */}
      <div className="flex flex-col gap-3 border-b border-[#EEF0F4] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setPage(1);
                }}
                className={`relative shrink-0 px-3.5 py-3 text-sm font-semibold transition-colors ${
                  active ? 'text-[#6B46FE]' : 'text-[#8B93A1] hover:text-[#2D3436]'
                }`}
              >
                {tab.label}
                {active ? (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#6B46FE]" />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 pb-2 sm:pb-0">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#EEF0F4] bg-white px-3 text-sm font-semibold text-[#2D3436] transition-colors hover:border-[#6B46FE]/30 hover:text-[#6B46FE]"
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
          <label className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 appearance-none rounded-xl border border-[#EEF0F4] bg-white py-1.5 pl-3 pr-8 text-sm font-semibold text-[#2D3436] outline-none focus:border-[#6B46FE]/40 focus:ring-2 focus:ring-[#6B46FE]/15"
            >
              <option value="newest">Sort by: Newest First</option>
              <option value="oldest">Sort by: Oldest First</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A0A4B0]" />
          </label>
        </div>
      </div>

      {/* Booking list */}
      <div className="space-y-3">
        {paged.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#EEF0F4] bg-white px-6 py-16 text-center">
            <p className="text-sm font-semibold text-[#2D3436]">No bookings found</p>
            <p className="mt-1 text-xs text-[#8B93A1]">Try a different tab or create a new booking.</p>
          </div>
        ) : (
          paged.map((booking) => {
            const status = statusStyles[booking.status];
            return (
              <article
                key={booking.id}
                className="overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_4px_16px_-8px_rgba(17,24,39,0.08)] transition-shadow hover:shadow-[0_8px_28px_-10px_rgba(107,70,254,0.15)]"
              >
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch sm:gap-5 sm:p-5">
                  {/* Date block */}
                  <div className="flex w-full shrink-0 flex-row items-center gap-3 rounded-xl bg-[#F8F9FB] px-4 py-3 sm:w-[84px] sm:flex-col sm:justify-center sm:px-2 sm:py-4 sm:text-center">
                    <p className="text-2xl font-bold leading-none text-[#1A1A2E] sm:text-[28px]">
                      {booking.day}
                    </p>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#6B46FE]">
                        {booking.month}
                      </p>
                      <p className="text-[11px] font-medium text-[#8B93A1]">{booking.year}</p>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl sm:h-auto sm:w-32 lg:w-36">
                    <img
                      src={booking.coverImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-[#1A1A2E] sm:text-lg">
                        {booking.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${status.className}`}
                        >
                          {status.label}
                        </span>
                        <button
                          type="button"
                          aria-label="More options"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A0A4B0] hover:bg-[#F8F9FB] hover:text-[#6B46FE]"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="mt-1 text-[11px] font-medium text-[#A0A4B0]">
                      Booking ID: #{booking.bookingId}
                    </p>

                    <div className="mt-3 grid gap-2 text-xs text-[#5B6472] sm:grid-cols-2">
                      <p className="inline-flex items-center gap-2">
                        <Clock3 className="h-3.5 w-3.5 shrink-0 text-[#6B46FE]" />
                        {booking.dateLabel} · {booking.time}
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#6B46FE]" />
                        {booking.venue}, {booking.city}
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <UserRound className="h-3.5 w-3.5 shrink-0 text-[#6B46FE]" />
                        {booking.photographer}
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <Camera className="h-3.5 w-3.5 shrink-0 text-[#6B46FE]" />
                        {booking.category}
                      </p>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        className="text-sm font-bold text-[#6B46FE] transition-colors hover:text-[#5530e8]"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 ? (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            aria-label="Previous page"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEF0F4] bg-white text-[#636E72] transition-colors hover:border-[#6B46FE]/30 hover:text-[#6B46FE] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                n === currentPage
                  ? 'bg-[#6B46FE] text-white shadow-md shadow-[#6B46FE]/25'
                  : 'border border-[#EEF0F4] bg-white text-[#636E72] hover:border-[#6B46FE]/30 hover:text-[#6B46FE]'
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next page"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEF0F4] bg-white text-[#636E72] transition-colors hover:border-[#6B46FE]/30 hover:text-[#6B46FE] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
