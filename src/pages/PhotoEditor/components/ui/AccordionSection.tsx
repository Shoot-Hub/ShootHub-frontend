import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  id: string;
  title: string;
  icon?: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export function AccordionSection({ id, title, icon, open, onToggle, children }: Props) {
  return (
    <div className="border-b border-[var(--pe-border)] last:border-b-0">
      <button
        type="button"
        id={`accordion-${id}`}
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-center gap-2.5 px-1 py-3 text-left transition-colors hover:text-[var(--pe-primary)]"
      >
        {icon ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[var(--pe-primary-soft)] text-[var(--pe-primary)]">
            {icon}
          </span>
        ) : null}
        <span className="flex-1 text-[13px] font-bold text-[var(--pe-ink)]">{title}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-[var(--pe-ink-muted)] transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pb-4 pt-0.5">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
