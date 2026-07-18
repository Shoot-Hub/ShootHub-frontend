import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Plus,
  Crown,
  CreditCard,
  Users,
  Calendar,
  Check,
  Download,
  ChevronDown,
  ArrowUpRight,
  HardDrive,
  Image,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '@/store';

type Tab = 'Overview' | 'Plans' | 'Transactions' | 'Invoices';

const chartData = [
  { month: 'Mar', value: 42 },
  { month: 'Apr', value: 58 },
  { month: 'May', value: 51 },
  { month: 'Jun', value: 72 },
  { month: 'Jul', value: 88 },
  { month: 'Aug', value: 124 },
];

const proFeatures = [
  'Unlimited Uploads',
  'AI Face Search',
  'Client Galleries',
  'Booking Management',
  'Team Members (5)',
  'Priority Support',
];

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '₹999',
    period: '/mo',
    audience: 'For freelancers just starting out',
    features: ['10 GB Storage', '50 Portfolio Images', 'Basic Analytics', 'Email Support'],
    action: 'Downgrade',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹2,499',
    period: '/mo',
    audience: 'For growing photography businesses',
    features: [
      '100 GB Storage',
      'Unlimited Photos',
      'AI Face Search',
      '5 Team Members',
      'Priority Support',
    ],
    action: 'Current Plan',
    popular: true,
    current: true,
  },
  {
    id: 'studio',
    name: 'Studio',
    price: '₹4,999',
    period: '/mo',
    audience: 'For studios & multi-photographer teams',
    features: [
      '500 GB Storage',
      'Unlimited Everything',
      'White Label Galleries',
      'Unlimited Team',
      'Dedicated Support',
    ],
    action: 'Upgrade',
    popular: false,
  },
];

const usageBars = [
  {
    label: 'Storage Used',
    value: '45 GB / 100 GB',
    percent: 45,
    color: 'bg-[#28C76F]',
    icon: HardDrive,
    iconBg: 'bg-[#E4F8ED]',
    iconColor: 'text-[#28C76F]',
  },
  {
    label: 'Photos Uploaded',
    value: '1,245 / Unlimited',
    percent: 72,
    color: 'bg-[#3498DB]',
    icon: Image,
    iconBg: 'bg-[#E8F4FD]',
    iconColor: 'text-[#3498DB]',
  },
  {
    label: 'Team Members',
    value: '3 / 5 Members',
    percent: 60,
    color: 'bg-[#FF9F43]',
    icon: UserPlus,
    iconBg: 'bg-[#FFF4E5]',
    iconColor: 'text-[#FF9F43]',
  },
];

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#F0F1F5] bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-[#2D3436]">{label}</p>
      <p className="text-sm font-bold text-[#6B46FE]">{payload[0].value} subscribers</p>
    </div>
  );
}

