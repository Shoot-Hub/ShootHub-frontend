import { motion } from 'framer-motion';
import { Film, Globe, Eye, Heart } from 'lucide-react';
import type { Reel } from '@/services/creator';

type Props = {
  total: number;
  reels: Reel[];
};

const STATS = (total: number, reels: Reel[]) => [
  {
    label: 'Total Reels',
    value: total,
    icon: Film,
    gradient: 'from-blue-500 via-blue-600 to-indigo-600',
    glow: 'shadow-blue-500/20',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Published',
    value: reels.filter((r) => r.isPublished).length,
    icon: Globe,
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    glow: 'shadow-emerald-500/20',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    label: 'Total Views',
    value: reels.reduce((sum, r) => sum + r.views, 0),
    icon: Eye,
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
    glow: 'shadow-violet-500/20',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    label: 'Total Likes',
    value: reels.reduce((sum, r) => sum + r.likesCount, 0),
    icon: Heart,
    gradient: 'from-rose-500 via-pink-500 to-red-500',
    glow: 'shadow-rose-500/20',
    bg: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
];

export function ReelsStatsBar({ total, reels }: Props) {
  const stats = STATS(total, reels);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' }}
          className={`relative rounded-2xl border border-slate-100 bg-white p-5 shadow-md ${stat.glow} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden`}
        >
          {/* Decorative blob */}
          <div
            className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 blur-xl`}
          />
          <div className="relative flex flex-col gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 leading-none">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
