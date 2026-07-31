import { useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Slider from '@radix-ui/react-slider';
import {
  X,
  Download,
  Images,
  Check,
  Loader2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { usePhotoEditorStore } from '../store';
import type { ExportFormat, PhotoItem } from '../types';
import { exportEditedBlob } from '../engine';
import {
  buildExportFilename,
  downloadBlob,
  exportMime,
  wait,
} from '../utils';
import '../styles/export.css';

const FORMATS: { id: ExportFormat; label: string; hint: string }[] = [
  { id: 'jpg', label: 'JPG', hint: 'Best for photos' },
  { id: 'png', label: 'PNG', hint: 'Lossless quality' },
  { id: 'webp', label: 'WEBP', hint: 'Smaller files' },
];

type Phase = 'setup' | 'progress' | 'success';
type ExportScope = 'selected' | 'all';

type SuccessState = {
  count: number;
  format: ExportFormat;
  scope: ExportScope;
  bytes: number;
};

function resetExportUi(
  setPhase: (p: Phase) => void,
  setProgress: (p: { current: number; total: number; label: string }) => void,
  setSuccess: (s: SuccessState | null) => void,
  cancelRef: { current: boolean },
) {
  cancelRef.current = true;
  setPhase('setup');
  setProgress({ current: 0, total: 0, label: '' });
  setSuccess(null);
}

export function ExportDialog() {
  const open = usePhotoEditorStore((s) => s.exportOpen);
  const setExportOpen = usePhotoEditorStore((s) => s.setExportOpen);
  const settings = usePhotoEditorStore((s) => s.exportSettings);
  const setExportSettings = usePhotoEditorStore((s) => s.setExportSettings);
  const photos = usePhotoEditorStore((s) => s.photos);
  const selectedIds = usePhotoEditorStore((s) => s.selectedIds);
  const activePhotoId = usePhotoEditorStore((s) => s.activePhotoId);

  const [phase, setPhase] = useState<Phase>('setup');
  const [progress, setProgress] = useState({ current: 0, total: 0, label: '' });
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const cancelRef = useRef(false);

  const selectedPhotos = useMemo(() => {
    if (selectedIds.length) {
      return photos.filter((p) => selectedIds.includes(p.id));
    }
    const active = photos.find((p) => p.id === activePhotoId);
    return active ? [active] : [];
  }, [photos, selectedIds, activePhotoId]);

  const previewName = useMemo(() => {
    const sample = selectedPhotos[0] ?? photos[0];
    if (!sample) return `photo.${settings.format}`;
    return buildExportFilename(sample, settings, 0, Math.max(selectedPhotos.length, 1));
  }, [selectedPhotos, photos, settings]);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      if (phase === 'progress') return;
      resetExportUi(setPhase, setProgress, setSuccess, cancelRef);
    } else {
      cancelRef.current = false;
    }
    setExportOpen(next);
  };
  const runExport = async (scope: ExportScope) => {
    const targets: PhotoItem[] =
      scope === 'all'
        ? [...photos]
        : selectedPhotos.length
          ? selectedPhotos
          : photos.filter((p) => p.id === activePhotoId);

    if (!targets.length) {
      toast.error('No photos to export');
      return;
    }

    cancelRef.current = false;
    setPhase('progress');
    setProgress({
      current: 0,
      total: targets.length,
      label: `Preparing ${targets.length} photo${targets.length === 1 ? '' : 's'}…`,
    });

    const mime = exportMime(settings.format);
    const maxEdge = settings.resizeEnabled ? settings.resizeWidth : 4000;
    const quality = settings.format === 'png' ? 1 : settings.quality / 100;
    let exported = 0;
    let totalBytes = 0;

    try {
      for (let i = 0; i < targets.length; i++) {
        if (cancelRef.current) break;
        const photo = targets[i]!;
        setProgress({
          current: i,
          total: targets.length,
          label: `Rendering ${photo.name}…`,
        });

        const blob = await exportEditedBlob(photo.src, photo.adjustments, photo.transform, {
          format: mime,
          quality,
          maxEdge,
          watermark: settings.watermark,
          watermarkText: settings.watermarkText,
        });

        if (cancelRef.current) break;

        const filename = buildExportFilename(photo, settings, i, targets.length);
        downloadBlob(blob, filename);
        totalBytes += blob.size;
        exported += 1;

        setProgress({
          current: i + 1,
          total: targets.length,
          label: `Downloaded ${filename}`,
        });

        // Stagger downloads so browsers don't block successive saves
        if (i < targets.length - 1) await wait(280);
      }

      if (cancelRef.current) {
        setPhase('setup');
        toast('Export cancelled');
        return;
      }

      setSuccess({
        count: exported,
        format: settings.format,
        scope,
        bytes: totalBytes,
      });
      setPhase('success');
    } catch {
      toast.error('Export failed');
      setPhase('setup');
    }
  };

  const formatBytes = (n: number) => {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="photo-editor-root fixed left-1/2 top-1/2 z-50 w-[min(92vw,460px)] -translate-x-1/2 -translate-y-1/2 rounded-[var(--pe-radius)] border border-[var(--pe-border-strong)] bg-[var(--pe-surface)] p-5 shadow-[var(--pe-shadow-float)] focus:outline-none sm:p-6"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <Dialog.Title className="text-lg font-bold text-[var(--pe-ink)]">
                  {phase === 'success'
                    ? 'Export complete'
                    : phase === 'progress'
                      ? 'Exporting…'
                      : 'Export Photos'}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-xs text-[var(--pe-ink-muted)]">
                  {phase === 'setup'
                    ? `${selectedPhotos.length || 1} selected · ${photos.length} total`
                    : phase === 'progress'
                      ? progress.label
                      : 'Files downloaded to your device'}
                </Dialog.Description>
              </div>
              {phase !== 'progress' ? (
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="rounded-[10px] p-1.5 text-[var(--pe-ink-muted)] hover:bg-[var(--pe-elevated)]"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              ) : null}
            </div>

            <AnimatePresence mode="wait">
              {phase === 'setup' ? (
                <motion.div
                  key="setup"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="pe-export"
                >
                  <div className="pe-export__scroll pe-scrollbar">
                    <div>
                      <p className="pe-export__section-title">Format</p>
                      <div className="pe-export__formats">
                        {FORMATS.map((fmt) => (
                          <button
                            key={fmt.id}
                            type="button"
                            className="pe-export__format"
                            data-active={settings.format === fmt.id}
                            onClick={() => setExportSettings({ format: fmt.id })}
                          >
                            <span className="pe-export__format-label">{fmt.label}</span>
                            <span className="pe-export__format-hint">{fmt.hint}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {settings.format !== 'png' ? (
                      <div>
                        <div className="pe-export__row mb-2">
                          <p className="pe-export__section-title mb-0">Quality</p>
                          <span className="text-[11px] font-bold tabular-nums text-[var(--pe-primary)]">
                            {settings.quality}%
                          </span>
                        </div>
                        <Slider.Root
                          className="relative flex h-5 w-full touch-none select-none items-center"
                          value={[settings.quality]}
                          min={40}
                          max={100}
                          step={1}
                          onValueChange={([v]) => setExportSettings({ quality: v ?? 92 })}
                        >
                          <Slider.Track className="pe-slider-track relative h-[4px] grow rounded-full">
                            <Slider.Range className="absolute h-full rounded-full bg-[var(--pe-primary)]" />
                          </Slider.Track>
                          <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-[var(--pe-ink)] bg-[var(--pe-primary)] shadow focus:outline-none" />
                        </Slider.Root>
                      </div>
                    ) : null}

                    <div className="pe-export__card">
                      <label className="pe-export__row cursor-pointer">
                        <span>
                          <span className="pe-export__card-title">Resize</span>
                          <span className="pe-export__card-desc">Limit longest edge</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={settings.resizeEnabled}
                          onChange={(e) =>
                            setExportSettings({ resizeEnabled: e.target.checked })
                          }
                          className="h-4 w-4 accent-[var(--pe-primary)]"
                        />
                      </label>
                      {settings.resizeEnabled ? (
                        <div className="mt-3 flex items-center gap-2">
                          <input
                            type="number"
                            min={400}
                            max={8000}
                            value={settings.resizeWidth}
                            onChange={(e) =>
                              setExportSettings({
                                resizeWidth: Number(e.target.value) || 2400,
                              })
                            }
                            className="pe-export__input mt-0"
                          />
                          <span className="shrink-0 text-xs font-semibold text-[var(--pe-ink-muted)]">
                            px
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <div className="pe-export__card">
                      <label className="pe-export__row cursor-pointer">
                        <span>
                          <span className="pe-export__card-title">Watermark</span>
                          <span className="pe-export__card-desc">
                            Brand mark on exported images
                          </span>
                        </span>
                        <input
                          type="checkbox"
                          checked={settings.watermark}
                          onChange={(e) => setExportSettings({ watermark: e.target.checked })}
                          className="h-4 w-4 accent-[var(--pe-primary)]"
                        />
                      </label>
                      {settings.watermark ? (
                        <input
                          type="text"
                          value={settings.watermarkText}
                          onChange={(e) =>
                            setExportSettings({ watermarkText: e.target.value })
                          }
                          placeholder="Watermark text"
                          className="pe-export__input"
                          maxLength={40}
                        />
                      ) : null}
                    </div>

                    <div className="pe-export__card">
                      <label className="pe-export__row cursor-pointer">
                        <span>
                          <span className="pe-export__card-title">Rename</span>
                          <span className="pe-export__card-desc">
                            Custom filename pattern
                          </span>
                        </span>
                        <input
                          type="checkbox"
                          checked={settings.renameEnabled}
                          onChange={(e) =>
                            setExportSettings({ renameEnabled: e.target.checked })
                          }
                          className="h-4 w-4 accent-[var(--pe-primary)]"
                        />
                      </label>
                      {settings.renameEnabled ? (
                        <>
                          <input
                            type="text"
                            value={settings.renamePattern}
                            onChange={(e) =>
                              setExportSettings({ renamePattern: e.target.value })
                            }
                            placeholder="{name}_edited"
                            className="pe-export__input"
                          />
                          <p className="pe-export__hint">
                            Tokens: {'{name}'}, {'{index}'}, {'{date}'} · Preview:{' '}
                            <strong className="text-[var(--pe-ink-soft)]">{previewName}</strong>
                          </p>
                        </>
                      ) : (
                        <p className="pe-export__hint">
                          Preview:{' '}
                          <strong className="text-[var(--pe-ink-soft)]">{previewName}</strong>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pe-export__actions">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      className="pe-export__btn"
                      data-primary="true"
                      disabled={!selectedPhotos.length && !activePhotoId}
                      onClick={() => void runExport('selected')}
                    >
                      <Download className="h-4 w-4" />
                      Export selected
                      <span className="opacity-80">({selectedPhotos.length || 1})</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      className="pe-export__btn"
                      disabled={!photos.length}
                      onClick={() => void runExport('all')}
                    >
                      <Images className="h-4 w-4" />
                      Export all
                      <span className="opacity-70">({photos.length})</span>
                    </motion.button>
                  </div>
                </motion.div>
              ) : null}

              {phase === 'progress' ? (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="pe-export-progress"
                >
                  <div className="pe-export-progress__spin-wrap">
                    <div className="pe-export-progress__spin" aria-hidden />
                  </div>
                  <div>
                    <p className="pe-export-progress__title">Exporting photos</p>
                    <p className="pe-export-progress__sub">{progress.label}</p>
                  </div>
                  <div
                    className="pe-export-progress__bar"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={progress.total}
                    aria-valuenow={progress.current}
                  >
                    <div
                      className="pe-export-progress__fill"
                      style={{
                        width: `${
                          progress.total
                            ? Math.round((progress.current / progress.total) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <div className="pe-export-progress__meta">
                    <span>
                      {progress.current} / {progress.total}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Downloading…
                    </span>
                  </div>
                  <button
                    type="button"
                    className="pe-export__btn"
                    onClick={() => {
                      cancelRef.current = true;
                    }}
                  >
                    Cancel
                  </button>
                </motion.div>
              ) : null}

              {phase === 'success' && success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="pe-export-success"
                >
                  <motion.div
                    className="pe-export-success__icon"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                  >
                    <Check className="h-7 w-7" strokeWidth={3} />
                  </motion.div>
                  <h3 className="pe-export-success__title">Download started</h3>
                  <p className="pe-export-success__sub">
                    {success.count} {success.format.toUpperCase()} file
                    {success.count === 1 ? '' : 's'} from{' '}
                    {success.scope === 'all' ? 'all photos' : 'your selection'} saved
                    automatically to your downloads folder.
                  </p>
                  <div className="pe-export-success__stats">
                    <div className="pe-export-success__stat">
                      <strong>{success.count}</strong>
                      <span>Files</span>
                    </div>
                    <div className="pe-export-success__stat">
                      <strong>{success.format.toUpperCase()}</strong>
                      <span>Format</span>
                    </div>
                    <div className="pe-export-success__stat">
                      <strong>{formatBytes(success.bytes)}</strong>
                      <span>Size</span>
                    </div>
                  </div>
                  <div className="pe-export__actions w-full">
                    <button
                      type="button"
                      className="pe-export__btn"
                      onClick={() => {
                        setSuccess(null);
                        setPhase('setup');
                      }}
                    >
                      Export more
                    </button>
                    <button
                      type="button"
                      className="pe-export__btn"
                      data-primary="true"
                      onClick={() => setExportOpen(false)}
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
