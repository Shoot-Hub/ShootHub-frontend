import { useState } from 'react';
import { Images, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEditorStore } from '../../store';
import { getPagePhotoCount, MAX_PHOTOS_PER_PAGE } from '../../utils';

export function PageFilmstrip() {
  const album = useEditorStore((s) => s.album);
  const currentPageIndex = useEditorStore((s) => s.currentPageIndex);
  const setPageIndex = useEditorStore((s) => s.setPageIndex);
  const addPage = useEditorStore((s) => s.addPage);
  const reorderPages = useEditorStore((s) => s.reorderPages);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  if (!album) return null;

  const spreads: { start: number; left: (typeof album.pages)[0]; right?: (typeof album.pages)[0] }[] =
    [];
  for (let i = 0; i < album.pages.length; i += 2) {
    spreads.push({ start: i, left: album.pages[i], right: album.pages[i + 1] });
  }
  const activeSpread = Math.floor(currentPageIndex / 2);

  const commitReorder = (fromPageId: string, toPageId: string) => {
    if (fromPageId === toPageId) return;
    const ids = album.pages.map((p) => p.id);
    const from = ids.indexOf(fromPageId);
    const to = ids.indexOf(toPageId);
    if (from < 0 || to < 0) return;
    const next = [...ids];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    reorderPages(next);
    setPageIndex(to);
  };

  return (
    <div className="shrink-0 border-t border-[var(--ad-border)] bg-white">
      <div className="flex items-center justify-between px-3 pt-2">
        <div>
          <p className="text-[11px] font-bold text-[var(--ad-ink)]">Pages</p>
          <p className="text-[10px] font-medium text-[var(--ad-ink-muted)]">
            Max {MAX_PHOTOS_PER_PAGE} photos / page · drag to reorder
          </p>
        </div>
      </div>
      <div className="ad-scrollbar flex items-end gap-2.5 overflow-x-auto px-3 pb-2.5 pt-2">
        {spreads.map((spread, si) => {
          const photos =
            getPagePhotoCount(spread.left) +
            (spread.right ? getPagePhotoCount(spread.right) : 0);
          const label = spread.right
            ? `${spread.start + 1}-${spread.start + 2}`
            : `${spread.start + 1}`;
          const active = si === activeSpread;
          const id = spread.left.id;
          const isDragging = dragId === id;
          const isOver = overId === id && dragId !== id;

          return (
            <button
              key={id}
              type="button"
              draggable
              onDragStart={(e) => {
                setDragId(id);
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', id);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (overId !== id) setOverId(id);
              }}
              onDragLeave={() => {
                if (overId === id) setOverId(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const from = e.dataTransfer.getData('text/plain') || dragId;
                if (from) commitReorder(from, id);
                setDragId(null);
                setOverId(null);
              }}
              onDragEnd={() => {
                setDragId(null);
                setOverId(null);
              }}
              onClick={() => setPageIndex(spread.start)}
              className={cn(
                'relative shrink-0 transition',
                isDragging && 'opacity-50',
                isOver && 'translate-x-1',
              )}
            >
              <div
                className={cn(
                  'flex h-[56px] overflow-hidden rounded-[12px] border-2 shadow-sm transition',
                  active
                    ? 'border-[var(--ad-primary)] shadow-[0_8px_18px_-10px_var(--ad-primary-glow)]'
                    : 'border-[var(--ad-border)] hover:border-[#C9B8FF]',
                  isOver && 'border-[var(--ad-primary)] ring-2 ring-[var(--ad-primary)]/20',
                )}
              >
                <div className="h-full w-9 border-r border-black/5" style={{ background: spread.left.background }} />
                <div
                  className="h-full w-9"
                  style={{ background: spread.right?.background ?? '#F3F4F7' }}
                />
              </div>
              <div className="mt-1 flex items-center justify-center gap-1">
                <span
                  className={cn(
                    'text-[10px] font-bold',
                    active ? 'text-[var(--ad-primary)]' : 'text-[var(--ad-ink-muted)]',
                  )}
                >
                  {label}
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#F3F4F7] px-1 py-0.5 text-[8px] font-bold text-[var(--ad-ink-soft)]">
                  <Images className="h-2 w-2" />
                  {photos}
                </span>
              </div>
            </button>
          );
        })}
        <button
          type="button"
          onClick={addPage}
          className="mb-4 flex h-[56px] w-[72px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-[12px] border-2 border-dashed border-[#C9B8FF] bg-[var(--ad-primary-soft)] text-[var(--ad-primary)] hover:bg-[var(--ad-primary-mid)]"
        >
          <Plus className="h-4 w-4" />
          <span className="text-[9px] font-bold">Add Page</span>
        </button>
      </div>
    </div>
  );
}
