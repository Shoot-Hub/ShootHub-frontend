import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useHistoryStore, useUiStore } from '../../store';
import { cn } from '@/lib/utils';

export function HistoryDialog() {
  const open = useUiStore((s) => s.historyOpen);
  const setHistoryOpen = useUiStore((s) => s.setHistoryOpen);
  const history = useHistoryStore((s) => s.history);
  const historyIndex = useHistoryStore((s) => s.historyIndex);

  return (
    <Dialog.Root open={open} onOpenChange={setHistoryOpen}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                className="video-editor-root fixed right-4 top-16 z-50 flex h-[min(70vh,520px)] w-[min(92vw,320px)] flex-col rounded-[var(--ve-radius)] border border-[var(--ve-border-strong)] bg-[var(--ve-surface)] shadow-[var(--ve-shadow-float)] focus:outline-none"
              >
                <div className="flex items-center justify-between border-b border-[var(--ve-border)] px-4 py-3">
                  <Dialog.Title className="text-[14px] font-bold text-[var(--ve-ink)]">
                    History
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="rounded-[8px] p-1 text-[var(--ve-ink-muted)] hover:bg-[var(--ve-elevated)]"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>
                <div className="ve-scrollbar flex-1 overflow-y-auto p-2">
                  {[...history].reverse().map((entry, revIdx) => {
                    const idx = history.length - 1 - revIdx;
                    const active = idx === historyIndex;
                    return (
                      <div
                        key={entry.id}
                        className={cn(
                          'rounded-[12px] px-3 py-2.5',
                          active
                            ? 'bg-[var(--ve-primary-soft)]'
                            : 'hover:bg-[var(--ve-elevated)]',
                        )}
                      >
                        <p className="text-[12px] font-semibold text-[var(--ve-ink)]">
                          {entry.label}
                        </p>
                        <p className="text-[10px] text-[var(--ve-ink-muted)]">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
