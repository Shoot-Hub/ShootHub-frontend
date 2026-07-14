import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { AuthCardProps } from '@/types/auth';

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footer,
  compact = false,
}: AuthCardProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="flex w-full min-w-0 flex-col"
    >
      <div className="shrink-0">
        {eyebrow && (
          <p className="text-sm font-semibold text-auth-accent">{eyebrow}</p>
        )}
        <h2
          className={cn(
            'font-bold tracking-tight text-ink',
            compact ? 'text-xl' : 'text-[1.65rem]',
            eyebrow && 'mt-0.5',
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              'leading-relaxed text-ink-muted',
              compact ? 'mt-1 text-xs' : 'mt-2 text-sm',
            )}
          >
            {description}
          </p>
        )}
      </div>
      <div
        className={cn(
          'flex w-full min-w-0 flex-col',
          compact ? 'mt-4 gap-3' : 'mt-7 gap-[18px]',
        )}
      >
        {children}
      </div>
      {footer && <div className={cn('shrink-0', compact ? 'mt-4' : 'mt-6')}>{footer}</div>}
    </motion.div>
  );
}
