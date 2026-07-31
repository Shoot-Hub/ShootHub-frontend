import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type MobileBottomSheetProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Tailwind visibility class — default phone-only */
  visibilityClassName?: string;
  heightClassName?: string;
};

export function MobileBottomSheet({
  open,
  title,
  onClose,
  children,
  visibilityClassName = 'md:hidden',
  heightClassName = 'h-[min(72dvh,560px)]',
}: MobileBottomSheetProps) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className={cn(
              'fixed inset-0 z-[80] border-0 bg-black/55 backdrop-blur-[2px]',
              visibilityClassName,
            )}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            aria-label={title}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={cn(
              'fixed inset-x-0 bottom-0 z-[90] flex flex-col overflow-hidden rounded-t-[20px] border border-[var(--ve-border-strong)] border-b-0 bg-[var(--ve-surface)] shadow-[var(--ve-shadow-float)]',
              'pb-[env(safe-area-inset-bottom,0px)]',
              heightClassName,
              visibilityClassName,
            )}
          >
            <div className="relative flex shrink-0 items-center gap-2 border-b border-[var(--ve-border)] px-3 pb-2.5 pt-3.5">
              <div className="absolute left-1/2 top-1.5 h-1 w-10 -translate-x-1/2 rounded-full bg-white/20" />
              <h2 className="min-w-0 flex-1 truncate text-[13px] font-bold text-[var(--ve-ink)]">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-[var(--ve-ink-muted)] transition-colors hover:bg-[var(--ve-elevated)] hover:text-[var(--ve-ink)]"
                aria-label={`Close ${title}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="ve-scrollbar min-h-0 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
