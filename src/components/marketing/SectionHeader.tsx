import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

type SectionHeaderProps = {
  eyebrow?: string;
  eyebrowIcon?: ReactNode;
  title: ReactNode;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
};

export function SectionHeader({
  eyebrow,
  eyebrowIcon,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className={cn(align === 'center' && 'text-center', className)}
    >
      {eyebrow && (
        <motion.div
          variants={fadeInUp}
          className={cn('flex', align === 'center' ? 'justify-center' : 'justify-start')}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-primary-600">
            {eyebrowIcon}
            {eyebrow}
          </span>
        </motion.div>
      )}

      <motion.h2
        variants={fadeInUp}
        className={cn(
          'text-[36px] font-extrabold leading-tight tracking-tight text-ink sm:text-[44px] md:text-[52px]',
          eyebrow && 'mt-4',
        )}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          variants={fadeInUp}
          className={cn(
            'mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-muted md:text-base',
            align === 'center' && 'mx-auto',
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
