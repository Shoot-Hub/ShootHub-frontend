import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cardHover } from '@/lib/motion';
import { cn } from '@/lib/utils';
import {
  featureLabels,
  formatPlanPrice,
  type BillingPeriod,
  type Plan,
  type PlanFeatureKey,
} from './data';

const highlightKeys: PlanFeatureKey[] = [
  'storage',
  'bookings',
  'aiFaceSearch',
  'gallery',
  'analytics',
  'teamMembers',
  'prioritySupport',
  'customDomain',
];

type PlanCardProps = {
  plan: Plan;
  period: BillingPeriod;
};

function FeatureValue({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="h-4 w-4 text-primary-500" strokeWidth={2.5} />
    ) : (
      <X className="h-4 w-4 text-ink-light" strokeWidth={2} />
    );
  }
  return <span className="text-sm font-semibold text-ink">{value}</span>;
}

export function PlanCard({ plan, period }: PlanCardProps) {
  const price = period === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const showFounder =
    period === 'yearly' && plan.founderDiscount && plan.monthlyPrice > 0;

  return (
    <motion.article
      whileHover={cardHover}
      className={cn(
        'relative flex h-full flex-col rounded-[24px] border bg-white p-6 shadow-card sm:p-7',
        plan.highlighted
          ? 'border-primary-200 shadow-card-lg ring-2 ring-primary-500'
          : 'border-border/50',
      )}
    >
      {plan.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-500 px-4 py-1 text-xs font-semibold text-white shadow-button">
          Most Popular
        </span>
      )}

      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-extrabold text-ink">{plan.name}</h3>
          <p className="mt-1 text-sm text-ink-muted">{plan.description}</p>
        </div>
        {showFounder && (
          <span className="shrink-0 rounded-full bg-primary-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-600">
            Founder
          </span>
        )}
      </div>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold text-ink">{formatPlanPrice(price)}</span>
        {price >= 0 && <span className="text-sm text-ink-muted">/month</span>}
      </div>
      {period === 'yearly' && price > 0 && (
        <p className="mt-1 text-xs text-ink-muted">Billed annually</p>
      )}

      <ul className="mt-6 flex-1 space-y-3">
        {highlightKeys.map((key) => (
          <li key={key} className="flex items-center justify-between gap-3 text-sm text-ink-muted">
            <span>{featureLabels[key]}</span>
            <FeatureValue value={plan.features[key]} />
          </li>
        ))}
      </ul>

      <Link to={plan.id === 'enterprise' ? '/signup' : '/signup'} className="mt-8">
        <Button
          fullWidth
          variant={plan.highlighted ? 'primary' : 'secondary'}
          pill
        >
          {plan.cta}
        </Button>
      </Link>
    </motion.article>
  );
}
