import { useRef, useState } from 'react';
import type { AlbumElement, PhotoElement, TextElement } from '../../types';
import { useEditorStore } from '../../store';
import { getPageAspect, clamp } from '../../utils';
import { cn } from '@/lib/utils';

type DragMode = 'move' | 'resize' | null;

export function AlbumCanvas() {
  const album = useEditorStore((s) => s.album);
  const currentPageIndex = useEditorStore((s) => s.currentPageIndex);
  const page = album?.pages[currentPageIndex] ?? null;
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const select = useEditorStore((s) => s.select);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const updateElementLive = useEditorStore((s) => s.updateElementLive);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{
    id: string;
    mode: DragMode;
    startX: number;
    startY: number;
    orig: AlbumElement;
  } | null>(null);

  if (!album || !page) return null;

  const aspect = getPageAspect(album.info.orientation, album.info.albumSize);

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
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

  const endDrag = () => setDrag(null);

  return (
    <div className="flex flex-1 items-center justify-center overflow-auto bg-[#E8EAED] p-4 sm:p-8">
      <div
        ref={canvasRef}
        className="relative w-full max-w-[720px] shadow-2xl shadow-black/20"
        style={{
          aspectRatio: `${aspect}`,
          background: page.background,
        }}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClick={() => clearSelection()}
      >
        {[...page.elements]
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((el) => {
            const selected = selectedIds.includes(el.id);
            return (
              <div
                key={el.id}
                className={cn(
                  'absolute cursor-move select-none',
                  selected && 'z-50 ring-2 ring-[#6B46FE] ring-offset-1',
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
                  select([el.id], e.shiftKey);
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  select([el.id], e.shiftKey);
                  pushHistory();
                  setDrag({
                    id: el.id,
                    mode: 'move',
                    startX: e.clientX,
                    startY: e.clientY,
                    orig: { ...el },
                  });
                  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
                }}
              >
                {el.type === 'photo' ? (
                  <PhotoNode el={el} />
                ) : (
                  <TextNode el={el} />
                )}
                {selected && (
                  <div
                    className="absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 cursor-se-resize rounded-sm border-2 border-white bg-[#6B46FE]"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      pushHistory();
                      setDrag({
                        id: el.id,
                        mode: 'resize',
                        startX: e.clientX,
                        startY: e.clientY,
                        orig: { ...el },
                      });
                    }}
                  />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

function PhotoNode({ el }: { el: PhotoElement }) {
  return (
    <div className="h-full w-full overflow-hidden rounded-sm" style={{ opacity: el.opacity }}>
      <img
        src={el.url}
        alt=""
        draggable={false}
        className="h-full w-full object-cover pointer-events-none"
        style={{
          transform: `scale(${el.crop.zoom})`,
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
        fontSize: `clamp(10px, ${el.fontSize * 0.08}cqw, ${el.fontSize}px)`,
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
