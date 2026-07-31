import { useMemo, type CSSProperties, type DragEvent } from 'react';
import type { TimelineTrack } from '../../types';
import {
  useMediaStore,
  usePlaybackStore,
  useSelectionStore,
  useTimelineStore,
} from '../../store';
import { ClipBlock } from './ClipBlock';
import { cn } from '@/lib/utils';
import {
  VE_CONSTANTS,
  pixelsToFrame,
  resolveNonOverlappingStart,
  snapFrame,
  collectSnapTargets,
} from '../../utils';

type Props = {
  track: TimelineTrack;
  pixelsPerFrame: number;
  timelineWidth: number;
};

function isMediaDrag(e: DragEvent): boolean {
  const types = Array.from(e.dataTransfer.types);
  return (
    types.includes(VE_CONSTANTS.MEDIA_DRAG_MIME) ||
    types.includes('text/plain') ||
    Boolean(useMediaStore.getState().draggingMediaId)
  );
}

export function TrackLane({ track, pixelsPerFrame, timelineWidth }: Props) {
  const clips = useTimelineStore((s) => s.clips);
  const selectClip = useSelectionStore((s) => s.selectClip);
  const dropIndicator = useTimelineStore((s) => s.dropIndicator);
  const setDropIndicator = useTimelineStore((s) => s.setDropIndicator);
  const addMediaToTimeline = useTimelineStore((s) => s.addMediaToTimeline);
  const snapEnabled = useTimelineStore((s) => s.snapEnabled);
  const magneticEnabled = useTimelineStore((s) => s.magneticEnabled);
  const getMediaById = useMediaStore((s) => s.getMediaById);
  const draggingMediaId = useMediaStore((s) => s.draggingMediaId);
  const totalFrames = usePlaybackStore((s) => s.totalFrames);

  const trackClips = useMemo(
    () => clips.filter((c) => c.trackId === track.id),
    [clips, track.id],
  );

  const visibleClips = useMemo(() => {
    const maxFrame = timelineWidth / pixelsPerFrame + 30;
    return trackClips.filter(
      (c) => c.startFrame < maxFrame && c.startFrame + c.durationFrames > -30,
    );
  }, [trackClips, timelineWidth, pixelsPerFrame]);

  const resolveDropFrame = (clientX: number, laneEl: HTMLElement, duration: number) => {
    const rect = laneEl.getBoundingClientRect();
    let frame = pixelsToFrame(clientX - rect.left, pixelsPerFrame);
    const targets = collectSnapTargets(clips, null, totalFrames);
    frame = snapFrame(frame, targets, snapEnabled).frame;
    if (magneticEnabled) {
      frame = resolveNonOverlappingStart(trackClips, null, frame, duration);
    }
    return frame;
  };

  const onDragOver = (e: DragEvent) => {
    if (!isMediaDrag(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = track.locked ? 'none' : 'copy';

    let duration = VE_CONSTANTS.FPS * 5;
    const mediaId = draggingMediaId ?? useMediaStore.getState().draggingMediaId;
    if (mediaId) {
      const media = getMediaById(mediaId);
      if (media) duration = Math.max(VE_CONSTANTS.MIN_CLIP_FRAMES, Math.round(media.durationSec * VE_CONSTANTS.FPS));
    }

    const frame = resolveDropFrame(e.clientX, e.currentTarget as HTMLElement, duration);
    setDropIndicator({
      trackId: track.id,
      frame,
      durationFrames: duration,
      valid: !track.locked,
    });
  };

  const onDragLeave = (e: DragEvent) => {
    const related = e.relatedTarget as Node | null;
    if (related && e.currentTarget.contains(related)) return;
    if (dropIndicator?.trackId === track.id) setDropIndicator(null);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDropIndicator(null);
    if (track.locked) return;

    let mediaId = useMediaStore.getState().draggingMediaId;
    if (!mediaId) {
      const raw =
        e.dataTransfer.getData(VE_CONSTANTS.MEDIA_DRAG_MIME) ||
        e.dataTransfer.getData('text/plain');
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw) as { mediaId?: string };
        mediaId = parsed.mediaId ?? raw;
      } catch {
        mediaId = raw;
      }
    }

    useMediaStore.getState().setDraggingMediaId(null);
    if (!mediaId) return;
    const media = getMediaById(mediaId);
    if (!media) return;

    const duration = Math.max(
      VE_CONSTANTS.MIN_CLIP_FRAMES,
      Math.round(media.durationSec * VE_CONSTANTS.FPS),
    );
    const frame = resolveDropFrame(e.clientX, e.currentTarget as HTMLElement, duration);
    addMediaToTimeline(media, track.id, frame);
  };

  const showIndicator = dropIndicator?.trackId === track.id;

  return (
    <div
      className={cn(
        'relative border-b border-[var(--ve-border)]',
        track.hidden && 'opacity-35',
      )}
      style={
        {
          '--ve-lane-h': `${track.height + 8}px`,
          '--ve-lane-w': `${timelineWidth}px`,
          height: 'var(--ve-lane-h)',
          width: 'var(--ve-lane-w)',
        } as CSSProperties
      }
      onClick={() => selectClip(null)}
      onKeyDown={() => undefined}
      role="presentation"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="pointer-events-none absolute inset-0 bg-[var(--ve-card)]/40" />
      {visibleClips.map((clip) => (
        <ClipBlock
          key={clip.id}
          clip={clip}
          pixelsPerFrame={pixelsPerFrame}
          trackLocked={track.locked}
        />
      ))}
      {showIndicator && dropIndicator ? (
        <div
          className={cn(
            'pointer-events-none absolute top-1 bottom-1 z-40 rounded-[8px] border-2 border-dashed',
            dropIndicator.valid
              ? 'border-[var(--ve-primary)] bg-[var(--ve-primary-soft)]'
              : 'border-[var(--ve-danger)] bg-[var(--ve-danger)]/10',
          )}
          style={
            {
              '--ve-drop-left': `${dropIndicator.frame * pixelsPerFrame}px`,
              '--ve-drop-w': `${Math.max(24, dropIndicator.durationFrames * pixelsPerFrame)}px`,
              left: 'var(--ve-drop-left)',
              width: 'var(--ve-drop-w)',
            } as CSSProperties
          }
        />
      ) : null}
    </div>
  );
}
