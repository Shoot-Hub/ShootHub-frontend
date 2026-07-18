import { motion } from 'framer-motion';
import {
  Eye,
  CalendarCheck,
  DollarSign,
  UserRound,
  Percent,
  ArrowUpRight,
  ChevronDown,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const stats = [
  {
    label: 'Total Views',
    value: '12,548',
    change: '+12.5%',
    icon: Eye,
    iconBg: 'bg-[#E8F4FD]',
    iconColor: 'text-[#3498DB]',
  },
  {
    label: 'Bookings',
    value: '86',
    change: '+8.2%',
    icon: CalendarCheck,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#6B46FE]',
  },
  {
    label: 'Revenue',
    value: '₹1,24,560',
    change: '+18.4%',
    icon: DollarSign,
    iconBg: 'bg-[#E4F8ED]',
    iconColor: 'text-[#28C76F]',
  },
  {
    label: 'Profile Views',
    value: '2,345',
    change: '+6.1%',
    icon: UserRound,
    iconBg: 'bg-[#FFF4E5]',
    iconColor: 'text-[#FF9F43]',
  },
  {
    label: 'Conversion Rate',
    value: '6.85%',
    change: '+2.3%',
    icon: Percent,
    iconBg: 'bg-[#FFE8E8]',
    iconColor: 'text-[#EA5455]',
  },
];

const viewsData = [
  { month: 'Jan', views: 4200 },
  { month: 'Feb', views: 5100 },
  { month: 'Mar', views: 4800 },
  { month: 'Apr', views: 6200 },
  { month: 'May', views: 7800 },
  { month: 'Jun', views: 7200 },
  { month: 'Jul', views: 9100 },
  { month: 'Aug', views: 8600 },
  { month: 'Sep', views: 10200 },
  { month: 'Oct', views: 9800 },
  { month: 'Nov', views: 11500 },
  { month: 'Dec', views: 12548 },
];

const bookingsData = [
  { month: 'Jan', bookings: 42 },
  { month: 'Feb', bookings: 55 },
  { month: 'Mar', bookings: 48 },
  { month: 'Apr', bookings: 62 },
  { month: 'May', bookings: 71 },
  { month: 'Jun', bookings: 58 },
  { month: 'Jul', bookings: 79 },
  { month: 'Aug', bookings: 68 },
  { month: 'Sep', bookings: 82 },
  { month: 'Oct', bookings: 74 },
  { month: 'Nov', bookings: 88 },
  { month: 'Dec', bookings: 86 },
];

const servicesData = [
  { name: 'Wedding Photography', value: 45, color: '#6B46FE' },
  { name: 'Pre Wedding Shoot', value: 22, color: '#8A60FF' },
  { name: 'Cinematic Reels', value: 15, color: '#47BFFF' },
  { name: 'Portrait Sessions', value: 10, color: '#28C76F' },
  { name: 'Product Shoots', value: 8, color: '#FF9F43' },
];

export function AnalyticsPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2D3436]">Analytics</h2>
          <p className="mt-0.5 text-sm text-[#636E72]">
            Track performance, bookings, and revenue growth.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-[#EEF0F4] bg-white px-3.5 py-2 text-sm font-semibold text-[#636E72] shadow-sm hover:bg-[#F8F9FB]"
        >
          Last 12 months
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#E4F8ED] px-2 py-0.5 text-[11px] font-bold text-[#28C76F]">
                <ArrowUpRight className="h-3 w-3" />
                {stat.change}
              </span>
            </div>
            <p className="mt-3 text-xs font-medium text-[#A0A4B0]">{stat.label}</p>
            <p className="mt-0.5 text-xl font-bold tracking-tight text-[#2D3436]">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#2D3436]">Views Over Time</h3>
            <span className="text-xs font-medium text-[#A0A4B0]">Monthly</span>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6B46FE" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6B46FE" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F4" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#A0A4B0', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#A0A4B0', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #EEF0F4',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#6B46FE"
                  strokeWidth={2.5}
                  fill="url(#viewsGrad)"
                  name="Views"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#2D3436]">Bookings Over Time</h3>
            <span className="text-xs font-medium text-[#A0A4B0]">Monthly</span>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F4" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#A0A4B0', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#A0A4B0', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #EEF0F4',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  }}
                />
                <Bar dataKey="bookings" fill="#6B46FE" radius={[6, 6, 0, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Services donut */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]"
      >
        <h3 className="mb-4 text-base font-bold text-[#2D3436]">Top Performing Services</h3>
        <div className="grid items-center gap-6 md:grid-cols-[240px_1fr]">
          <div className="relative mx-auto h-[220px] w-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={servicesData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={90}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {servicesData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Share']}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #EEF0F4',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-[#2D3436]">45%</p>
              <p className="text-[11px] font-medium text-[#A0A4B0]">Wedding</p>
            </div>
          </div>

          <div className="space-y-3">
            {servicesData.map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-[#2D3436]">{s.name}</p>
                    <p className="shrink-0 text-sm font-bold text-[#2D3436]">{s.value}%</p>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#F0F1F5]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${s.value}%`, backgroundColor: s.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
