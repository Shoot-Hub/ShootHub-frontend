import { Copy, ClipboardPaste, LayoutGrid, List, ArrowUpDown } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { usePhotoEditorStore } from '../store';
import '../styles/responsive.css';

export function BottomToolbar() {
  const selectedIds = usePhotoEditorStore((s) => s.selectedIds);
  const clipboard = usePhotoEditorStore((s) => s.clipboard);
  const thumbSize = usePhotoEditorStore((s) => s.thumbSize);
  const copyEdits = usePhotoEditorStore((s) => s.copyEdits);
  const pasteEdits = usePhotoEditorStore((s) => s.pasteEdits);
  const applyEditsToSelected = usePhotoEditorStore((s) => s.applyEditsToSelected);
  const deselectAll = usePhotoEditorStore((s) => s.deselectAll);
  const selectAll = usePhotoEditorStore((s) => s.selectAll);
  const setThumbSize = usePhotoEditorStore((s) => s.setThumbSize);
  const photos = usePhotoEditorStore((s) => s.photos);
  const batchBusy = usePhotoEditorStore((s) => s.batchBusy);
  const breakpoint = usePhotoEditorStore((s) => s.breakpoint);

  const count = selectedIds.length;
  const compact = breakpoint === 'mobile';

  return (
    <div className="pe-bottom-bar">
      <div className="flex shrink-0 items-center gap-2 text-[12px]">
        <span className="whitespace-nowrap font-bold text-[var(--pe-ink)]">
          {count}
          {!compact ? ` Photo${count === 1 ? '' : 's'}` : ''} selected
        </span>
        {count > 0 ? (
          <button
            type="button"
            onClick={deselectAll}
            className="whitespace-nowrap font-semibold text-[var(--pe-primary)]"
          >
            Clear
          </button>
        ) : (
          <button
            type="button"
            onClick={selectAll}
            className="whitespace-nowrap font-semibold text-[var(--pe-primary)]"
          >
            All
          </button>
        )}
      </div>

      <div className="mx-auto flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            copyEdits();
            toast.success('Edits copied');
          }}
          className="inline-flex items-center gap-1.5 rounded-[12px] border border-[var(--pe-border-strong)] bg-[var(--pe-elevated)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--pe-ink-soft)]"
        >
          <Copy className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Copy</span>
        </button>
        <button
          type="button"
          disabled={!clipboard}
          onClick={() => {
            pasteEdits();
            toast.success('Edits pasted');
          }}
          className="inline-flex items-center gap-1.5 rounded-[12px] border border-[var(--pe-border-strong)] bg-[var(--pe-elevated)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--pe-ink-soft)] disabled:opacity-40"
        >
          <ClipboardPaste className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Paste</span>
        </button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          disabled={!count || batchBusy}
          onClick={() => applyEditsToSelected()}
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-[12px] bg-[var(--pe-primary)] px-3 py-1.5 text-[11px] font-bold text-white disabled:opacity-40"
        >
          {compact ? `Apply (${count || photos.length})` : `Apply to ${count || photos.length}`}
        </motion.button>
      </div>

      <div className="ml-auto hidden shrink-0 items-center gap-2 md:flex">
        <LayoutGrid className="h-4 w-4 text-[var(--pe-ink-muted)]" />
        <List className="h-4 w-4 text-[var(--pe-ink-muted)]" />
        <ArrowUpDown className="h-4 w-4 text-[var(--pe-ink-muted)]" />
        <div className="flex w-24 items-center">
          <Slider.Root
            className="relative flex h-5 w-full touch-none select-none items-center"
            value={[thumbSize]}
            min={48}
            max={120}
            step={4}
            onValueChange={([v]) => setThumbSize(v ?? 72)}
          >
            <Slider.Track className="pe-slider-track relative h-1 grow rounded-full">
              <Slider.Range className="absolute h-full rounded-full bg-[var(--pe-primary)]" />
            </Slider.Track>
            <Slider.Thumb
              className="block h-3.5 w-3.5 rounded-full border-2 border-[var(--pe-ink)] bg-[var(--pe-primary)] shadow focus:outline-none"
              aria-label="Thumbnail size"
            />
          </Slider.Root>
        </div>
      </div>
    </div>
  );
}
