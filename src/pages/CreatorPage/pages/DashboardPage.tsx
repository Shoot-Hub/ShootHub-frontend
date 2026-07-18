import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  Eye,
  CalendarCheck,
  DollarSign,
  Star,
  ArrowUpRight,
  ArrowRight,
  Images,
  Package,
  Pencil,
  UserPlus,
  BadgeCheck,
  ChevronDown,
  Sparkles,
  FileText,
  Video,
  Phone,
  MoreHorizontal,
} from 'lucide-react';
import { useAuth } from '@/store';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const performanceData = [
  { day: '1', views: 820, bookings: 12, revenue: 18 },
  { day: '5', views: 1100, bookings: 18, revenue: 28 },
  { day: '10', views: 980, bookings: 15, revenue: 22 },
  { day: '15', views: 1450, bookings: 24, revenue: 38 },
  { day: '18', views: 1320, bookings: 21, revenue: 34 },
  { day: '20', views: 1680, bookings: 28, revenue: 45 },
  { day: '22', views: 1540, bookings: 25, revenue: 40 },
  { day: '25', views: 1890, bookings: 32, revenue: 52 },
  { day: '28', views: 1720, bookings: 29, revenue: 48 },
  { day: '30', views: 2100, bookings: 36, revenue: 58 },
];

const sparklinePaths = {
  blue: 'M0,28 C8,24 12,18 20,20 C28,22 32,10 40,12 C48,14 52,8 60,6',
  purple: 'M0,22 C8,26 12,16 20,18 C28,20 32,8 40,10 C48,12 52,4 60,8',
  green: 'M0,26 C8,20 12,24 20,16 C28,10 32,14 40,8 C48,6 52,10 60,4',
  amber: 'M0,20 C8,18 12,22 20,14 C28,12 32,16 40,10 C48,8 52,6 60,10',
};

