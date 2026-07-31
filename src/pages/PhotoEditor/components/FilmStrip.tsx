import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Check, Images } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePhotoEditorStore } from '../store';
import { EmptyState } from './ui';
import { AddPhotosDropzone } from './AddPhotosDropzone';
import { FilmStripThumb } from './FilmStripThumb';
import {
  FilmStripContextMenu,
  type FilmContextAction,
} from './FilmStripContextMenu';
import '../styles/filmstrip.css';

const GAP = 8;
const VIRTUAL_THRESHOLD = 48;

export function FilmStrip() {
  const photos = usePhotoEditorStore((s) => s.photos);
  const activePhotoId = usePhotoEditorStore((s) => s.activePhotoId);
  const selectedIds = usePhotoEditorStore((s) => s.selectedIds);
  const thumbSize = usePhotoEditorStore((s) => s.thumbSize);
  const clipboard = usePhotoEditorStore((s) => s.clipboard);
  const setActivePhoto = usePhotoEditorStore((s) => s.setActivePhoto);
  const toggleSelect = usePhotoEditorStore((s) => s.toggleSelect);
  const selectOnly = usePhotoEditorStore((s) => s.selectOnly);
  const selectRangeTo = usePhotoEditorStore((s) => s.selectRangeTo);
  const selectAll = usePhotoEditorStore((s) => s.selectAll);
  const deselectAll = usePhotoEditorStore((s) => s.deselectAll);
  const reorderPhotos = usePhotoEditorStore((s) => s.reorderPhotos);
  const removePhotos = usePhotoEditorStore((s) => s.removePhotos);
  const duplicatePhoto = usePhotoEditorStore((s) => s.duplicatePhoto);
  const copyEdits = usePhotoEditorStore((s) => s.copyEdits);
  const pasteEdits = usePhotoEditorStore((s) => s.pasteEdits);
  const applyEditsToSelected = usePhotoEditorStore((s) => s.applyEditsToSelected);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [ctx, setCtx] = useState<{
    open: boolean;
    x: number;
    y: number;
    photoId: string;
  }>({ open: false, x: 0, y: 0, photoId: '' });

  const itemSize = thumbSize + GAP;
  const useVirtual = photos.length >= VIRTUAL_THRESHOLD;
  const slotCount = photos.length + 1;

  // TanStack Virtual returns unstable function identities — intentional for this scroller.
  // eslint-disable-next-line react-hooks/incompatible-library -- filmstrip virtualization
  const virtualizer = useVirtualizer({
    count: slotCount,
    getScrollElement: () => scrollerRef.current,
    estimateSize: () => itemSize,
    horizontal: true,
    overscan: 8,
  });

  useEffect(() => {
    virtualizer.measure();
  }, [thumbSize, virtualizer]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const width = useVirtual ? virtualizer.getTotalSize() : slotCount * itemSize;
    el.style.setProperty('--pe-film-row-h', `${thumbSize + 8}px`);
    el.style.setProperty('--pe-film-track-w', `${width}px`);
  }, [useVirtual, virtualizer, slotCount, itemSize, thumbSize, photos.length]);

  const scrollToIndex = useCallback(
    (index: number, align: 'auto' | 'center' = 'auto') => {
      const i = Math.max(0, Math.min(photos.length - 1, index));
      if (useVirtual) {
        virtualizer.scrollToIndex(i, { align, behavior: 'smooth' });
        return;
      }
      const el = scrollerRef.current;
      if (!el) return;
      const left = i * itemSize - el.clientWidth / 2 + thumbSize / 2;
      el.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    },
    [photos.length, useVirtual, virtualizer, itemSize, thumbSize],
  );

  useEffect(() => {
    if (!activePhotoId) return;
    const idx = photos.findIndex((p) => p.id === activePhotoId);
    if (idx >= 0) scrollToIndex(idx, 'center');
    // Only when active photo changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePhotoId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const photoIds = useMemo(() => photos.map((p) => p.id), [photos]);

  const onDragStart = (e: DragStartEvent) => setDraggingId(String(e.active.id));

  const onDragEnd = (e: DragEndEvent) => {
    setDraggingId(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = photos.findIndex((p) => p.id === active.id);
    const to = photos.findIndex((p) => p.id === over.id);
    if (from < 0 || to < 0) return;
    reorderPhotos(from, to);
  };

  const activateWithModifiers = (photoId: string, e: MouseEvent) => {
    if (e.shiftKey) {
      selectRangeTo(photoId);
      setActivePhoto(photoId);
      return;
    }
    if (e.metaKey || e.ctrlKey) {
      toggleSelect(photoId);
      setActivePhoto(photoId);
      return;
    }
    setActivePhoto(photoId);
    selectOnly(photoId);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!photos.length) return;
    const idx = Math.max(0, photos.findIndex((p) => p.id === activePhotoId));

    const go = (next: number, extend: boolean) => {
      const clamped = Math.max(0, Math.min(photos.length - 1, next));
      const id = photos[clamped]!.id;
      setActivePhoto(id);
      if (extend) selectRangeTo(id);
      else selectOnly(id);
      scrollToIndex(clamped, 'center');
    };

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        go(idx + 1, e.shiftKey);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        go(idx - 1, e.shiftKey);
        break;
      case 'Home':
        e.preventDefault();
        go(0, e.shiftKey);
        break;
      case 'End':
        e.preventDefault();
        go(photos.length - 1, e.shiftKey);
        break;
      case ' ':
        e.preventDefault();
        if (activePhotoId) toggleSelect(activePhotoId);
        break;
      case 'a':
      case 'A':
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          selectAll();
        }
        break;
      case 'Delete':
      case 'Backspace':
        if (selectedIds.length) {
          e.preventDefault();
          removePhotos(selectedIds);
          toast.success(`Removed ${selectedIds.length} photo(s)`);
        }
        break;
      default:
        break;
    }
  };

  const openContext = (photoId: string, e: MouseEvent) => {
    e.preventDefault();
    setCtx({ open: true, x: e.clientX, y: e.clientY, photoId });
    if (!selectedIds.includes(photoId)) selectOnly(photoId);
  };

  const onContextAction = (action: FilmContextAction) => {
    const id = ctx.photoId;
    switch (action) {
      case 'activate':
        setActivePhoto(id);
        break;
      case 'select':
        if (!selectedIds.includes(id)) toggleSelect(id);
        break;
      case 'deselect':
        if (selectedIds.includes(id)) toggleSelect(id);
        break;
      case 'selectAll':
        selectAll();
        break;
      case 'deselectAll':
        deselectAll();
        break;
      case 'copy':
        setActivePhoto(id);
        copyEdits();
        toast.success('Edits copied');
        break;
      case 'paste':
        if (!clipboard) {
          toast.error('Nothing to paste');
          break;
        }
        setActivePhoto(id);
        pasteEdits();
        toast.success('Edits pasted');
        break;
      case 'apply':
        setActivePhoto(id);
        applyEditsToSelected();
        break;
      case 'duplicate':
        duplicatePhoto(id);
        toast.success('Photo duplicated');
        break;
      case 'remove': {
        const ids = selectedIds.includes(id) ? selectedIds : [id];
        removePhotos(ids);
        toast.success(`Removed ${ids.length} photo(s)`);
        break;
      }
      default:
        break;
    }
  };

  const virtualItems = virtualizer.getVirtualItems();
  const slots = useMemo(() => {
    if (useVirtual) {
      return virtualItems.map((item) => ({
        index: item.index,
        start: item.start,
        key: String(item.key),
      }));
    }
    return Array.from({ length: slotCount }, (_, index) => ({
      index,
      start: index * itemSize,
      key: String(index),
    }));
  }, [useVirtual, virtualItems, slotCount, itemSize]);

  const draggingPhoto = draggingId ? photos.find((p) => p.id === draggingId) : null;
  const ctxPhoto = photos.find((p) => p.id === ctx.photoId);

  if (!photos.length) {
    return (
      <div className="pe-filmstrip p-3">
        <EmptyState
          icon={<Images className="h-5 w-5" />}
          title="No photos"
          description="Drop images or use Add to start editing."
          className="py-6"
        />
        <div className="mt-3 flex justify-center">
          <AddPhotosDropzone size={thumbSize} />
        </div>
      </div>
    );
  }

  return (
    <div className="pe-filmstrip">
      <div className="pe-filmstrip-meta">
        <p className="pe-filmstrip-count">
          <strong>{selectedIds.length}</strong> of {photos.length} selected
          {activePhotoId ? (
            <span className="ml-2 hidden font-semibold text-[var(--pe-ink-muted)] sm:inline">
              · {photos.find((p) => p.id === activePhotoId)?.name}
            </span>
          ) : null}
        </p>
        <div className="flex items-center gap-2 text-[11px] font-semibold text-[var(--pe-ink-muted)]">
          <span className="hidden sm:inline">← → · Shift range · ⌘/Ctrl click · Space</span>
          {selectedIds.length > 0 ? (
            <button type="button" className="text-[var(--pe-primary)] hover:underline" onClick={deselectAll}>
              Deselect
            </button>
          ) : (
            <button type="button" className="text-[var(--pe-primary)] hover:underline" onClick={selectAll}>
              Select all
            </button>
          )}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => setDraggingId(null)}
      >
        <SortableContext items={photoIds} strategy={horizontalListSortingStrategy}>
          <div
            ref={scrollerRef}
            className="pe-filmstrip-scroller pe-scrollbar"
            tabIndex={0}
            role="listbox"
            aria-label="Film strip"
            aria-multiselectable
            onKeyDown={onKeyDown}
          >
            <div ref={trackRef} className="pe-filmstrip-track pe-filmstrip-track--sized">
              {slots.map((slot) => {
                const isAdd = slot.index >= photos.length;
                if (isAdd) {
                  return (
                    <div
                      key="__add__"
                      className="absolute top-0"
                      style={{ left: slot.start, width: thumbSize, height: thumbSize }}
                    >
                      <AddPhotosDropzone size={thumbSize} />
                    </div>
                  );
                }
                const photo = photos[slot.index];
                if (!photo) return null;
                return (
                  <FilmStripThumb
                    key={photo.id}
                    photo={photo}
                    index={slot.index}
                    size={thumbSize}
                    left={slot.start}
                    active={photo.id === activePhotoId}
                    selected={selectedIds.includes(photo.id)}
                    onActivate={(e) => activateWithModifiers(photo.id, e)}
                    onToggleSelect={(e) => {
                      if (e.shiftKey) selectRangeTo(photo.id);
                      else toggleSelect(photo.id);
                    }}
                    onContextMenu={(e) => openContext(photo.id, e)}
                  />
                );
              })}
            </div>
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={null}>
          {draggingPhoto ? (
            <div
              className="overflow-hidden rounded-[12px] border-2 border-[var(--pe-primary)] shadow-2xl"
              style={{ width: thumbSize, height: thumbSize }}
            >
              <img src={draggingPhoto.thumb} alt="" className="h-full w-full object-cover" />
              <span className="pe-film-check" data-on="1">
                <Check className="h-3 w-3" />
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <FilmStripContextMenu
        open={ctx.open}
        x={ctx.x}
        y={ctx.y}
        photoName={ctxPhoto?.name ?? 'Photo'}
        selected={selectedIds.includes(ctx.photoId)}
        selectionCount={selectedIds.length}
        canPaste={Boolean(clipboard)}
        onClose={() => setCtx((c) => ({ ...c, open: false }))}
        onAction={onContextAction}
      />
    </div>
  );
}
