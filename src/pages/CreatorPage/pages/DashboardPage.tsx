import { motion } from 'framer-motion';
import { useAuth } from '@/store';
import {
  Camera,
  Eye,
  Star,
  CalendarCheck,
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight,
  Clock,
  Target,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      label: 'Profile Views',
      value: user?.profileViews ?? 0,
      icon: Eye,
      change: '+12%',
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
    },
    {
      label: 'Total Bookings',
      value: user?.rating?.totalBookings ?? 0,
      icon: CalendarCheck,
      change: '+8%',
      gradient: 'from-indigo-500 to-indigo-600',
      bgLight: 'bg-indigo-50',
    },
    {
      label: 'Reviews',
      value: user?.rating?.totalReviews ?? 0,
      icon: Star,
      change: '+5%',
      gradient: 'from-amber-500 to-amber-600',
      bgLight: 'bg-amber-50',
    },
    {
      label: 'Avg. Rating',
      value: user?.rating?.average?.toFixed(1) ?? '—',
      icon: TrendingUp,
      change: '+0.2',
      gradient: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
    },
  ];

  const score = user?.profileCompletionPercent ?? 0;
  const level = score >= 80 ? 'Pro' : score >= 50 ? 'Intermediate' : 'Beginner';
  const levelColor = score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-blue-600' : 'text-amber-600';
  const levelBg = score >= 80 ? 'bg-emerald-50' : score >= 50 ? 'bg-blue-50' : 'bg-amber-50';

  const quickLinks = [
    { label: 'Edit Profile', path: '/creator/profile', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Upload Portfolio', path: '/creator/portfolio', icon: Camera, color: 'from-indigo-500 to-indigo-600' },
    { label: 'Set Pricing', path: '/creator/packages', icon: DollarSign, color: 'from-amber-500 to-amber-600' },
    { label: 'View Reviews', path: '/creator/reviews', icon: Star, color: 'from-emerald-500 to-emerald-600' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Hero Welcome */}
      <motion.div variants={item} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`rounded-full ${levelBg} ${levelColor} px-3 py-0.5 text-xs font-semibold`}>
                {level}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium backdrop-blur-sm">
                {score}% complete
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">
              Hey, {user?.firstName || 'Creator'}! 👋
            </h1>
            <p className="mt-2 text-blue-100/80 max-w-lg">
              Here's your creative snapshot — keep capturing those extraordinary moments.
            </p>
          </div>
          <div className="hidden sm:flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <Camera className="h-10 w-10" />
          </div>
        </div>
        {score < 100 && (
          <div className="relative z-10 mt-6 max-w-md">
            <div className="flex items-center justify-between mb-1.5 text-sm">
              <span className="text-blue-100">Profile strength</span>
              <span className="font-semibold">{score}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full rounded-full bg-white"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bgLight}`}>
                <stat.icon className={`h-5 w-5 ${stat.bgLight.replace('bg-', 'text-')}`} />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                {stat.change}
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.gradient} scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
          </div>
        ))}
      </motion.div>

      {/* Two Column */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left - Activity/Goals */}
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          {/* Quick Action Cards */}
          <div className="grid grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${link.color} text-white shadow-sm mb-3`}>
                  <link.icon className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-semibold text-slate-800">{link.label}</h4>
                <p className="text-xs text-slate-400 mt-0.5">Get started now</p>
                <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </Link>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
              <Clock className="h-4 w-4 text-slate-400" />
            </div>
            <div className="space-y-3">
              {[
                { label: 'Profile updated', time: '2 hours ago', color: 'bg-blue-500' },
                { label: 'New booking received', time: '1 day ago', color: 'bg-indigo-500' },
                { label: 'Portfolio image uploaded', time: '3 days ago', color: 'bg-amber-500' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={`h-2 w-2 rounded-full ${activity.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">{activity.label}</p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right - Profile Stats */}
        <motion.div variants={item} className="space-y-6">
          {/* Profile Score */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Profile Score</h3>
                <p className="text-xs text-slate-400">Complete to get discovered</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Profile Photo', done: !!user?.avatar?.url },
                { label: 'About Section', done: !!user?.about },
                { label: 'Specializations', done: (user?.specializations?.length ?? 0) > 0 },
                { label: 'Pricing Set', done: (user?.startingPrice ?? 0) > 0 },
                { label: 'Portfolio Images', done: (user?.portfolioImages?.length ?? 0) > 0 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      item.done ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'
                    }`}
                  >
                    {item.done ? '✓' : '!'}
                  </div>
                  <span className={`text-sm ${item.done ? 'text-slate-600' : 'text-slate-400'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <Link
              to="/creator/profile"
              className="mt-4 block w-full rounded-xl bg-blue-50 py-2.5 text-center text-sm font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
            >
              Complete Profile
            </Link>
          </div>

          {/* Quick Achievement */}
          <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                <Award className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Creator Level</h3>
                <p className="text-xs text-slate-400">Your photography journey</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${levelColor}`}>{level}</span>
              <span className="text-xs text-slate-400">• {score}% complete</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}