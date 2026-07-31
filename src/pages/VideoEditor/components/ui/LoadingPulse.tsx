import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type Props = {
  className?: string;
  label?: string;
};

export function LoadingPulse({ className, label = 'Processing' }: Props) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className="relative h-12 w-12">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-[var(--ve-primary)]/30"
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.15, 0.6] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="absolute inset-2 rounded-full border-2 border-t-[var(--ve-accent)] border-r-transparent border-b-transparent border-l-[var(--ve-primary)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-[var(--ve-primary)] shadow-[0_0_12px_var(--ve-primary-glow)]" />
        </span>
      </div>
      <p className="text-[11px] font-semibold tracking-wide text-[var(--ve-ink-soft)]">{label}</p>
    </div>
  );
}
