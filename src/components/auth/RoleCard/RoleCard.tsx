import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type RoleCardProps = {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  onSelect: () => void;
  name?: string;
};

export function RoleCard({
  label,
  description,
  icon: Icon,
  selected,
  onSelect,
  name = 'role',
  value,
}: RoleCardProps) {
  return (
    <motion.label
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        'relative flex cursor-pointer flex-col rounded-2xl border p-3.5 transition-all duration-200',
        selected
          ? 'border-auth-accent bg-auth-accent/[0.04] shadow-sm'
          : 'border-border bg-white hover:border-gray-300',
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
        aria-label={label}
      />

      <span
        className={cn(
          'mb-3 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 transition-colors',
          selected ? 'border-auth-accent' : 'border-gray-300',
        )}
        aria-hidden="true"
      >
        {selected && <span className="h-2 w-2 rounded-full bg-auth-accent" />}
      </span>

      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
            selected ? 'bg-auth-accent/10' : 'bg-gray-100',
          )}
        >
          <Icon
            className={cn('h-5 w-5', selected ? 'text-auth-accent' : 'text-ink-muted')}
            strokeWidth={2}
          />
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="text-sm font-semibold leading-tight text-ink">{label}</p>
          <p className="mt-1 text-xs leading-snug text-ink-muted">{description}</p>
        </div>
      </div>
    </motion.label>
  );
}
