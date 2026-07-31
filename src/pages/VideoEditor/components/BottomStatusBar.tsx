import { usePlaybackStore, useTimelineStore, useUiStore } from '../store';
import { framesToTimecode } from '../utils';
import { Cpu, Clapperboard } from 'lucide-react';

export function BottomStatusBar() {
  const currentFrame = usePlaybackStore((s) => s.currentFrame);
  const totalFrames = usePlaybackStore((s) => s.totalFrames);
  const fps = usePlaybackStore((s) => s.fps);
  const timelineZoom = useTimelineStore((s) => s.timelineZoom);
  const renderStatus = useUiStore((s) => s.renderStatus);
  const gpuLabel = useUiStore((s) => s.gpuLabel);
  const aspectRatio = useUiStore((s) => s.aspectRatio);

  return (
    <footer className="hidden h-8 shrink-0 items-center gap-3 border-t border-[var(--ve-border)] bg-[var(--ve-bg)] px-3 text-[10px] font-semibold text-[var(--ve-ink-muted)] lg:flex">
      <span className="inline-flex items-center gap-1.5">
        <Clapperboard className="h-3 w-3 text-[var(--ve-primary)]" />
        <span className="text-[var(--ve-ink-soft)]">
          Frame {currentFrame} / {totalFrames}
        </span>
      </span>
      <span className="hidden sm:inline">·</span>
      <span className="hidden tabular-nums sm:inline">
        {framesToTimecode(currentFrame, fps)} · Duration {framesToTimecode(totalFrames, fps)}
      </span>
      <span className="hidden md:inline">·</span>
      <span className="hidden md:inline">Scale {Math.round(timelineZoom * 100)}%</span>
      <span className="hidden lg:inline">·</span>
      <span className="hidden lg:inline">
        {aspectRatio} · {fps} fps
      </span>

      <span className="ml-auto inline-flex items-center gap-3">
        <span
          className={
            renderStatus === 'rendering'
              ? 'text-[var(--ve-warning)]'
              : renderStatus === 'ready'
                ? 'text-[var(--ve-success)]'
                : 'text-[var(--ve-ink-muted)]'
          }
        >
          Render ·{' '}
          {renderStatus === 'ready'
            ? 'Ready'
            : renderStatus === 'rendering'
              ? 'Busy'
              : 'Idle'}
        </span>
        <span className="inline-flex items-center gap-1">
          <Cpu className="h-3 w-3" />
          {gpuLabel}
        </span>
      </span>
    </footer>
  );
}
