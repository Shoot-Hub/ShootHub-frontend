import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, action, className }: Props) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center rounded-[var(--pe-radius)] border border-dashed border-[var(--pe-border-strong)] bg-[var(--pe-surface-2)] px-4 py-10 text-center',
        className,
      )}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--pe-primary-soft)] text-[var(--pe-primary)]">
        {icon}
      </div>
      <p className="text-sm font-bold text-[var(--pe-ink)]">{title}</p>
      {description ? (
        <p className="mt-1 max-w-[220px] text-xs text-[var(--pe-ink-muted)]">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
