import { useRef, useState } from 'react';
import type { AlbumElement, AlbumPage, PhotoElement, TextElement } from '../../types';
import { useEditorStore, useEditorUiStore } from '../../store';
import { clamp, getPagePhotoCapacity } from '../../utils';
import { cn } from '@/lib/utils';
import {
  Trash2,
  Copy,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  Images,
} from 'lucide-react';

type DragMode = 'move' | 'resize' | null;

const SNAP = 2;

function snapValue(v: number, enabled: boolean) {
  if (!enabled) return v;
  const targets = [0, 25, 50, 75, 100];
  for (const t of targets) {
    if (Math.abs(v - t) <= SNAP) return t;
  }
  return Math.round(v / SNAP) * SNAP;
}

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
  const zoom = useEditorUiStore((s) => s.zoom);
  const showGrid = useEditorUiStore((s) => s.showGrid);
  const showGuides = useEditorUiStore((s) => s.showGuides);
  const showSafeArea = useEditorUiStore((s) => s.showSafeArea);
  const showBleed = useEditorUiStore((s) => s.showBleed);
  const showRulers = useEditorUiStore((s) => s.showRulers);
  const showPrintMargin = useEditorUiStore((s) => s.showPrintMargin);
  const spacePanning = useEditorUiStore((s) => s.spacePanning);

  const [drag, setDrag] = useState<{
    id: string;
    pageIndex: number;
    mode: DragMode;
    startX: number;
    startY: number;
    orig: AlbumElement;
  } | null>(null);
  const [guideLines, setGuideLines] = useState<{ v?: number; h?: number }>({});
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  if (!album) return null;

  const spreadStart = Math.floor(currentPageIndex / 2) * 2;
  const leftPage = album.pages[spreadStart] ?? null;
  const rightPage = album.pages[spreadStart + 1] ?? null;
  const totalPages = album.pages.length;
  const spreadLabel = rightPage
    ? `${spreadStart + 1} – ${spreadStart + 2}`
    : `${spreadStart + 1}`;

  const onPointerMove = (e: React.PointerEvent, pageEl: HTMLDivElement | null) => {
    if (!drag || !pageEl) return;
    const rect = pageEl.getBoundingClientRect();
    const dx = ((e.clientX - drag.startX) / rect.width) * 100;
    const dy = ((e.clientY - drag.startY) / rect.height) * 100;
    if (drag.mode === 'move') {
      const x = snapValue(clamp(drag.orig.x + dx, 0, 95), showGuides);
      const y = snapValue(clamp(drag.orig.y + dy, 0, 95), showGuides);
      updateElementLive(drag.id, { x, y });
      setGuideLines({
        v: x === 50 || Math.abs(x + drag.orig.width / 2 - 50) < 1 ? 50 : undefined,
        h: y === 50 || Math.abs(y + drag.orig.height / 2 - 50) < 1 ? 50 : undefined,
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
    <div
      ref={workspaceRef}
      className={cn(
        'relative flex min-h-0 flex-1 flex-col overflow-hidden',
        'bg-[radial-gradient(ellipse_at_top,_#F3EEFF_0%,_#F4F5F8_45%,_#EBEEF3_100%)]',
        spacePanning ? 'cursor-grab active:cursor-grabbing' : undefined,
      )}
      onPointerDown={(e) => {
        if (!spacePanning) return;
        panStart.current = { x: e.clientX, y: e.clientY, ox: pan.x, oy: pan.y };
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!panStart.current || !spacePanning) return;
        setPan({
          x: panStart.current.ox + (e.clientX - panStart.current.x),
          y: panStart.current.oy + (e.clientY - panStart.current.y),
        });
      }}
      onPointerUp={() => {
        panStart.current = null;
      }}
    >
      {showRulers ? (
        <>
          <div className="pointer-events-none absolute inset-x-8 top-0 z-10 h-5 bg-[linear-gradient(90deg,#E8EAEF_1px,transparent_1px)] bg-[length:24px_100%] opacity-70" />
          <div className="pointer-events-none absolute inset-y-8 left-0 z-10 w-5 bg-[linear-gradient(180deg,#E8EAEF_1px,transparent_1px)] bg-[length:100%_24px] opacity-70" />
        </>
      ) : null}

      <div className="flex flex-1 items-center justify-center overflow-auto p-4 sm:p-8">
        <div
          className="relative transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
            transformOrigin: 'center center',
          }}
        >
          <div className="flex w-[min(92vw,920px)] items-stretch gap-0 rounded-[4px] shadow-[var(--ad-shadow-float)] ring-1 ring-black/5">
            {leftPage && (
              <PageSurface
                page={leftPage}
                pageIndex={spreadStart}
                pageLabel={`Page ${spreadStart + 1}`}
                active={currentPageIndex === spreadStart}
                selectedIds={selectedIds}
                showGrid={showGrid}
                showSafeArea={showSafeArea}
                showBleed={showBleed}
                showPrintMargin={showPrintMargin}
                guideLines={drag?.pageIndex === spreadStart ? guideLines : {}}
                onActivate={() => setPageIndex(spreadStart)}
                onClear={clearSelection}
                onSelect={select}
                onDragStart={(payload) => {
                  setPageIndex(spreadStart);
                  pushHistory();
                  setDrag(payload);
                }}
                onPointerMove={onPointerMove}
                onPointerUp={() => {
                  setDrag(null);
                  setGuideLines({});
                }}
                drag={drag}
              />
            )}
            {rightPage ? (
              <PageSurface
                page={rightPage}
                pageIndex={spreadStart + 1}
                pageLabel={`Page ${spreadStart + 2}`}
                active={currentPageIndex === spreadStart + 1}
                selectedIds={selectedIds}
                showGrid={showGrid}
                showSafeArea={showSafeArea}
                showBleed={showBleed}
                showPrintMargin={showPrintMargin}
                guideLines={drag?.pageIndex === spreadStart + 1 ? guideLines : {}}
                onActivate={() => setPageIndex(spreadStart + 1)}
                onClear={clearSelection}
                onSelect={select}
                onDragStart={(payload) => {
                  setPageIndex(spreadStart + 1);
                  pushHistory();
                  setDrag(payload);
                }}
                onPointerMove={onPointerMove}
                onPointerUp={() => {
                  setDrag(null);
                  setGuideLines({});
                }}
                drag={drag}
                isRight
              />
            ) : (
              <div className="aspect-[3/4] w-1/2 rounded-r-[4px] bg-white/50" />
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
        <div className="pointer-events-auto ad-glass flex items-center gap-1 rounded-full px-2 py-1">
          <button
            type="button"
            title="Delete"
            onClick={deleteSelected}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--ad-danger)] hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Duplicate"
            onClick={duplicateSelected}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--ad-ink-soft)] hover:bg-[#F5F6F8]"
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
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--ad-ink-soft)] hover:bg-[#F5F6F8]"
          >
            {selected?.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
          </button>
          <div className="mx-1 h-4 w-px bg-[var(--ad-border)]" />
          <button
            type="button"
            disabled={spreadStart <= 0}
            onClick={() => setPageIndex(Math.max(0, spreadStart - 2))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--ad-ink-soft)] hover:bg-[#F5F6F8] disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[84px] text-center text-[11px] font-bold text-[var(--ad-ink)]">
            {spreadLabel} / {totalPages}
          </span>
          <button
            type="button"
            disabled={spreadStart + 2 >= totalPages}
            onClick={() => setPageIndex(Math.min(totalPages - 1, spreadStart + 2))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--ad-ink-soft)] hover:bg-[#F5F6F8] disabled:opacity-30"
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
  pageLabel,
  active,
  selectedIds,
  showGrid,
  showSafeArea,
  showBleed,
  showPrintMargin,
  guideLines,
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
  pageLabel: string;
  active: boolean;
  selectedIds: string[];
  showGrid: boolean;
  showSafeArea: boolean;
  showBleed: boolean;
  showPrintMargin: boolean;
  guideLines: { v?: number; h?: number };
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
  const capacity = getPagePhotoCapacity(page);

  return (
    <div
      ref={ref}
      className={cn(
        'relative aspect-[3/4] w-1/2 overflow-hidden',
        isRight ? 'rounded-r-[4px]' : 'rounded-l-[4px]',
        active && 'ring-2 ring-[var(--ad-primary)]/35',
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
      <div className="pointer-events-none absolute left-2 top-2 z-30 flex items-center gap-1.5">
        <span className="rounded-full bg-black/45 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur">
          {pageLabel}
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold backdrop-blur',
            capacity.full ? 'bg-red-500/90 text-white' : 'bg-white/90 text-[var(--ad-ink)]',
          )}
        >
          <Images className="h-2.5 w-2.5" />
          {capacity.used}/{capacity.max}
        </span>
      </div>
      {showGrid ? <div className="ad-grid-overlay pointer-events-none absolute inset-0" /> : null}
      {showBleed ? <div className="ad-bleed-area pointer-events-none absolute inset-[1.5%]" /> : null}
      {showPrintMargin ? <div className="ad-print-margin pointer-events-none absolute inset-[4%]" /> : null}
      {showSafeArea ? <div className="ad-safe-area pointer-events-none absolute inset-[7%]" /> : null}
      {guideLines.v != null ? (
        <div
          className="pointer-events-none absolute inset-y-0 z-40 w-px bg-[var(--ad-primary)]"
          style={{ left: `${guideLines.v}%` }}
        />
      ) : null}
      {guideLines.h != null ? (
        <div
          className="pointer-events-none absolute inset-x-0 z-40 h-px bg-[var(--ad-primary)]"
          style={{ top: `${guideLines.h}%` }}
        />
      ) : null}

      {[...page.elements]
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((el) => {
          const selected = selectedIds.includes(el.id);
          return (
            <div
              key={el.id}
              className={cn(
                'absolute select-none transition-shadow',
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
              {el.type === 'photo' ? <PhotoNode el={el} /> : <TextNode el={el} />}
              {selected ? (
                <>
                  <div className="pointer-events-none absolute inset-0 rounded-sm ring-2 ring-[var(--ad-primary)]" />
                  {(['nw', 'ne', 'sw', 'se'] as const).map((corner) => (
                    <div
                      key={corner}
                      className={cn(
                        'absolute h-2.5 w-2.5 rounded-full border-2 border-white bg-[var(--ad-primary)] shadow',
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
              ) : null}
            </div>
          );
        })}
    </div>
  );
}

function PhotoNode({ el }: { el: PhotoElement }) {
  const scaleX = el.flipH ? -1 : 1;
  const scaleY = el.flipV ? -1 : 1;
  return (
    <div
      className="h-full w-full overflow-hidden"
      style={{
        opacity: el.opacity,
        borderRadius: el.borderRadius,
        boxShadow: el.shadow ? '0 12px 32px rgba(0,0,0,0.22)' : undefined,
        border: el.borderWidth ? `${el.borderWidth}px solid ${el.borderColor}` : undefined,
      }}
    >
      <img
        src={el.url}
        alt=""
        draggable={false}
        className="pointer-events-none h-full w-full object-cover"
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
