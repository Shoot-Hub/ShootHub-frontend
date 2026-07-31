import * as Dialog from '@radix-ui/react-dialog';
import { Check, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePhotoEditorStore } from '../store';
import '../styles/batch.css';

export function BatchProgressDialog() {
  const progress = usePhotoEditorStore((s) => s.batchProgress);
  const cancelBatchApply = usePhotoEditorStore((s) => s.cancelBatchApply);
  const dismissBatchProgress = usePhotoEditorStore((s) => s.dismissBatchProgress);

  const open = Boolean(progress?.open);
  const pct =
    progress && progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0;
  const done = progress?.phase === 'done';
  const cancelled = progress?.phase === 'cancelled';
  const running = progress?.phase === 'running';

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next && !running) dismissBatchProgress();
      }}
    >
      <Dialog.Portal>
        <AnimatePresence>
          {open && progress ? (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  className="pe-batch-progress-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  className="photo-editor-root pe-batch-progress fixed left-1/2 top-1/2 z-[61] -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="pe-batch-progress__head">
                    <div
                      className="pe-batch-progress__spinner"
                      data-done={done || cancelled}
                      aria-hidden
                    >
                      {done || cancelled ? <Check className="h-5 w-5" strokeWidth={3} /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Dialog.Title className="pe-batch-progress__title">
                        {done
                          ? 'Batch complete'
                          : cancelled
                            ? 'Batch cancelled'
                            : 'Batch editing'}
                      </Dialog.Title>
                      <Dialog.Description className="pe-batch-progress__sub">
                        {progress.label}
                      </Dialog.Description>
                    </div>
                    {!running ? (
                      <button
                        type="button"
                        className="rounded-[10px] p-1.5 text-[var(--pe-ink-muted)] hover:bg-[var(--pe-elevated)]"
                        aria-label="Close"
                        onClick={dismissBatchProgress}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>

                  <div
                    className="pe-batch-progress__bar"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={progress.total}
                    aria-valuenow={progress.current}
                  >
                    <div
                      className="pe-batch-progress__fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="pe-batch-progress__meta">
                    <span>
                      {progress.current} / {progress.total}
                    </span>
                    <span>{pct}%</span>
                  </div>

                  <div className="pe-batch-progress__footer">
                    {running ? (
                      <button
                        type="button"
                        className="pe-batch-progress__btn"
                        onClick={cancelBatchApply}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="pe-batch-progress__btn"
                        data-primary="true"
                        onClick={dismissBatchProgress}
                      >
                        Done
                      </button>
                    )}
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          ) : null}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
