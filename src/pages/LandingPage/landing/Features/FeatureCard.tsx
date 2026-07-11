import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FeatureCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

export function FeatureCard({
  title,
  description,
  icon: Icon,
  iconBg,
  iconColor,
}: FeatureCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border/60 bg-white p-6 shadow-card transition-shadow hover:shadow-card-lg">
      <div
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-xl',
          iconBg,
        )}
      >
        <Icon className={cn('h-5 w-5', iconColor)} strokeWidth={2} />
      </div>

      <h3 className="mt-5 text-lg font-extrabold text-ink">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{description}</p>

      <button
        type="button"
        className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600"
      >
        Learn more
        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </article>
  );
}
