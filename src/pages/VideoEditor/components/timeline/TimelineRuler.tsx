import { framesToTimecode } from '../../utils';
import { usePlaybackStore } from '../../store';
import type { CSSProperties } from 'react';

type Props = {
  pixelsPerFrame: number;
  timelineWidth: number;
};

export function TimelineRuler({ pixelsPerFrame, timelineWidth }: Props) {
  const totalFrames = usePlaybackStore((s) => s.totalFrames);
  const fps = usePlaybackStore((s) => s.fps);
  const setCurrentFrame = usePlaybackStore((s) => s.setCurrentFrame);

  const majorEvery = fps * 5;
  const marks: number[] = [];
  for (let f = 0; f <= totalFrames; f += majorEvery) {
    marks.push(f);
  }

  return (
    <div
      className="relative h-7 shrink-0 border-b border-[var(--ve-border)] bg-[var(--ve-surface)]"
      style={
        {
          '--ve-ruler-w': `${timelineWidth}px`,
          width: 'var(--ve-ruler-w)',
        } as CSSProperties
      }
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const localX = e.clientX - rect.left;
        setCurrentFrame(localX / pixelsPerFrame);
      }}
      onKeyDown={() => undefined}
      role="presentation"
    >
      {marks.map((frame) => (
        <div
          key={frame}
          className="absolute top-0 flex h-full flex-col justify-between"
          style={
            {
              '--ve-mark-x': `${frame * pixelsPerFrame}px`,
              left: 'var(--ve-mark-x)',
            } as CSSProperties
          }
        >
          <span className="pl-1 pt-1 text-[9px] font-semibold tabular-nums text-[var(--ve-ink-muted)]">
            {framesToTimecode(frame, fps).slice(3)}
          </span>
          <span className="h-2 w-px bg-[var(--ve-border-strong)]" />
        </div>
      ))}
    </div>
  );
}