function Sparkline({ color, path }: { color: string; path: string }) {
  return (
    <svg viewBox="0 0 60 32" className="mt-1.5 h-6 w-full" preserveAspectRatio="none">
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path
        d={`${path} L60,32 L0,32 Z`}
        fill={color}
        fillOpacity="0.12"
        stroke="none"
      />
    </svg>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <div className="relative h-[76px] w-[76px] shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="7" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="white"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-white">{percent}%</span>
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const reviews = [
  {
    name: 'Priya Sharma',
    time: '2 days ago',
    text: 'Absolutely stunning wedding photos! Yuvraj captured every emotion perfectly. Highly recommend!',
    avatar: 'https://i.pravatar.cc/80?img=5',
  },
  {
    name: 'Rahul Mehta',
    time: '5 days ago',
    text: 'Professional, creative, and so easy to work with. Our engagement shoot turned out amazing.',
    avatar: 'https://i.pravatar.cc/80?img=12',
  },
  {
    name: 'Ananya Patel',
    time: '1 week ago',
    text: 'Best photographer in the city! The portfolio quality speaks for itself. Booking again soon.',
    avatar: 'https://i.pravatar.cc/80?img=9',
  },
];

const portfolioThumbs = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=220&fit=crop',
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=300&h=220&fit=crop',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=300&h=220&fit=crop',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=300&h=220&fit=crop',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=300&h=220&fit=crop',
  'https://images.unsplash.com/photo-1511285560929-80b456fe3b6f?w=300&h=220&fit=crop',
];

const bookings = {
  today: [
    {
      title: 'Wedding Shoot — Sharma Family',
      client: 'Priya & Arjun',
      time: '10:00 AM',
      avatars: ['https://i.pravatar.cc/40?img=5', 'https://i.pravatar.cc/40?img=11'],
      status: 'video' as const,
    },
    {
      title: 'Product Photography',
      client: 'StyleCo Brand',
      time: '3:30 PM',
      avatars: ['https://i.pravatar.cc/40?img=33'],
      status: 'call' as const,
    },
  ],
  tomorrow: [
    {
      title: 'Engagement Session',
      client: 'Neha & Vikram',
      time: '11:00 AM',
      avatars: ['https://i.pravatar.cc/40?img=20', 'https://i.pravatar.cc/40?img=15'],
      status: 'video' as const,
    },
  ],
  week: [
    {
      title: 'Corporate Headshots',
      client: 'TechVista Inc.',
      time: 'Wed 2:00 PM',
      avatars: ['https://i.pravatar.cc/40?img=47'],
      status: 'more' as const,
    },
  ],
};

function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#F0F1F5] bg-white px-3.5 py-2.5 shadow-lg">
      <p className="mb-1.5 text-xs font-semibold text-[#2D3436]">Day {label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-[11px] text-[#636E72]">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="capitalize">{p.name}:</span>
          <span className="font-semibold text-[#2D3436]">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.firstName || user?.fullName?.split(' ')[0] || 'Creator';
  const score = user?.profileCompletionPercent ?? 85;
  const profileViews = user?.profileViews ?? 1254;
  const bookingsCount = user?.rating?.totalBookings ?? 48;
  const rating = user?.rating?.average?.toFixed(1) ?? '4.9';
  const portfolioImages =
    user?.portfolioImages?.map((img) => img.url).filter(Boolean).slice(0, 6) ?? [];
  const thumbs = portfolioImages.length >= 6 ? portfolioImages : portfolioThumbs;

  const stats = [
    {
      label: 'Profile Views',
      value: profileViews.toLocaleString(),
      change: '+18.6%',
      icon: Eye,
      iconBg: 'bg-[#E8F4FD]',
      iconColor: 'text-[#3498DB]',
      sparkColor: '#3498DB',
      sparkPath: sparklinePaths.blue,
    },
    {
      label: 'Bookings',
      value: String(bookingsCount),
      change: '+12.4%',
      icon: CalendarCheck,
      iconBg: 'bg-[#EDE5FF]',
      iconColor: 'text-[#6B46FE]',
      sparkColor: '#6B46FE',
      sparkPath: sparklinePaths.purple,
    },
    {
      label: 'Earnings',
      value: '₹84.2k',
      change: '+24.8%',
      icon: DollarSign,
      iconBg: 'bg-[#E4F8ED]',
      iconColor: 'text-[#28C76F]',
      sparkColor: '#28C76F',
      sparkPath: sparklinePaths.green,
    },
    {
      label: 'Rating',
      value: rating,
      change: '+0.3%',
      icon: Star,
      iconBg: 'bg-[#FFF4E5]',
      iconColor: 'text-[#FF9F43]',
      sparkColor: '#FF9F43',
      sparkPath: sparklinePaths.amber,
    },
  ];

  const quickActions = [
    {
      title: 'Upload Portfolio',
      desc: 'Add new photos to showcase',
      path: '/creator/portfolio',
      icon: Images,
      bg: 'bg-gradient-to-br from-[#6B46FE] to-[#8A60FF]',
    },
    {
      title: 'Create Package',
      desc: 'Set up a new service package',
      path: '/creator/packages',
      icon: Package,
      bg: 'bg-gradient-to-br from-[#3498DB] to-[#5DADE2]',
    },
    {
      title: 'Edit Pricing',
      desc: 'Update your rate cards',
      path: '/creator/packages',
      icon: Pencil,
      bg: 'bg-gradient-to-br from-[#FF9F43] to-[#FFB976]',
    },
    {
      title: 'Add Team Member',
      desc: 'Invite assistants & editors',
      path: '/creator/settings',
      icon: UserPlus,
      bg: 'bg-gradient-to-br from-[#28C76F] to-[#48D68A]',
    },
    {
      title: 'Verify Profile',
      desc: 'Get verified badge status',
      path: '/creator/profile',
      icon: BadgeCheck,
      bg: 'bg-gradient-to-br from-[#EA5455] to-[#F08182]',
    },
  ];

  const suggestions = [
    { text: 'Add more photos to your wedding portfolio', icon: Images },
    { text: 'Complete your bio to attract more clients', icon: FileText },
    { text: 'Add packages for corporate shoots', icon: Package },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Greeting */}
      <motion.div variants={item}>
        <h1 className="text-xl font-bold text-[#2D3436] sm:text-2xl sm:text-[28px]">
          {getGreeting()}, {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-[#636E72]">
          Here&apos;s what&apos;s happening with your photography business today.
        </p>
      </motion.div>

      {/* Profile completion + stats */}
      <motion.div variants={item} className="grid gap-3 lg:grid-cols-2">
        {/* Profile completion */}
        <div className="relative flex overflow-hidden rounded-xl bg-gradient-to-br from-[#6B46FE] via-[#7B5CFF] to-[#5B3FD9] p-4 text-white shadow-md shadow-[#6B46FE]/20 sm:p-5">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
          <div className="relative flex flex-1 items-center gap-3.5">
            <ProgressRing percent={score} />
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold">Complete Your Profile</h3>
              <p className="mt-1 text-xs leading-snug text-white/75 line-clamp-2">
                Finish your profile to get more bookings and appear higher in search.
              </p>
              <Link
                to="/creator/profile"
                className="mt-2.5 inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#6B46FE] transition-all hover:bg-white/95"
              >
                Complete Profile
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[#F0F1F5] bg-white p-3 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] sm:p-3.5"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.iconBg}`}
                >
                  <stat.icon className={`h-3.5 w-3.5 ${stat.iconColor}`} />
                </div>
                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-[#28C76F]">
                  {stat.change}
                  <ArrowUpRight className="h-2.5 w-2.5" />
                </span>
              </div>
              <p className="mt-2 text-[11px] font-medium text-[#636E72]">{stat.label}</p>
              <p className="text-lg font-bold text-[#2D3436]">{stat.value}</p>
              <Sparkline color={stat.sparkColor} path={stat.sparkPath} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="mb-3 text-base font-bold text-[#2D3436]">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.path}
              className={`group relative flex min-h-[120px] flex-col overflow-hidden rounded-2xl p-3.5 text-white shadow-md transition-transform active:scale-[0.98] sm:min-h-[140px] sm:p-4 hover:-translate-y-0.5 ${action.bg}`}
            >
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <action.icon className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold">{action.title}</h4>
              <p className="mt-1 text-[11px] leading-relaxed text-white/75">{action.desc}</p>
              <div className="mt-auto flex justify-end pt-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Performance + Bookings */}
      <motion.div variants={item} className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        {/* Performance Overview */}
        <div className="rounded-2xl border border-[#F0F1F5] bg-white p-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#2D3436]">Performance Overview</h3>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#636E72]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#6B46FE]" /> Views
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#3498DB]" /> Bookings
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#28C76F]" /> Revenue
                </span>
              </div>
            </div>
            <button className="flex items-center gap-1.5 rounded-xl border border-[#EEF0F4] bg-[#F8F9FB] px-3 py-2 text-xs font-semibold text-[#636E72] hover:bg-[#F0F1F5]">
              This Month
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="h-[200px] w-full sm:h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 8, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6B46FE" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#6B46FE" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="bookingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3498DB" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3498DB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#28C76F" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#28C76F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F4" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#A0A4B0', fontSize: 11 }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A0A4B0', fontSize: 11 }} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#6B46FE"
                  strokeWidth={2.5}
                  fill="url(#viewsGrad)"
                  name="Views"
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3498DB"
                  strokeWidth={2}
                  fill="url(#bookingsGrad)"
                  name="Bookings"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#28C76F"
                  strokeWidth={2}
                  fill="url(#revenueGrad)"
                  name="Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="rounded-2xl border border-[#F0F1F5] bg-white p-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#2D3436]">Upcoming Bookings</h3>
            <Link
              to="/creator/calendar"
              className="text-xs font-semibold text-[#6B46FE] hover:underline"
            >
              View Calendar
            </Link>
          </div>

          <div className="space-y-4">
            {(
              [
                ['Today', bookings.today],
                ['Tomorrow', bookings.tomorrow],
                ['This Week', bookings.week],
              ] as const
            ).map(([label, list]) => (
              <div key={label}>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#A0A4B0]">
                  {label}
                </p>
                <div className="space-y-2">
                  {list.map((b) => (
                    <div
                      key={b.title}
                      className="flex items-center gap-3 rounded-xl border border-[#F5F6F8] bg-[#FAFBFC] p-3 transition-colors hover:bg-[#F5F6FA]"
                    >
                      <div className="flex -space-x-2">
                        {b.avatars.map((src) => (
                          <img
                            key={src}
                            src={src}
                            alt=""
                            className="h-8 w-8 rounded-full border-2 border-white object-cover"
                          />
                        ))}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#2D3436]">{b.title}</p>
                        <p className="truncate text-[11px] text-[#636E72]">
                          {b.client} · {b.time}
                        </p>
                      </div>
                      <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#636E72] shadow-sm">
                        {b.status === 'video' && <Video className="h-3.5 w-3.5" />}
                        {b.status === 'call' && <Phone className="h-3.5 w-3.5" />}
                        {b.status === 'more' && <MoreHorizontal className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/creator/bookings"
            className="mt-4 flex items-center justify-center gap-1 text-sm font-semibold text-[#6B46FE] hover:underline"
          >
            View All Bookings
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </motion.div>

      {/* Reviews + Portfolio */}
      <motion.div variants={item} className="grid gap-4 lg:grid-cols-2">
        {/* Recent Reviews */}
        <div className="rounded-2xl border border-[#F0F1F5] bg-white p-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#2D3436]">Recent Reviews</h3>
            <Link
              to="/creator/reviews"
              className="text-xs font-semibold text-[#6B46FE] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.name} className="flex gap-3 border-b border-[#F5F6F8] pb-4 last:border-0 last:pb-0">
                <img
                  src={review.avatar}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <p className="text-sm font-semibold text-[#2D3436]">{review.name}</p>
                    <span className="text-[11px] text-[#A0A4B0]">{review.time}</span>
                  </div>
                  <div className="mt-0.5 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-[#FF9F43] text-[#FF9F43]" />
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#636E72]">{review.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Portfolio Uploads */}
        <div className="rounded-2xl border border-[#F0F1F5] bg-white p-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#2D3436]">Recent Portfolio Uploads</h3>
            <Link
              to="/creator/portfolio"
              className="text-xs font-semibold text-[#6B46FE] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {thumbs.slice(0, 6).map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="aspect-[4/3] overflow-hidden rounded-xl bg-[#F0F1F5]"
              >
                <img
                  src={src as string}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* AI Suggestions */}
      <motion.div
        variants={item}
        className="flex flex-col gap-3 rounded-2xl border border-[#EDE5FF] bg-gradient-to-r from-[#F8F5FF] to-[#F3EEFF] p-3.5 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
      >
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6B46FE] to-[#8A60FF] text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-[#2D3436]">AI Suggestions</span>
        </div>
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          {suggestions.map((s) => (
            <div
              key={s.text}
              className="flex flex-1 items-center gap-2.5 rounded-xl border border-white/80 bg-white px-3 py-2.5 shadow-sm"
            >
              <s.icon className="h-4 w-4 shrink-0 text-[#6B46FE]" />
              <span className="text-xs font-medium text-[#636E72]">{s.text}</span>
            </div>
          ))}
        </div>
        <button className="w-full shrink-0 rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B46FE]/25 transition-all hover:shadow-lg sm:w-auto">
          View All Suggestions →
        </button>
      </motion.div>
    </motion.div>
  );
}