export function SubscriptionsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('Overview');

  const planName =
    user?.currentSubscription?.plan
      ? `${user.currentSubscription.plan.charAt(0).toUpperCase()}${user.currentSubscription.plan.slice(1)} Plan`
      : 'Pro Plan';
  const isActive = (user?.currentSubscription?.status || 'active') === 'active';

  const stats = [
    {
      label: 'Current Plan',
      value: planName.replace(' Plan', ''),
      meta: isActive ? 'Active · Renews 23 Sep' : 'Inactive',
      icon: Crown,
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#6B46FE]',
      badge: isActive ? 'Active' : 'Inactive',
      badgeClass: isActive ? 'bg-[#E4F8ED] text-[#28C76F]' : 'bg-[#FFF4E5] text-[#FF9F43]',
    },
    {
      label: 'Monthly Cost',
      value: '₹2,499',
      meta: 'Billed monthly',
      icon: CreditCard,
      iconBg: 'bg-[#E8F4FD]',
      iconColor: 'text-[#3498DB]',
      badge: 'Monthly',
      badgeClass: 'bg-[#E8F4FD] text-[#3498DB]',
    },
    {
      label: 'Active Subscribers',
      value: '124',
      meta: '↑ 18% from last month',
      icon: Users,
      iconBg: 'bg-[#E4F8ED]',
      iconColor: 'text-[#28C76F]',
      metaColor: 'text-[#28C76F]',
    },
    {
      label: 'Next Billing Date',
      value: '23 Sep, 2024',
      meta: '15 days remaining',
      icon: Calendar,
      iconBg: 'bg-[#FFF4E5]',
      iconColor: 'text-[#FF9F43]',
      metaColor: 'text-[#FF9F43]',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#2D3436] sm:text-2xl">Subscriptions</h2>
          <p className="mt-0.5 text-sm text-[#636E72]">
            Manage your subscription plans and billing.
          </p>
        </div>
        <button className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B46FE]/25 sm:w-auto">
          <Plus className="h-4 w-4" />
          Create New Plan
        </button>
      </div>

      {/* Tabs */}
      <div className="-mx-1 overflow-x-auto px-1">
        <div className="flex min-w-max gap-1 border-b border-[#EEF0F4]">
          {(['Overview', 'Plans', 'Transactions', 'Invoices'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative shrink-0 px-3 py-2.5 text-sm font-semibold transition-colors sm:px-4 ${
                tab === t ? 'text-[#6B46FE]' : 'text-[#636E72] hover:text-[#2D3436]'
              }`}
            >
              {t}
              {tab === t && (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#6B46FE]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {tab === 'Overview' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-[#EEF0F4] bg-white p-3.5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] sm:p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${stat.iconBg}`}
                  >
                    <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.iconColor}`} />
                  </div>
                  {stat.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${stat.badgeClass}`}
                    >
                      {stat.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-medium text-[#636E72] sm:text-xs">{stat.label}</p>
                <p className="mt-0.5 text-lg font-bold text-[#2D3436] sm:text-xl">{stat.value}</p>
                <p
                  className={`mt-1 flex items-center gap-0.5 text-[10px] font-medium sm:text-[11px] ${
                    stat.metaColor || 'text-[#A0A4B0]'
                  }`}
                >
                  {stat.metaColor === 'text-[#28C76F]' && <ArrowUpRight className="h-3 w-3" />}
                  {stat.meta}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Current subscription + Available plans */}
          <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
            {/* Current Subscription */}
            <div className="overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
              <div className="border-b border-[#F5F6F8] px-4 py-3 sm:px-5">
                <h3 className="text-sm font-bold text-[#2D3436] sm:text-base">
                  Current Subscription
                </h3>
              </div>
              <div className="grid md:grid-cols-2">
                {/* Purple feature card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#6B46FE] via-[#7B5CFF] to-[#5B3FD9] p-5 text-white sm:p-6">
                  <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
                  <div className="relative">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/40">
                      <Crown className="h-4 w-4" />
                    </div>
                    <h4 className="text-lg font-bold">{planName}</h4>
                    <p className="mt-1 text-2xl font-bold">
                      ₹2,499
                      <span className="text-sm font-medium text-white/70">/month</span>
                    </p>
                    <ul className="mt-4 space-y-2">
                      {proFeatures.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-white/90 sm:text-sm">
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/20">
                            <Check className="h-2.5 w-2.5" />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button className="mt-5 w-full rounded-xl bg-white py-2.5 text-sm font-bold text-[#6B46FE] transition-colors hover:bg-white/95">
                      Manage Plan
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-0 p-4 sm:p-5">
                  {[
                    { label: 'Status', value: 'Active', badge: true },
                    { label: 'Plan', value: planName },
                    { label: 'Billing Cycle', value: 'Monthly' },
                    { label: 'Amount', value: '₹2,499' },
                    { label: 'Start Date', value: '23 Mar, 2024' },
                    { label: 'Next Billing', value: '23 Sep, 2024' },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between border-b border-[#F5F6F8] py-2.5 last:border-0"
                    >
                      <span className="text-xs text-[#A0A4B0] sm:text-sm">{row.label}</span>
                      {row.badge ? (
                        <span className="rounded-full bg-[#E4F8ED] px-2.5 py-0.5 text-[11px] font-bold text-[#28C76F]">
                          {row.value}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-[#2D3436] sm:text-sm">
                          {row.value}
                        </span>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-b border-[#F5F6F8] py-2.5">
                    <span className="text-xs text-[#A0A4B0] sm:text-sm">Payment Method</span>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#1A1F71] px-1.5 py-0.5 text-[9px] font-bold text-white">
                        VISA
                      </span>
                      <span className="text-xs font-semibold text-[#2D3436]">•••• 4242</span>
                      <button className="text-[11px] font-bold text-[#6B46FE] hover:underline">
                        Update
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-xs text-[#A0A4B0] sm:text-sm">Invoice</span>
                    <button className="inline-flex items-center gap-1 text-xs font-bold text-[#6B46FE] hover:underline">
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Plans */}
            <div className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] sm:p-5">
              <h3 className="mb-4 text-sm font-bold text-[#2D3436] sm:text-base">Available Plans</h3>
              <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 xl:flex-col xl:overflow-visible xl:pb-0">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative min-w-[240px] shrink-0 rounded-2xl border p-4 xl:min-w-0 ${
                      plan.popular
                        ? 'border-[#6B46FE] bg-[#F8F5FF] ring-1 ring-[#6B46FE]/20'
                        : 'border-[#EEF0F4] bg-[#FAFBFC]'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2.5 right-3 rounded-full bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        Most Popular
                      </span>
                    )}
                    <div className="flex items-baseline gap-1">
                      <h4 className="text-base font-bold text-[#2D3436]">{plan.name}</h4>
                      <span className="text-lg font-bold text-[#6B46FE]">{plan.price}</span>
                      <span className="text-xs text-[#A0A4B0]">{plan.period}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#636E72]">{plan.audience}</p>
                    <ul className="mt-3 space-y-1.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-[#636E72]">
                          <Check className="h-3.5 w-3.5 shrink-0 text-[#28C76F]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      disabled={plan.current}
                      className={`mt-4 w-full rounded-xl py-2.5 text-xs font-bold transition-all ${
                        plan.current
                          ? 'cursor-default bg-[#EDE5FF] text-[#6B46FE]'
                          : plan.action === 'Upgrade'
                            ? 'bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] text-white shadow-sm shadow-[#6B46FE]/25'
                            : 'border border-[#EEF0F4] bg-white text-[#636E72] hover:bg-[#F8F9FB]'
                      }`}
                    >
                      {plan.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart + Usage */}
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-[#2D3436] sm:text-base">
                  Subscription Overview
                </h3>
                <button className="flex items-center gap-1.5 rounded-xl border border-[#EEF0F4] bg-[#F8F9FB] px-3 py-1.5 text-xs font-semibold text-[#636E72]">
                  Last 6 Months
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="h-[200px] w-full sm:h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
                    <defs>
                      <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6B46FE" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#6B46FE" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F4" vertical={false} />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#A0A4B0', fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#A0A4B0', fontSize: 11 }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#6B46FE"
                      strokeWidth={2.5}
                      fill="url(#subGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] sm:p-5">
              <h3 className="mb-4 text-sm font-bold text-[#2D3436] sm:text-base">
                Usage This Month
              </h3>
              <div className="space-y-5">
                {usageBars.map((bar) => (
                  <div key={bar.label}>
                    <div className="mb-2 flex items-center gap-2.5">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bar.iconBg}`}
                      >
                        <bar.icon className={`h-4 w-4 ${bar.iconColor}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-[#2D3436]">{bar.label}</p>
                          <p className="shrink-0 text-[11px] font-medium text-[#A0A4B0]">
                            {bar.value}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#F0F1F5]">
                      <div
                        className={`h-full rounded-full ${bar.color} transition-all`}
                        style={{ width: `${bar.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {tab !== 'Overview' && (
        <div className="rounded-2xl border border-dashed border-[#E0D4FF] bg-white px-4 py-16 text-center">
          <Crown className="mx-auto h-10 w-10 text-[#C4B5FD]" />
          <h3 className="mt-3 text-base font-bold text-[#2D3436]">{tab}</h3>
          <p className="mt-1 text-sm text-[#636E72]">
            {tab} details coming soon. Overview mein aapki current plan dekh sakte ho.
          </p>
        </div>
      )}
    </div>
  );
}
