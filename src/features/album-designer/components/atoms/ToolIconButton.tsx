import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  icon?: ReactNode;
  label?: string;
  compact?: boolean;
};

export function ToolIconButton({
  active,
  icon,
  label,
  compact,
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-[12px] text-[11px] font-semibold transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ad-primary)]/40',
        'disabled:pointer-events-none disabled:opacity-35',
        compact ? 'h-8 w-8' : 'h-8 px-2.5',
        active
          ? 'bg-[var(--ad-primary-soft)] text-[var(--ad-primary)] shadow-sm'
          : 'text-[var(--ad-ink-soft)] hover:bg-[#F5F6F8] hover:text-[var(--ad-ink)]',
        className,
      )}
      {...rest}
    >
      {icon}
      {label ? <span className="hidden xl:inline">{label}</span> : null}
      {children}
    </button>
  );
}
