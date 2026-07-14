import { cn } from '@/lib/utils';

export type DividerProps = {
  label?: string;
  className?: string;
};

export function Divider({ label = 'or', className }: DividerProps) {
  return (
    <div className={cn('relative flex items-center', className)} role="separator">
      <div className="h-px flex-1 bg-border" />
      {label && <span className="px-4 text-sm text-ink-light">{label}</span>}
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
