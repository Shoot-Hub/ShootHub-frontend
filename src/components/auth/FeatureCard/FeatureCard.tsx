import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  variant?: 'light' | 'dark';
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
  variant = 'light',
}: FeatureCardProps) {
  const isDark = variant === 'dark';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-2xl p-3.5 backdrop-blur-md',
        isDark
          ? 'border border-white/15 bg-white/[0.08] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.45)]'
          : 'border border-white/80 bg-white/75 shadow-auth-glass',
        className,
      )}
    >
      <Icon
        className={cn('h-5 w-5', isDark ? 'text-auth-primary' : 'text-auth-primary')}
        strokeWidth={2}
      />
      <p className={cn('mt-2.5 text-xs font-semibold', isDark ? 'text-white' : 'text-ink')}>
        {title}
      </p>
      <p
        className={cn(
          'mt-1 text-[11px] leading-snug',
          isDark ? 'text-white/65' : 'text-ink-muted',
        )}
      >
        {description}
      </p>
    </motion.div>
  );
}
