import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type TabItem<T extends string> = {
  id: T;
  label: string;
};

type Props<T extends string> = {
  tabs: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  size?: 'sm' | 'md';
  className?: string;
};

export function TabBar<T extends string>({
  tabs,
  value,
  onChange,
  size = 'sm',
  className,
}: Props<T>) {
  return (
    <div
      className={cn(
        'relative flex gap-0.5 rounded-[var(--ve-radius-sm)] bg-[var(--ve-card)] p-0.5',
        className,
      )}
    >
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative z-10 flex-1 rounded-[8px] font-semibold transition-colors',
              size === 'sm' ? 'px-2 py-1.5 text-[11px]' : 'px-3 py-2 text-[12px]',
              active ? 'text-[var(--ve-ink)]' : 'text-[var(--ve-ink-muted)] hover:text-[var(--ve-ink-soft)]',
            )}
          >
            {active ? (
              <motion.span
                layoutId="ve-tab-pill"
                className="absolute inset-0 rounded-[8px] bg-[var(--ve-elevated)] shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            ) : null}
            <span className="relative">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
