import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  action?: ReactNode;
  className?: string;
};

export function PanelSectionHeader({ title, action, className }: Props) {
  return (
    <div className={cn('mb-3 flex items-center justify-between gap-2', className)}>
      <h3 className="text-[13px] font-bold tracking-tight text-[var(--ad-ink)]">{title}</h3>
      {action}
    </div>
  );
}
