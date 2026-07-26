import { useRef, useState } from 'react';
import type { AlbumElement, AlbumPage, PhotoElement, TextElement } from '../../types';
import { useEditorStore } from '../../store';
import { clamp } from '../../utils';
import { cn } from '@/lib/utils';
import {
  Trash2,
  Copy,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type DragMode = 'move' | 'resize' | null;

export function SpreadCanvas() {
  const album = useEditorStore((s) => s.album);
  const currentPageIndex = useEditorStore((s) => s.currentPageIndex);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const select = useEditorStore((s) => s.select);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const updateElementLive = useEditorStore((s) => s.updateElementLive);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const setPageIndex = useEditorStore((s) => s.setPageIndex);
  const deleteSelected = useEditorStore((s) => s.deleteSelected);
  const duplicateSelected = useEditorStore((s) => s.duplicateSelected);
  const updateElement = useEditorStore((s) => s.updateElement);

  const [drag, setDrag] = useState<{
    id: string;
    pageIndex: number;
    mode: DragMode;
    startX: number;
    startY: number;
    orig: AlbumElement;
  } | null>(null);

  if (!album) return null;

  const spreadStart = Math.floor(currentPageIndex / 2) * 2;
  const leftPage = album.pages[spreadStart] ?? null;
  const rightPage = album.pages[spreadStart + 1] ?? null;
  const totalPages = album.pages.length;
  const spreadLabel = rightPage
    ? `${spreadStart + 1} - ${spreadStart + 2}`
    : `${spreadStart + 1}`;

  const onPointerMove = (e: React.PointerEvent, pageEl: HTMLDivElement | null) => {
    if (!drag || !pageEl) return;
    const rect = pageEl.getBoundingClientRect();
    const dx = ((e.clientX - drag.startX) / rect.width) * 100;
    const dy = ((e.clientY - drag.startY) / rect.height) * 100;
    if (drag.mode === 'move') {
      updateElementLive(drag.id, {
        x: clamp(drag.orig.x + dx, 0, 95),
        y: clamp(drag.orig.y + dy, 0, 95),
      });
    } else if (drag.mode === 'resize') {
      updateElementLive(drag.id, {
        width: clamp(drag.orig.width + dx, 8, 100 - drag.orig.x),
        height: clamp(drag.orig.height + dy, 8, 100 - drag.orig.y),
      });
    }
  };

  const selected = useEditorStore.getState().getSelectedElements()[0];

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-[#EBEEF3]">
      <div className="flex flex-1 items-center justify-center overflow-auto p-4 sm:p-6">
        <div className="flex w-full max-w-[920px] items-stretch gap-0 shadow-[0_20px_50px_-20px_rgba(45,52,54,0.35)]">
          {leftPage && (
            <PageSurface
              page={leftPage}
              pageIndex={spreadStart}
              active={currentPageIndex === spreadStart}
              selectedIds={selectedIds}
              onActivate={() => setPageIndex(spreadStart)}
              onClear={clearSelection}
              onSelect={select}
              onDragStart={(payload) => {
                setPageIndex(spreadStart);
                pushHistory();
                setDrag(payload);
              }}
              onPointerMove={onPointerMove}
              onPointerUp={() => setDrag(null)}
              drag={drag}
            />
          )}
          {rightPage ? (
            <PageSurface
              page={rightPage}
              pageIndex={spreadStart + 1}
              active={currentPageIndex === spreadStart + 1}
              selectedIds={selectedIds}
              onActivate={() => setPageIndex(spreadStart + 1)}
              onClear={clearSelection}
              onSelect={select}
              onDragStart={(payload) => {
                setPageIndex(spreadStart + 1);
                pushHistory();
                setDrag(payload);
              }}
              onPointerMove={onPointerMove}
              onPointerUp={() => setDrag(null)}
              drag={drag}
              isRight
            />
          ) : (
            <div className="aspect-[3/4] w-1/2 rounded-r-sm bg-white/60" />
          )}
        </div>
      </div>

      {/* Floating page controls under spread */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-[#E8EAEF] bg-white/95 px-2 py-1 shadow-lg backdrop-blur">
          <button
            type="button"
            title="Delete"
            onClick={deleteSelected}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#EA5455] hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Duplicate"
            onClick={duplicateSelected}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#5B6472] hover:bg-[#F5F6F8]"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Lock"
            onClick={() => {
              if (!selected) return;
              updateElement(selected.id, { locked: !selected.locked });
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#5B6472] hover:bg-[#F5F6F8]"
          >
            {selected?.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
          </button>
          <div className="mx-1 h-4 w-px bg-[#E8EAEF]" />
          <button
            type="button"
            disabled={spreadStart <= 0}
            onClick={() => setPageIndex(Math.max(0, spreadStart - 2))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#5B6472] hover:bg-[#F5F6F8] disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[72px] text-center text-[11px] font-bold text-[#2D3436]">
            {spreadLabel} / {totalPages}
          </span>
          <button
            type="button"
            disabled={spreadStart + 2 >= totalPages}
            onClick={() => setPageIndex(Math.min(totalPages - 1, spreadStart + 2))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#5B6472] hover:bg-[#F5F6F8] disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PageSurface({
  page,
  pageIndex,
  active,
  selectedIds,
  onActivate,
  onClear,
  onSelect,
  onDragStart,
  onPointerMove,
  onPointerUp,
  drag,
  isRight,
}: {
  page: AlbumPage;
  pageIndex: number;
  active: boolean;
  selectedIds: string[];
  onActivate: () => void;
  onClear: () => void;
  onSelect: (ids: string[], additive?: boolean) => void;
  onDragStart: (payload: {
    id: string;
    pageIndex: number;
    mode: DragMode;
    startX: number;
    startY: number;
    orig: AlbumElement;
  }) => void;
  onPointerMove: (e: React.PointerEvent, el: HTMLDivElement | null) => void;
  onPointerUp: () => void;
  drag: { id: string; pageIndex: number } | null;
  isRight?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={cn(
        'relative aspect-[3/4] w-1/2 overflow-hidden',
        isRight ? 'rounded-r-sm' : 'rounded-l-sm',
        active && 'ring-1 ring-[#6B46FE]/30',
      )}
      style={{ background: page.background }}
      onClick={() => {
        onActivate();
        onClear();
      }}
      onPointerMove={(e) => {
        if (drag?.pageIndex === pageIndex) onPointerMove(e, ref.current);
      }}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {[...page.elements]
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((el) => {
          const selected = selectedIds.includes(el.id);
          return (
            <div
              key={el.id}
              className={cn(
                'absolute select-none',
                el.locked ? 'cursor-default' : 'cursor-move',
                selected && 'z-50',
              )}
              style={{
                left: `${el.x}%`,
                top: `${el.y}%`,
                width: `${el.width}%`,
                height: `${el.height}%`,
                transform: `rotate(${el.rotation}deg)`,
                zIndex: el.zIndex,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onActivate();
                onSelect([el.id], e.shiftKey);
              }}
              onPointerDown={(e) => {
                if (el.locked) return;
                e.stopPropagation();
                onActivate();
                onSelect([el.id], e.shiftKey);
                onDragStart({
                  id: el.id,
                  pageIndex,
                  mode: 'move',
                  startX: e.clientX,
                  startY: e.clientY,
                  orig: { ...el },
                });
                (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
              }}
            >
              {el.type === 'photo' ? <PhotoNode el={el} selected={selected} /> : <TextNode el={el} />}
              {selected && (
                <>
                  <div className="pointer-events-none absolute inset-0 rounded-sm ring-2 ring-[#6B46FE]" />
                  {(['nw', 'ne', 'sw', 'se'] as const).map((corner) => (
                    <div
                      key={corner}
                      className={cn(
                        'absolute h-2.5 w-2.5 rounded-full border-2 border-white bg-[#6B46FE] shadow',
                        corner === 'nw' && '-left-1.5 -top-1.5 cursor-nw-resize',
                        corner === 'ne' && '-right-1.5 -top-1.5 cursor-ne-resize',
                        corner === 'sw' && '-bottom-1.5 -left-1.5 cursor-sw-resize',
                        corner === 'se' && '-bottom-1.5 -right-1.5 cursor-se-resize',
                      )}
                      onPointerDown={(e) => {
                        if (el.locked) return;
                        e.stopPropagation();
                        onDragStart({
                          id: el.id,
                          pageIndex,
                          mode: 'resize',
                          startX: e.clientX,
                          startY: e.clientY,
                          orig: { ...el },
                        });
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          );
        })}
    </div>
  );
}

function PhotoNode({ el, selected }: { el: PhotoElement; selected: boolean }) {
  const scaleX = el.flipH ? -1 : 1;
  const scaleY = el.flipV ? -1 : 1;
  return (
    <div
      className="h-full w-full overflow-hidden"
      style={{
        opacity: el.opacity,
        borderRadius: el.borderRadius,
        boxShadow: el.shadow ? '0 8px 24px rgba(0,0,0,0.25)' : undefined,
        border: el.borderWidth ? `${el.borderWidth}px solid ${el.borderColor}` : undefined,
        outline: selected ? undefined : undefined,
      }}
    >
      <img
        src={el.url}
        alt=""
        draggable={false}
        className="h-full w-full object-cover pointer-events-none"
        style={{
          transform: `scale(${el.crop.zoom * scaleX}, ${el.crop.zoom * scaleY})`,
          transformOrigin: `${el.crop.x}% ${el.crop.y}%`,
        }}
      />
    </div>
  );
}

function TextNode({ el }: { el: TextElement }) {
  return (
    <div
      className="flex h-full w-full items-center overflow-hidden px-1"
      style={{
        fontFamily: el.fontFamily,
        fontSize: `clamp(10px, ${el.fontSize * 0.085}cqw, ${el.fontSize}px)`,
        fontWeight: el.fontWeight,
        fontStyle: el.fontStyle,
        textDecoration: el.textDecoration,
        letterSpacing: `${el.letterSpacing}px`,
        textAlign: el.textAlign,
        color: el.color,
        justifyContent:
          el.textAlign === 'center' ? 'center' : el.textAlign === 'right' ? 'flex-end' : 'flex-start',
      }}
    >
      <span className="w-full leading-tight">{el.content}</span>
    </div>
  );
}
