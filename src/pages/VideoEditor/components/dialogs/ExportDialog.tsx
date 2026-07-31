import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, X } from 'lucide-react';
import { usePlaybackStore, useUiStore } from '../../store';
import { estimateExportSizeMb } from '../../utils';
import type { ExportFps, ExportFormat, ExportPreset, ExportResolution } from '../../types';
import { cn } from '@/lib/utils';

const PRESETS: { id: ExportPreset; label: string; hint: string }[] = [
  { id: 'instagram-reel', label: 'Instagram Reel', hint: '9:16 · Social' },
  { id: 'youtube', label: 'YouTube', hint: '16:9 · Longform' },
  { id: 'facebook', label: 'Facebook', hint: 'Feed ready' },
  { id: 'tiktok', label: 'TikTok', hint: '9:16 · Vertical' },
  { id: 'custom', label: 'Custom', hint: 'Full control' },
];

const RESOLUTIONS: ExportResolution[] = ['1080p', '2k', '4k'];
const FORMATS: ExportFormat[] = ['mp4', 'mov'];
const FPS_OPTIONS: ExportFps[] = [24, 30, 60];

export function ExportDialog() {
  const open = useUiStore((s) => s.exportOpen);
  const setExportOpen = useUiStore((s) => s.setExportOpen);
  const settings = useUiStore((s) => s.exportSettings);
  const setExportSettings = useUiStore((s) => s.setExportSettings);
  const startExport = useUiStore((s) => s.startExport);
  const isExporting = useUiStore((s) => s.isExporting);
  const exportProgress = useUiStore((s) => s.exportProgress);
  const totalFrames = usePlaybackStore((s) => s.totalFrames);
  const fps = usePlaybackStore((s) => s.fps);

  const durationSec = totalFrames / fps;
  const estimated = estimateExportSizeMb(settings.resolution, settings.fps, durationSec);

  return (
    <Dialog.Root open={open} onOpenChange={setExportOpen}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                className="video-editor-root fixed left-1/2 top-1/2 z-50 w-[min(92vw,480px)] -translate-x-1/2 -translate-y-1/2 rounded-[var(--ve-radius)] border border-[var(--ve-border-strong)] bg-[var(--ve-surface)] p-5 shadow-[var(--ve-shadow-float)] focus:outline-none sm:p-6"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <Dialog.Title className="text-[16px] font-bold text-[var(--ve-ink)]">
                      Export Project
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-[12px] text-[var(--ve-ink-soft)]">
                      Choose destination, quality, and format
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="rounded-[10px] p-1.5 text-[var(--ve-ink-muted)] hover:bg-[var(--ve-elevated)] hover:text-[var(--ve-ink)]"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {PRESETS.map((preset) => {
                    const active = settings.preset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setExportSettings({ preset: preset.id })}
                        className={cn(
                          'rounded-[14px] border p-3 text-left transition-colors',
                          active
                            ? 'border-[var(--ve-primary)] bg-[var(--ve-primary-soft)]'
                            : 'border-[var(--ve-border)] bg-[var(--ve-card)] hover:border-[var(--ve-border-strong)]',
                        )}
                      >
                        <p className="text-[12px] font-bold text-[var(--ve-ink)]">{preset.label}</p>
                        <p className="mt-0.5 text-[10px] text-[var(--ve-ink-muted)]">{preset.hint}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <label className="space-y-1">
                    <span className="text-[11px] font-semibold text-[var(--ve-ink-soft)]">Format</span>
                    <select
                      value={settings.format}
                      onChange={(e) =>
                        setExportSettings({ format: e.target.value as ExportFormat })
                      }
                      className="h-9 w-full rounded-[10px] border border-[var(--ve-border-strong)] bg-[var(--ve-card)] px-2 text-[12px] font-bold uppercase text-[var(--ve-ink)] outline-none"
                    >
                      {FORMATS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-[11px] font-semibold text-[var(--ve-ink-soft)]">
                      Resolution
                    </span>
                    <select
                      value={settings.resolution}
                      onChange={(e) =>
                        setExportSettings({
                          resolution: e.target.value as ExportResolution,
                        })
                      }
                      className="h-9 w-full rounded-[10px] border border-[var(--ve-border-strong)] bg-[var(--ve-card)] px-2 text-[12px] font-bold text-[var(--ve-ink)] outline-none"
                    >
                      {RESOLUTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-[11px] font-semibold text-[var(--ve-ink-soft)]">FPS</span>
                    <select
                      value={settings.fps}
                      onChange={(e) =>
                        setExportSettings({ fps: Number(e.target.value) as ExportFps })
                      }
                      className="h-9 w-full rounded-[10px] border border-[var(--ve-border-strong)] bg-[var(--ve-card)] px-2 text-[12px] font-bold text-[var(--ve-ink)] outline-none"
                    >
                      {FPS_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {f} FPS
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-[14px] border border-[var(--ve-border)] bg-[var(--ve-card)] px-3 py-2.5">
                  <div>
                    <p className="text-[11px] font-semibold text-[var(--ve-ink-soft)]">
                      Estimated size
                    </p>
                    <p className="text-[14px] font-bold text-[var(--ve-ink)]">{estimated} MB</p>
                  </div>
                  <label className="flex items-center gap-2 text-[12px] font-semibold text-[var(--ve-ink-soft)]">
                    <input
                      type="checkbox"
                      checked={settings.watermark}
                      onChange={(e) => setExportSettings({ watermark: e.target.checked })}
                      className="accent-[var(--ve-primary)]"
                    />
                    Watermark
                  </label>
                </div>

                {isExporting ? (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--ve-ink-soft)]">
                      <span className="inline-flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--ve-primary)]" />
                        Rendering…
                      </span>
                      <span>{exportProgress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--ve-track)]">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--ve-primary)] to-[var(--ve-accent)]"
                        animate={{ width: `${exportProgress}%` }}
                      />
                    </div>
                  </div>
                ) : null}

                <motion.button
                  type="button"
                  whileHover={{ scale: isExporting ? 1 : 1.02 }}
                  whileTap={{ scale: isExporting ? 1 : 0.98 }}
                  disabled={isExporting}
                  onClick={startExport}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[var(--ve-primary)] py-3 text-[13px] font-bold text-white shadow-[0_8px_24px_var(--ve-primary-glow)] disabled:opacity-60"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Rendering
                    </>
                  ) : exportProgress === 100 ? (
                    <>
                      <Check className="h-4 w-4" />
                      Export Again
                    </>
                  ) : (
                    'Start Export'
                  )}
                </motion.button>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
