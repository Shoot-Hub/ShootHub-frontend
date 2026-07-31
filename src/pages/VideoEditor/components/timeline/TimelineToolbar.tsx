import {
  Scissors,
  Trash2,
  Magnet,
  Crop,
  MousePointer2,
  ZoomIn,
  ZoomOut,
  Mic,
  Undo2,
  Redo2,
  Link2,
} from 'lucide-react';
import {
  useHistoryStore,
  useTimelineStore,
} from '../../store';
import { IconButton } from '../ui';
import * as Slider from '@radix-ui/react-slider';

export function TimelineToolbar() {
  const splitClipAtPlayhead = useTimelineStore((s) => s.splitClipAtPlayhead);
  const deleteClip = useTimelineStore((s) => s.deleteClip);
  const snapEnabled = useTimelineStore((s) => s.snapEnabled);
  const setSnapEnabled = useTimelineStore((s) => s.setSnapEnabled);
  const magneticEnabled = useTimelineStore((s) => s.magneticEnabled);
  const setMagneticEnabled = useTimelineStore((s) => s.setMagneticEnabled);
  const timelineZoom = useTimelineStore((s) => s.timelineZoom);
  const setTimelineZoom = useTimelineStore((s) => s.setTimelineZoom);
  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);

  return (
    <div className="flex h-10 shrink-0 items-center gap-0.5 overflow-x-auto border-b border-[var(--ve-border)] bg-[var(--ve-surface)] px-1.5 sm:gap-1 sm:px-2">
      <IconButton compact aria-label="Undo" icon={<Undo2 className="h-3.5 w-3.5" />} onClick={undo} />
      <IconButton compact aria-label="Redo" icon={<Redo2 className="h-3.5 w-3.5" />} onClick={redo} />
      <div className="mx-1 h-4 w-px shrink-0 bg-[var(--ve-border-strong)]" />
      <IconButton
        compact
        aria-label="Select"
        icon={<MousePointer2 className="h-3.5 w-3.5" />}
        active
      />
      <IconButton
        compact
        aria-label="Split"
        icon={<Scissors className="h-3.5 w-3.5" />}
        onClick={() => splitClipAtPlayhead()}
      />
      <IconButton
        compact
        aria-label="Delete"
        icon={<Trash2 className="h-3.5 w-3.5" />}
        onClick={() => deleteClip()}
      />
      <IconButton
        compact
        aria-label="Crop"
        icon={<Crop className="h-3.5 w-3.5" />}
        className="hidden sm:inline-flex"
      />
      <IconButton
        compact
        aria-label="Snap"
        active={snapEnabled}
        icon={<Magnet className="h-3.5 w-3.5" />}
        onClick={() => setSnapEnabled(!snapEnabled)}
      />
      <IconButton
        compact
        aria-label="Magnetic timeline"
        active={magneticEnabled}
        icon={<Link2 className="h-3.5 w-3.5" />}
        onClick={() => setMagneticEnabled(!magneticEnabled)}
        className="hidden sm:inline-flex"
      />

      <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
        <IconButton
          compact
          aria-label="Voiceover"
          icon={<Mic className="h-3.5 w-3.5" />}
          className="hidden md:inline-flex"
        />
        <IconButton
          compact
          aria-label="Zoom out"
          icon={<ZoomOut className="h-3.5 w-3.5" />}
          onClick={() => setTimelineZoom(timelineZoom - 0.2)}
        />
        <Slider.Root
          className="relative hidden h-5 w-20 touch-none select-none items-center sm:flex sm:w-24"
          value={[timelineZoom]}
          min={0.4}
          max={4}
          step={0.1}
          onValueChange={([v]) => setTimelineZoom(v ?? 1)}
        >
          <Slider.Track className="ve-slider-track relative h-[3px] grow rounded-full">
            <Slider.Range className="absolute h-full rounded-full bg-[var(--ve-primary)]" />
          </Slider.Track>
          <Slider.Thumb
            className="block h-3 w-3 rounded-full bg-[var(--ve-primary)] focus:outline-none"
            aria-label="Timeline zoom"
          />
        </Slider.Root>
        <IconButton
          compact
          aria-label="Zoom in"
          icon={<ZoomIn className="h-3.5 w-3.5" />}
          onClick={() => setTimelineZoom(timelineZoom + 0.2)}
        />
      </div>
    </div>
  );
}
