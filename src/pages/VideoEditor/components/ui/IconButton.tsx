import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  icon?: ReactNode;
  label?: string;
  compact?: boolean;
  badge?: string;
};

export function IconButton({
  active,
  icon,
  label,
  compact,
  badge,
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={cn(
        'relative inline-flex items-center justify-center gap-1.5 rounded-[var(--ve-radius-sm)] text-[11px] font-semibold transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ve-primary)]/40',
        'disabled:pointer-events-none disabled:opacity-35',
        compact ? 'h-8 w-8' : 'h-8 px-2.5',
        active
          ? 'bg-[var(--ve-primary-soft)] text-[var(--ve-primary)] shadow-sm'
          : 'text-[var(--ve-ink-soft)] hover:bg-[var(--ve-elevated)] hover:text-[var(--ve-ink)]',
        className,
      )}
      {...rest}
    >
      {icon}
      {label ? <span className="hidden xl:inline">{label}</span> : null}
      {children}
      {badge ? (
        <span className="ve-badge-new absolute -right-1 -top-1">{badge}</span>
      ) : null}
    </button>
  );
}
