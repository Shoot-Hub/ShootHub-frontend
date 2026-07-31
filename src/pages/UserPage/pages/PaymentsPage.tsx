import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  Filter,
  Headphones,
  MapPin,
  Plus,
  UserRound,
  Wallet,
} from 'lucide-react';
import {
  bookingStatusStyles,
  formatINR,
  paymentStats,
  progressLabels,
  progressStyles,
  savedPaymentMethods,
  userPayments,
  type PaymentTab,
} from '../data/paymentsData';

const tabs: { id: PaymentTab; label: string }[] = [
  { id: 'all', label: 'All Payments' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'paid', label: 'Paid' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const stats = [
  {
    label: 'Total Paid',
    value: formatINR(paymentStats.totalPaid),
    icon: Wallet,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#6B46FE]',
  },
  {
    label: 'Pending / Remaining',
    value: formatINR(paymentStats.pendingRemaining),
    icon: Clock3,
    iconBg: 'bg-[#E8F1FF]',
    iconColor: 'text-[#2F6FED]',
  },
  {
    label: 'Total Outstanding',
    value: formatINR(paymentStats.outstanding),
    icon: CreditCard,
    iconBg: 'bg-[#FFF1E8]',
    iconColor: 'text-[#E67E22]',
  },
  {
    label: 'Total Bookings',
    value: String(paymentStats.totalBookings),
    icon: CalendarDays,
    iconBg: 'bg-[#E8F8EF]',
    iconColor: 'text-[#1B9C5A]',
  },
];

export function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<PaymentTab>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedMethod, setSelectedMethod] = useState(
    savedPaymentMethods.find((m) => m.default)?.id ?? savedPaymentMethods[0].id,
  );
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const filtered = useMemo(() => {
    let list = [...userPayments];
    if (activeTab === 'upcoming') list = list.filter((p) => p.status === 'upcoming');
    if (activeTab === 'paid') list = list.filter((p) => p.progress === 'paid');
    if (activeTab === 'pending')
      list = list.filter((p) => p.progress === 'pending' || p.progress === 'partially_paid');
    if (activeTab === 'completed') list = list.filter((p) => p.progress === 'paid');
    if (activeTab === 'cancelled') list = list.filter((p) => p.status === 'cancelled');
    if (sortBy === 'oldest') list.reverse();
    return list;
  }, [activeTab, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const chartSegments = [
    { label: 'Paid', value: 48, color: '#6B46FE' },
    { label: 'Pending', value: 28, color: '#2F6FED' },
    { label: 'Outstanding', value: 16, color: '#E67E22' },
    { label: 'Refunded', value: 8, color: '#A0A4B0' },
  ];
  const gradient = chartSegments
    .reduce<{ stops: string[]; acc: number }>(
      (acc, seg) => {
        const start = acc.acc;
        const end = acc.acc + seg.value;
        acc.stops.push(`${seg.color} ${start}% ${end}%`);
        acc.acc = end;
        return acc;
      },
      { stops: [], acc: 0 },
    )
    .stops.join(', ');

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">Payments</h2>
          <p className="mt-1 text-sm text-[#8B93A1]">
            Track invoices, advances, and payment history.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#6B46FE] px-4 text-sm font-bold text-white shadow-md shadow-[#6B46FE]/25 transition-all hover:bg-[#5530e8]"
        >
          <Plus className="h-4 w-4" />
          New Payment
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-[0_4px_16px_-8px_rgba(17,24,39,0.08)]"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
            <p className="text-xl font-bold text-[#1A1A2E] sm:text-2xl">{stat.value}</p>
            <p className="mt-0.5 text-xs font-medium text-[#8B93A1]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
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
                    className={`relative shrink-0 px-3 py-3 text-sm font-semibold transition-colors ${
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
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#EEF0F4] bg-white px-3 text-sm font-semibold text-[#2D3436]"
              >
                <Filter className="h-3.5 w-3.5" />
                Filter
              </button>
              <label className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-9 appearance-none rounded-xl border border-[#EEF0F4] bg-white py-1.5 pl-3 pr-8 text-sm font-semibold text-[#2D3436] outline-none"
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="oldest">Sort by: Oldest</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A0A4B0]" />
              </label>
            </div>
          </div>

          <div className="space-y-3">
            {paged.map((payment) => (
              <article
                key={payment.id}
                className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-[0_4px_16px_-8px_rgba(17,24,39,0.08)] sm:p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                  <div className="min-w-[100px]">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#8B93A1]">
                      {payment.date}
                    </p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${bookingStatusStyles[payment.status]}`}
                    >
                      {payment.status}
                    </span>
                  </div>

                  <div className="flex min-w-0 flex-1 gap-3">
                    <img
                      src={payment.coverImage}
                      alt=""
                      className="h-20 w-24 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="text-base font-bold text-[#1A1A2E]">{payment.title}</h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${progressStyles[payment.progress]}`}
                        >
                          {progressLabels[payment.progress]}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] font-medium text-[#A0A4B0]">
                        Booking ID: #{payment.bookingId}
                      </p>
                      <div className="mt-2 grid gap-1.5 text-xs text-[#5B6472] sm:grid-cols-2">
                        <p className="inline-flex items-center gap-1.5">
                          <UserRound className="h-3.5 w-3.5 text-[#6B46FE]" />
                          {payment.photographer}
                        </p>
                        <p className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#6B46FE]" />
                          {payment.venue}, {payment.city}
                        </p>
                        <p className="inline-flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5 text-[#6B46FE]" />
                          {payment.time}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 rounded-xl bg-[#F8F9FB] p-3 text-center lg:min-w-[220px] lg:grid-cols-1 lg:text-left">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-[#8B93A1]">
                        Total
                      </p>
                      <p className="text-sm font-bold text-[#1A1A2E]">{formatINR(payment.total)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-[#8B93A1]">
                        Paid
                      </p>
                      <p className="text-sm font-bold text-[#1B9C5A]">{formatINR(payment.paid)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-[#8B93A1]">
                        Remaining
                      </p>
                      <p className="text-sm font-bold text-[#E67E22]">
                        {formatINR(payment.remaining)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-[#F3F4F8] pt-4">
                  {payment.remaining > 0 && payment.status !== 'cancelled' ? (
                    <button
                      type="button"
                      className="rounded-xl bg-[#6B46FE] px-4 py-2 text-sm font-bold text-white shadow-sm shadow-[#6B46FE]/25 hover:bg-[#5530e8]"
                    >
                      Pay Now
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="rounded-xl border border-[#6B46FE] px-4 py-2 text-sm font-semibold text-[#6B46FE] hover:bg-[#F3EEFF]"
                  >
                    View Invoice
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEF0F4] bg-white text-[#636E72] disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                  n === currentPage
                    ? 'bg-[#6B46FE] text-white'
                    : 'border border-[#EEF0F4] bg-white text-[#636E72]'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEF0F4] bg-white text-[#636E72] disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right widgets */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-[0_4px_16px_-8px_rgba(17,24,39,0.08)]">
            <h3 className="text-sm font-bold text-[#1A1A2E]">Payment Summary</h3>
            <div
              className="mx-auto mt-5 h-36 w-36 rounded-full"
              style={{
                background: `conic-gradient(${gradient})`,
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 22px), #000 calc(100% - 22px))',
                WebkitMask:
                  'radial-gradient(farthest-side, transparent calc(100% - 22px), #000 calc(100% - 22px))',
              }}
            />
            <ul className="mt-5 space-y-2">
              {chartSegments.map((seg) => (
                <li key={seg.label} className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-2 font-medium text-[#5B6472]">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: seg.color }}
                    />
                    {seg.label}
                  </span>
                  <span className="font-bold text-[#1A1A2E]">{seg.value}%</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-4 w-full rounded-xl border border-[#EEF0F4] py-2.5 text-sm font-semibold text-[#6B46FE] hover:bg-[#F3EEFF]"
            >
              View Full Report
            </button>
          </div>

          <div className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-[0_4px_16px_-8px_rgba(17,24,39,0.08)]">
            <h3 className="text-sm font-bold text-[#1A1A2E]">Saved Payment Methods</h3>
            <div className="mt-3 space-y-2">
              {savedPaymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition-colors ${
                    selectedMethod === method.id
                      ? 'border-[#6B46FE] bg-[#F3EEFF]'
                      : 'border-[#EEF0F4] hover:border-[#6B46FE]/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    checked={selectedMethod === method.id}
                    onChange={() => setSelectedMethod(method.id)}
                    className="accent-[#6B46FE]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#1A1A2E]">{method.brand}</p>
                    <p className="truncate text-[11px] text-[#8B93A1]">
                      {method.brand === 'UPI'
                        ? method.last4
                        : `•••• ${method.last4} · Exp ${method.expiry}`}
                    </p>
                  </div>
                  {selectedMethod === method.id ? (
                    <CheckCircle2 className="h-4 w-4 text-[#6B46FE]" />
                  ) : null}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#6B46FE] to-[#8A60FF] p-5 text-white shadow-md shadow-[#6B46FE]/20">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <Headphones className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold">Need Help?</h3>
            <p className="mt-1 text-xs text-white/80">
              Questions about invoices or refunds? Our team is here.
            </p>
            <Link
              to="/user/support"
              className="mt-4 inline-flex rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-[#6B46FE]"
            >
              Contact Support
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
