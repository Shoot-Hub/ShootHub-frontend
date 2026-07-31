import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  action?: ReactNode;
};

export function PanelSection({
  title,
  children,
  defaultOpen = true,
  className,
  action,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn('border-b border-[var(--ve-border)] pb-3', className)}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center gap-1.5 py-2 text-left"
        >
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 text-[var(--ve-ink-muted)] transition-transform',
              open ? 'rotate-0' : '-rotate-90',
            )}
          />
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--ve-ink-soft)]">
            {title}
          </span>
        </button>
        {action}
      </div>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pt-1">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
