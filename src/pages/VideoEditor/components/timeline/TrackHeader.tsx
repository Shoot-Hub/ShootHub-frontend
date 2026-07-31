import { useRef, useState, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Lock, Unlock, Volume2, VolumeX } from 'lucide-react';
import type { TimelineTrack } from '../../types';
import { useTimelineStore } from '../../store';

type Props = {
  track: TimelineTrack;
};

export function TrackHeader({ track }: Props) {
  const toggleTrackLock = useTimelineStore((s) => s.toggleTrackLock);
  const toggleTrackHidden = useTimelineStore((s) => s.toggleTrackHidden);
  const toggleTrackMuted = useTimelineStore((s) => s.toggleTrackMuted);
  const renameTrack = useTimelineStore((s) => s.renameTrack);
  const setTrackHeight = useTimelineStore((s) => s.setTrackHeight);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(track.name);
  const resizeRef = useRef<{ startY: number; startH: number } | null>(null);
  const isAudio = track.type === 'audio' || track.type === 'voice';

  return (
    <div
      className="relative flex shrink-0 items-center gap-1 border-b border-[var(--ve-border)] bg-[var(--ve-surface)] px-2"
      style={
        {
          '--ve-track-h': `${track.height + 8}px`,
          height: 'var(--ve-track-h)',
          width: 'var(--ve-track-header-w)',
        } as CSSProperties
      }
    >
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: track.color } as CSSProperties}
      />
      {editing ? (
        <input
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onBlur={() => {
            setEditing(false);
            if (name.trim() && name !== track.name) renameTrack(track.id, name.trim());
            else setName(track.name);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            if (e.key === 'Escape') {
              setName(track.name);
              setEditing(false);
            }
          }}
          className="min-w-0 flex-1 rounded bg-[var(--ve-card)] px-1 text-[10px] font-bold text-[var(--ve-ink)] outline-none"
        />
      ) : (
        <button
          type="button"
          onDoubleClick={() => setEditing(true)}
          className="min-w-0 flex-1 truncate text-left text-[10px] font-bold text-[var(--ve-ink-soft)]"
          title="Double-click to rename"
        >
          {track.name}
        </button>
      )}
      <button
        type="button"
        aria-label={track.hidden ? 'Show track' : 'Hide track'}
        onClick={() => toggleTrackHidden(track.id)}
        className={cn(
          'hidden rounded p-0.5 sm:inline-flex',
          track.hidden
            ? 'text-[var(--ve-danger)]'
            : 'text-[var(--ve-ink-muted)] hover:text-[var(--ve-ink)]',
        )}
      >
        {track.hidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
      </button>
      <button
        type="button"
        aria-label={track.locked ? 'Unlock track' : 'Lock track'}
        onClick={() => toggleTrackLock(track.id)}
        className={cn(
          'rounded p-0.5',
          track.locked
            ? 'text-[var(--ve-warning)]'
            : 'text-[var(--ve-ink-muted)] hover:text-[var(--ve-ink)]',
        )}
      >
        {track.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
      </button>
      {isAudio ? (
        <button
          type="button"
          aria-label={track.muted ? 'Unmute track' : 'Mute track'}
          onClick={() => toggleTrackMuted(track.id)}
          className={cn(
            'rounded p-0.5',
            track.muted
              ? 'text-[var(--ve-danger)]'
              : 'text-[var(--ve-ink-muted)] hover:text-[var(--ve-ink)]',
          )}
        >
          {track.muted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
        </button>
      ) : null}

      <span
        className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize"
        onPointerDown={(e) => {
          e.preventDefault();
          resizeRef.current = { startY: e.clientY, startH: track.height };
          const move = (ev: PointerEvent) => {
            const start = resizeRef.current;
            if (!start) return;
            setTrackHeight(track.id, start.startH + (ev.clientY - start.startY));
          };
          const up = () => {
            resizeRef.current = null;
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
          };
          window.addEventListener('pointermove', move);
          window.addEventListener('pointerup', up);
        }}
      />
    </div>
  );
}
