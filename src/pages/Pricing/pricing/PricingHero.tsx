import { motion } from 'framer-motion';
import { Sparkles, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { BillingPeriod } from './data';

type PricingHeroProps = {
  period: BillingPeriod;
  onPeriodChange: (period: BillingPeriod) => void;
};

export function PricingHero({ period, onPeriodChange }: PricingHeroProps) {
  return (
    <section className="relative overflow-hidden pb-2 pt-10 md:pt-14 lg:pt-16" aria-label="Pricing hero">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[12%] top-[15%] h-[200px] w-[200px] rounded-full bg-primary-100/70 blur-3xl" />
        <div className="absolute bottom-[5%] right-[10%] h-[180px] w-[180px] rounded-full bg-purple-100/40 blur-3xl" />
      </div>

      <Container size="wide" padding="tight">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeInUp} className="flex justify-center">
            <Badge icon={<Sparkles className="h-3.5 w-3.5 fill-primary-500 text-primary-500" />}>
              Transparent Pricing
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="mt-5 text-[40px] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-[52px] md:text-[60px]"
          >
            Simple Transparent{' '}
            <span className="text-primary-500">Pricing</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-4 max-w-xl text-[15px] leading-[1.7] text-ink-muted md:text-base"
          >
            Choose the perfect plan for your photography business.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8 flex flex-col items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-border/60 bg-white p-1 shadow-card">
              {(['monthly', 'yearly'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onPeriodChange(option)}
                  className={cn(
                    'rounded-full px-6 py-2.5 text-sm font-bold capitalize transition-all',
                    period === option
                      ? 'bg-primary-500 text-white shadow-button'
                      : 'text-ink-muted hover:text-ink',
                  )}
                >
                  {option}
                </button>
              ))}
            </div>

            {period === 'yearly' && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-bold text-primary-600">
                <Tag className="h-3.5 w-3.5" strokeWidth={2.5} />
                Founder Discount — save up to 20%
              </span>
            )}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
