import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  badge?: string;
  disabled?: boolean;
};

export function ToggleSwitch({ checked, onChange, label, badge, disabled }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex w-full items-center justify-between gap-3 rounded-[var(--ve-radius-sm)] px-1 py-2 text-left transition-colors',
        'hover:bg-[var(--ve-elevated)]/50 disabled:opacity-40',
      )}
    >
      <span className="flex items-center gap-2 text-[12px] font-semibold text-[var(--ve-ink-soft)]">
        {label}
        {badge ? <span className="ve-badge-new">{badge}</span> : null}
      </span>
      <span
        className={cn(
          'relative h-5 w-9 shrink-0 rounded-full transition-colors',
          checked ? 'bg-[var(--ve-primary)]' : 'bg-[var(--ve-track)]',
        )}
      >
        <motion.span
          layout
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow"
          animate={{ left: checked ? 18 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </span>
    </button>
  );
}
