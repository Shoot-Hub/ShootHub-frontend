import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
};

export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-2xl border border-white/80 bg-white/75 p-3.5 shadow-auth-glass backdrop-blur-md',
        className,
      )}
    >
      <Icon className="h-5 w-5 text-auth-primary" strokeWidth={2} />
      <p className="mt-2.5 text-xs font-semibold text-ink">{title}</p>
      <p className="mt-1 text-[11px] leading-snug text-ink-muted">{description}</p>
    </motion.div>
  );
}
