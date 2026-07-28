import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type Props = {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
};

export function SidebarRailButton({ icon: Icon, label, active, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={cn(
        'flex w-full flex-col items-center gap-0.5 rounded-[14px] px-1 py-2 text-[9px] font-semibold transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ad-primary)]/40',
        active
          ? 'bg-[var(--ad-primary-soft)] text-[var(--ad-primary)] shadow-sm'
          : 'text-[var(--ad-ink-muted)] hover:bg-[#F5F6F8] hover:text-[var(--ad-ink)]',
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={active ? 2.25 : 1.75} />
      <span className="max-w-full truncate px-0.5">{label}</span>
    </button>
  );
}
