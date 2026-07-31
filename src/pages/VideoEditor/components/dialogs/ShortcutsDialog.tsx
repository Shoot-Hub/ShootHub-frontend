import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useUiStore } from '../../store';

const SHORTCUTS = [
  { keys: 'Space', action: 'Play / Pause' },
  { keys: 'Home', action: 'Stop' },
  { keys: '← / →', action: 'Step frame' },
  { keys: 'S', action: 'Split clip' },
  { keys: 'Delete', action: 'Delete clip' },
  { keys: '⌘ C', action: 'Copy' },
  { keys: '⌘ X', action: 'Cut' },
  { keys: '⌘ V', action: 'Paste' },
  { keys: '⌘ D', action: 'Duplicate' },
  { keys: 'N', action: 'Toggle snap' },
  { keys: '⌘ Z', action: 'Undo' },
  { keys: '⌘ ⇧ Z', action: 'Redo' },
  { keys: '⌘ E', action: 'Export' },
  { keys: '⌘ /', action: 'Shortcuts' },
];

export function ShortcutsDialog() {
  const open = useUiStore((s) => s.shortcutsOpen);
  const setShortcutsOpen = useUiStore((s) => s.setShortcutsOpen);

  return (
    <Dialog.Root open={open} onOpenChange={setShortcutsOpen}>
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
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="video-editor-root fixed left-1/2 top-1/2 z-50 w-[min(92vw,400px)] -translate-x-1/2 -translate-y-1/2 rounded-[var(--ve-radius)] border border-[var(--ve-border-strong)] bg-[var(--ve-surface)] p-5 shadow-[var(--ve-shadow-float)] focus:outline-none"
              >
                <div className="mb-4 flex items-center justify-between">
                  <Dialog.Title className="text-[15px] font-bold text-[var(--ve-ink)]">
                    Keyboard Shortcuts
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
                <div className="space-y-1.5">
                  {SHORTCUTS.map((row) => (
                    <div
                      key={row.keys}
                      className="flex items-center justify-between rounded-[12px] bg-[var(--ve-card)] px-3 py-2.5"
                    >
                      <span className="text-[12px] font-semibold text-[var(--ve-ink-soft)]">
                        {row.action}
                      </span>
                      <kbd className="rounded-[8px] border border-[var(--ve-border-strong)] bg-[var(--ve-elevated)] px-2 py-1 text-[11px] font-bold text-[var(--ve-ink)]">
                        {row.keys}
                      </kbd>
                    </div>
                  ))}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
