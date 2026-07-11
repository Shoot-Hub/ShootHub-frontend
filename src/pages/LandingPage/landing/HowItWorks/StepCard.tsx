import type { LucideIcon } from 'lucide-react';

export type StepCardProps = {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export function StepCard({ step, title, description, icon: Icon }: StepCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-primary-500 to-primary-600 text-sm font-extrabold text-white shadow-[0_0_24px_rgba(99,102,241,0.35)]">
        {step}
      </div>

      <article className="mt-6 flex w-full flex-col items-center rounded-2xl border border-border/50 bg-white px-5 py-7 text-center shadow-card">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
          <Icon className="h-6 w-6 text-primary-500" strokeWidth={2} />
        </div>

        <h3 className="mt-5 text-lg font-extrabold text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{description}</p>
      </article>
    </div>
  );
}
