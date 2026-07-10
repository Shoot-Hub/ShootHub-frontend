import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  icon?: ReactNode;
};

export function Badge({ icon, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50 px-4 py-1.5',
        'text-[13px] font-semibold text-primary-600',
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0 text-primary-500">{icon}</span>}
      {children}
    </span>
  );
}
