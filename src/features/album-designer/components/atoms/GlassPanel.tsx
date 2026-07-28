import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export function GlassPanel({ children, className }: Props) {
  return (
    <div
      className={cn(
        'ad-glass rounded-[var(--ad-radius)] border border-[var(--ad-border)] bg-white/80',
        className,
      )}
    >
      {children}
    </div>
  );
}
