import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createFloatAnimation } from '@/lib/motion';

export type StatsCardProps = {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  avatars?: ReactNode;
  className?: string;
  floatDelay?: number;
};

export function StatsCard({
  icon: Icon,
  title,
  subtitle,
  avatars,
  className,
  floatDelay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      animate={createFloatAnimation({ delay: floatDelay, duration: 3.8, distance: 11 })}
      className={cn(
        'flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-card-lg',
        className,
      )}
    >
      {avatars ? (
        avatars
      ) : Icon ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
          <Icon className="h-5 w-5 text-primary-500" strokeWidth={2} />
        </div>
      ) : null}
      <div className="flex flex-col leading-snug">
        <span className="text-sm font-bold text-ink">{title}</span>
        {subtitle && <span className="text-xs font-medium text-ink-muted">{subtitle}</span>}
      </div>
    </motion.div>
  );
}
