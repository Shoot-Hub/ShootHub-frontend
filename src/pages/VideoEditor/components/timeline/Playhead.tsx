import { useEffect, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { usePlaybackStore, useTimelineStore } from '../../store';
import { collectSnapTargets, pixelsToFrame, snapFrame } from '../../utils';

type Props = {
  pixelsPerFrame: number;
  scrollRef: React.RefObject<HTMLDivElement | null>;
};

export function Playhead({ pixelsPerFrame, scrollRef }: Props) {
  const currentFrame = usePlaybackStore((s) => s.currentFrame);
  const setCurrentFrame = usePlaybackStore((s) => s.setCurrentFrame);
  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const pause = usePlaybackStore((s) => s.pause);
  const totalFrames = usePlaybackStore((s) => s.totalFrames);
  const dragging = useRef(false);
  const left = currentFrame * pixelsPerFrame;

  useEffect(() => {
    if (!isPlaying || dragging.current) return;
    const scroller = scrollRef.current;
    if (!scroller) return;
    const viewLeft = scroller.scrollLeft;
    const viewRight = viewLeft + scroller.clientWidth;
    const x = left;
    if (x > viewRight - 48) {
      scroller.scrollLeft = x - scroller.clientWidth * 0.65;
    } else if (x < viewLeft + 24) {
      scroller.scrollLeft = Math.max(0, x - 48);
    }
  }, [left, isPlaying, scrollRef]);

  const onPointerDown = (e: ReactPointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    pause();
    dragging.current = true;
    const scroller = scrollRef.current;
    if (!scroller) return;

    const moveTo = (clientX: number) => {
      const rect = scroller.getBoundingClientRect();
      const x = clientX - rect.left + scroller.scrollLeft;
      let frame = pixelsToFrame(x, pixelsPerFrame);
      const { clips, snapEnabled } = useTimelineStore.getState();
      const { totalFrames: tf } = usePlaybackStore.getState();
      const targets = collectSnapTargets(clips, null, tf);
      frame = snapFrame(frame, targets, snapEnabled).frame;
      setCurrentFrame(frame);
    };

    moveTo(e.clientX);

    const move = (ev: PointerEvent) => moveTo(ev.clientX);
    const up = () => {
      dragging.current = false;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <div
      className="absolute bottom-0 top-0 z-30 cursor-ew-resize"
      style={
        {
          '--ve-playhead-x': `${left}px`,
          left: 'var(--ve-playhead-x)',
          width: '12px',
          marginLeft: '-6px',
        } as CSSProperties
      }
      onPointerDown={onPointerDown}
      role="slider"
      aria-valuenow={currentFrame}
      aria-valuemin={0}
      aria-valuemax={totalFrames}
      tabIndex={0}
      aria-label="Playhead"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-[2px] bg-[var(--ve-playhead)] shadow" />
      <div className="pointer-events-none absolute left-1/2 top-2 bottom-0 w-px -translate-x-1/2 bg-[var(--ve-playhead)]" />
    </div>
  );
}
