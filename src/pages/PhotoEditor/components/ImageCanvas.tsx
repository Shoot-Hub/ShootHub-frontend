import { useCallback } from 'react';
import {
  Hand,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Scan,
  Ratio,
  RotateCw,
  FlipHorizontal2,
  FlipVertical2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { usePhotoEditorStore } from '../store';
import { CanvasViewport } from './CanvasViewport';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { ImageSkeleton, IconButton, AdjustmentSlider } from './ui';

export function ImageCanvas() {
  const photo = usePhotoEditorStore((s) => s.getActivePhoto());
  const compareMode = usePhotoEditorStore((s) => s.compareMode);
  const zoom = usePhotoEditorStore((s) => s.zoom);
  const panX = usePhotoEditorStore((s) => s.panX);
  const panY = usePhotoEditorStore((s) => s.panY);
  const setZoom = usePhotoEditorStore((s) => s.setZoom);
  const setPan = usePhotoEditorStore((s) => s.setPan);
  const resetView = usePhotoEditorStore((s) => s.resetView);
  const isFullscreen = usePhotoEditorStore((s) => s.isFullscreen);
  const setFullscreen = usePhotoEditorStore((s) => s.setFullscreen);
  const isImageLoading = usePhotoEditorStore((s) => s.isImageLoading);
  const setImageLoading = usePhotoEditorStore((s) => s.setImageLoading);
  const activeTool = usePhotoEditorStore((s) => s.activeTool);
  const rotateBy = usePhotoEditorStore((s) => s.rotateBy);
  const flipHorizontal = usePhotoEditorStore((s) => s.flipHorizontal);
  const flipVertical = usePhotoEditorStore((s) => s.flipVertical);
  const setTransform = usePhotoEditorStore((s) => s.setTransform);
  const setTransformLive = usePhotoEditorStore((s) => s.setTransformLive);
  const resetActiveTransform = usePhotoEditorStore((s) => s.resetActiveTransform);

  const onReady = useCallback(() => setImageLoading(false), [setImageLoading]);

  if (!photo) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[var(--pe-canvas)]">
        <p className="text-sm font-semibold text-[var(--pe-ink-muted)]">No photo selected</p>
      </div>
    );
  }

  const zoomPct = Math.round(zoom * 100);
  const showTransformTools =
    activeTool === 'crop' || activeTool === 'rotate' || activeTool === 'flip';

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-[var(--pe-canvas)]">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--pe-border)] bg-[var(--pe-surface)]/90 px-2 py-1.5 backdrop-blur-md sm:px-3 sm:py-2">
        <div className="flex min-w-0 items-center gap-2 text-[11px] font-semibold text-[var(--pe-ink-muted)]">
          <span className="truncate text-[var(--pe-ink)] max-w-[40vw] sm:max-w-none">{photo.name}</span>
          <span className="hidden h-1 w-1 rounded-full bg-[var(--pe-ink-muted)] sm:block" />
          <span className="hidden sm:inline">
            {photo.width} × {photo.height}
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-[var(--pe-ink-muted)] md:block" />
          <span className="tabular-nums text-[var(--pe-primary)]">{zoomPct}%</span>
          {(photo.transform.flipH || photo.transform.flipV || photo.transform.rotation !== 0) && (
            <span className="rounded-full bg-[var(--pe-primary-soft)] px-2 py-0.5 text-[10px] font-bold text-[var(--pe-primary)]">
              Edited
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {activeTool === 'rotate' ? (
            <>
              <IconButton
                compact
                icon={<RotateCw className="h-4 w-4" />}
                aria-label="Rotate 90°"
                onClick={() => {
                  rotateBy(90);
                  toast.success('Rotated 90°');
                }}
              />
              <IconButton
                compact
                icon={<RotateCw className="h-4 w-4 -scale-x-100" />}
                aria-label="Rotate -90°"
                onClick={() => rotateBy(-90)}
              />
            </>
          ) : null}
          {activeTool === 'flip' ? (
            <>
              <IconButton
                compact
                icon={<FlipHorizontal2 className="h-4 w-4" />}
                aria-label="Flip H"
                active={photo.transform.flipH}
                onClick={() => flipHorizontal()}
              />
              <IconButton
                compact
                icon={<FlipVertical2 className="h-4 w-4" />}
                aria-label="Flip V"
                active={photo.transform.flipV}
                onClick={() => flipVertical()}
              />
            </>
          ) : null}
          <IconButton
            compact
            icon={<Scan className="h-4 w-4" />}
            aria-label="Fit to screen"
            onClick={resetView}
          />
        </div>
      </div>

      {showTransformTools ? (
        <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-[var(--pe-border)] bg-[var(--pe-surface-2)] px-3 py-2">
          {activeTool === 'crop' ? (
            <>
              <span className="text-[11px] font-bold text-[var(--pe-ink-muted)]">Crop %</span>
              <div className="min-w-[140px] flex-1">
                <AdjustmentSlider
                  label="Width"
                  value={photo.transform.width}
                  min={20}
                  max={100}
                  onChange={(v) =>
                    setTransformLive({ width: v, x: Math.min(photo.transform.x, 100 - v) })
                  }
                  onCommit={(v) =>
                    setTransform({ width: v, x: Math.min(photo.transform.x, 100 - v) }, 'Crop')
                  }
                />
              </div>
              <div className="min-w-[140px] flex-1">
                <AdjustmentSlider
                  label="Height"
                  value={photo.transform.height}
                  min={20}
                  max={100}
                  onChange={(v) =>
                    setTransformLive({ height: v, y: Math.min(photo.transform.y, 100 - v) })
                  }
                  onCommit={(v) =>
                    setTransform({ height: v, y: Math.min(photo.transform.y, 100 - v) }, 'Crop')
                  }
                />
              </div>
            </>
          ) : null}
          {activeTool === 'rotate' ? (
            <div className="min-w-[200px] flex-1">
              <AdjustmentSlider
                label="Angle"
                value={photo.transform.rotation}
                min={0}
                max={359}
                step={1}
                displayValue={`${Math.round(photo.transform.rotation)}°`}
                onChange={(v) => setTransformLive({ rotation: v })}
                onCommit={(v) => setTransform({ rotation: v }, 'Rotate')}
              />
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => {
              resetActiveTransform();
              toast.success('Transform reset');
            }}
            className="rounded-[10px] border border-[var(--pe-border-strong)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--pe-ink-soft)] hover:text-[var(--pe-primary)]"
          >
            Reset Transform
          </button>
        </div>
      ) : null}

      <div className="pe-canvas-bg relative min-h-0 flex-1">
        <AnimatePresence>
          {isImageLoading ? (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-4 z-10"
            >
              <ImageSkeleton className="h-full w-full" />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {compareMode ? (
          <div className="absolute inset-2 sm:inset-3 md:inset-4">
            <BeforeAfterSlider photo={photo} onReady={onReady} />
          </div>
        ) : (
          <CanvasViewport
            src={photo.src}
            adjustments={photo.adjustments}
            transform={photo.transform}
            zoom={zoom}
            panX={panX}
            panY={panY}
            onReady={onReady}
            onPanZoom={(z, x, y) => {
              setZoom(z);
              setPan(x, y);
            }}
          />
        )}

        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="pe-glass pe-canvas-fab"
        >
          <IconButton compact icon={<Hand className="h-4 w-4" />} aria-label="Pan" />
          <IconButton
            compact
            icon={<ZoomOut className="h-4 w-4" />}
            aria-label="Zoom out"
            onClick={() => setZoom(zoom - 0.15)}
          />
          <IconButton
            compact
            icon={<ZoomIn className="h-4 w-4" />}
            aria-label="Zoom in"
            onClick={() => setZoom(zoom + 0.15)}
          />
          <IconButton
            compact
            icon={<Ratio className="h-4 w-4" />}
            aria-label="1:1"
            onClick={() => {
              setZoom(1);
              setPan(0, 0);
            }}
          />
          <IconButton
            compact
            icon={
              isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )
            }
            aria-label="Fullscreen"
            onClick={() => setFullscreen(!isFullscreen)}
          />
          <IconButton
            compact
            icon={<Scan className="h-4 w-4" />}
            aria-label="Fit"
            onClick={resetView}
          />
        </motion.div>
      </div>
    </div>
  );
}
