import { useMemo, useRef, type CSSProperties } from 'react';
import { usePlaybackStore, useTimelineStore, useUiStore } from '../../store';
import { TimelineToolbar } from './TimelineToolbar';
import { TimelineRuler } from './TimelineRuler';
import { TrackHeader } from './TrackHeader';
import { TrackLane } from './TrackLane';
import { Playhead } from './Playhead';
import { AudioMeters } from './AudioMeters';
import { VE_CONSTANTS, pixelsToFrame } from '../../utils';
import { cn } from '@/lib/utils';

export function Timeline() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const tracks = useTimelineStore((s) => s.tracks);
  const totalFrames = usePlaybackStore((s) => s.totalFrames);
  const timelineZoom = useTimelineStore((s) => s.timelineZoom);
  const setCurrentFrame = usePlaybackStore((s) => s.setCurrentFrame);
  const timelineExpanded = useUiStore((s) => s.timelineExpanded);

  const pixelsPerFrame = VE_CONSTANTS.BASE_PIXELS_PER_FRAME * timelineZoom;
  const timelineWidth = Math.max(
    VE_CONSTANTS.TIMELINE_MIN_WIDTH,
    totalFrames * pixelsPerFrame + 120,
  );

  const trackStackHeight = useMemo(
    () => tracks.reduce((sum, t) => sum + t.height + 8, 0),
    [tracks],
  );

  return (
    <section
      className={cn(
        'flex shrink-0 flex-col border-t border-[var(--ve-border)] bg-[var(--ve-surface)] transition-[height] duration-200',
        timelineExpanded ? 'h-[var(--ve-timeline-h)]' : 'h-10',
      )}
    >
      <TimelineToolbar />

      {timelineExpanded ? (
        <div className="flex min-h-0 flex-1">
          <div className="flex shrink-0 flex-col">
            <div
              className="h-7 border-b border-[var(--ve-border)]"
              style={{ width: 'var(--ve-track-header-w)' } as CSSProperties}
            />
            {tracks.map((track) => (
              <TrackHeader key={track.id} track={track} />
            ))}
          </div>

          <div
            ref={scrollRef}
            className="ve-scrollbar relative min-w-0 flex-1 overflow-auto"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('[role="button"],button')) return;
              const scroller = scrollRef.current;
              if (!scroller) return;
              const rect = scroller.getBoundingClientRect();
              const x = e.clientX - rect.left + scroller.scrollLeft;
              setCurrentFrame(pixelsToFrame(x, pixelsPerFrame));
            }}
            onKeyDown={() => undefined}
            role="presentation"
          >
            <div
              className="relative"
              style={
                {
                  '--ve-timeline-w': `${timelineWidth}px`,
                  '--ve-timeline-stack-h': `${trackStackHeight + VE_CONSTANTS.RULER_HEIGHT}px`,
                  width: 'var(--ve-timeline-w)',
                  height: 'var(--ve-timeline-stack-h)',
                } as CSSProperties
              }
            >
              <TimelineRuler pixelsPerFrame={pixelsPerFrame} timelineWidth={timelineWidth} />
              <div className="relative">
                {tracks.map((track) => (
                  <TrackLane
                    key={track.id}
                    track={track}
                    pixelsPerFrame={pixelsPerFrame}
                    timelineWidth={timelineWidth}
                  />
                ))}
                <Playhead pixelsPerFrame={pixelsPerFrame} scrollRef={scrollRef} />
              </div>
            </div>
          </div>

          <div className="hidden sm:flex">
            <AudioMeters />
          </div>
        </div>
      ) : null}
    </section>
  );
}
