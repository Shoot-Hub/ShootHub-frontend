import { useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { Blend, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TimelineClip } from '../../types';
import {
  usePlaybackStore,
  useSelectionStore,
  useTimelineStore,
} from '../../store';
import { pixelsToFrame } from '../../utils';

type Props = {
  clip: TimelineClip;
  pixelsPerFrame: number;
  trackLocked: boolean;
};

function clipTone(kind: TimelineClip['kind']): string {
  switch (kind) {
    case 'adjustment':
      return 'bg-[var(--ve-clip-fx)]';
    case 'text':
      return 'bg-[var(--ve-clip-text)]';
    case 'audio':
      return 'bg-[var(--ve-clip-audio)]';
    case 'effect':
      return 'bg-[var(--ve-clip-fx)]';
    case 'overlay':
      return 'bg-[var(--ve-clip-overlay)]';
    default:
      return 'bg-[var(--ve-clip-video)]';
  }
}

type DragMode = 'move' | 'trim-left' | 'trim-right';

type DragState = {
  mode: DragMode;
  startX: number;
  originStart: number;
  originDuration: number;
  originSourceOffset: number;
  originTrackId: string;
  moved: boolean;
};

export function ClipBlock({ clip, pixelsPerFrame, trackLocked }: Props) {
  const selectedClipId = useSelectionStore((s) => s.selectedClipId);
  const selectClip = useSelectionStore((s) => s.selectClip);
  const openContextMenu = useSelectionStore((s) => s.openContextMenu);
  const pause = usePlaybackStore((s) => s.pause);

  const dragRef = useRef<DragState | null>(null);
  const selected = selectedClipId === clip.id;
  const width = Math.max(24, clip.durationFrames * pixelsPerFrame);
  const left = clip.startFrame * pixelsPerFrame;
  const isAudio = clip.kind === 'audio';
  const isVideo = clip.kind === 'video';
  const locked = Boolean(clip.locked || trackLocked);

  const beginDrag = (mode: DragMode, e: ReactPointerEvent) => {
    if (locked) return;
    e.stopPropagation();
    e.preventDefault();
    selectClip(clip.id);
    pause();

    // Capture origin from live store (avoids stale props mid-drag)
    const live = useTimelineStore.getState().clips.find((c) => c.id === clip.id) ?? clip;
    dragRef.current = {
      mode,
      startX: e.clientX,
      originStart: live.startFrame,
      originDuration: live.durationFrames,
      originSourceOffset: live.sourceOffset,
      originTrackId: live.trackId,
      moved: false,
    };

    const onMove = (ev: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const deltaFrames = pixelsToFrame(ev.clientX - drag.startX, pixelsPerFrame);
      if (deltaFrames !== 0) drag.moved = true;

      const { moveClip, applyTrimFromOrigin } = useTimelineStore.getState();
      if (drag.mode === 'move') {
        moveClip(clip.id, drag.originTrackId, drag.originStart + deltaFrames, false);
      } else if (drag.mode === 'trim-left') {
        applyTrimFromOrigin(
          clip.id,
          'left',
          {
            startFrame: drag.originStart,
            durationFrames: drag.originDuration,
            sourceOffset: drag.originSourceOffset,
          },
          drag.originStart + deltaFrames,
          false,
        );
      } else {
        applyTrimFromOrigin(
          clip.id,
          'right',
          {
            startFrame: drag.originStart,
            durationFrames: drag.originDuration,
            sourceOffset: drag.originSourceOffset,
          },
          drag.originStart + drag.originDuration + deltaFrames,
          false,
        );
      }
    };

    const onUp = () => {
      const drag = dragRef.current;
      dragRef.current = null;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (!drag || !drag.moved) return;

      const { commitHistory, clips } = useTimelineStore.getState();
      const current = clips.find((c) => c.id === clip.id);
      if (!current) return;

      if (drag.mode === 'move') {
        const changed =
          current.startFrame !== drag.originStart ||
          current.trackId !== drag.originTrackId;
        if (changed) commitHistory(`Move ${current.name}`);
        return;
      }

      const changed =
        current.startFrame !== drag.originStart ||
        current.durationFrames !== drag.originDuration ||
        current.sourceOffset !== drag.originSourceOffset;
      if (changed) commitHistory(`Trim ${current.name}`);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div
      className={cn(
        'absolute top-1 bottom-1 overflow-hidden rounded-[8px] border text-left transition-[box-shadow,border-color] duration-150',
        clipTone(clip.kind),
        selected
          ? 'z-10 border-white/80 shadow-[0_0_0_1px_rgba(255,255,255,0.45),0_0_16px_var(--ve-primary-glow)]'
          : 'border-white/10 hover:border-white/30',
        clip.kind === 'audio' && clip.color === '#2563eb' && 'bg-[var(--ve-clip-voice)]',
        clip.disabled && 'opacity-45',
        locked ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing',
      )}
      style={
        {
          '--ve-clip-left': `${left}px`,
          '--ve-clip-width': `${width}px`,
          left: 'var(--ve-clip-left)',
          width: 'var(--ve-clip-width)',
        } as CSSProperties
      }
      onPointerDown={(e) => beginDrag('move', e)}
      onClick={(e) => {
        e.stopPropagation();
        selectClip(clip.id);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openContextMenu(e.clientX, e.clientY, clip.id);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') selectClip(clip.id);
      }}
    >
      {isVideo && clip.thumbnail ? (
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <img src={clip.thumbnail} alt="" className="h-full w-full object-cover" draggable={false} />
        </div>
      ) : null}

      {isAudio ? (
        <div className="ve-waveform pointer-events-none absolute inset-x-1 inset-y-1.5 rounded opacity-80" />
      ) : null}

      <div className="pointer-events-none relative flex h-full items-center gap-1 px-2">
        {clip.locked ? <Lock className="h-2.5 w-2.5 text-white/80" /> : null}
        <span className="truncate text-[10px] font-bold text-white drop-shadow">
          {clip.name}
        </span>
      </div>

      {clip.hasTransitionAfter ? (
        <span className="pointer-events-none absolute -right-2 top-1/2 z-20 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--ve-accent)] text-white shadow">
          <Blend className="h-2.5 w-2.5" />
        </span>
      ) : null}

      {!locked ? (
        <>
          <span
            className="absolute bottom-0 left-0 top-0 z-20 w-1.5 cursor-ew-resize bg-white/0 hover:bg-white/35"
            onPointerDown={(e) => beginDrag('trim-left', e)}
          />
          <span
            className="absolute bottom-0 right-0 top-0 z-20 w-1.5 cursor-ew-resize bg-white/0 hover:bg-white/35"
            onPointerDown={(e) => beginDrag('trim-right', e)}
          />
        </>
      ) : null}
    </div>
  );
}
