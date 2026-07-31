import { useEffect, useRef, useCallback, useState, type WheelEvent, type PointerEvent } from 'react';
import type { Adjustments, TransformState } from '../types';
import { useCanvasRenderer } from '../hooks/useCanvasRenderer';
import { cn } from '@/lib/utils';

type Props = {
  src: string;
  adjustments: Adjustments;
  transform: TransformState;
  identity?: boolean;
  zoom?: number;
  panX?: number;
  panY?: number;
  onReady?: () => void;
  onPanZoom?: (zoom: number, panX: number, panY: number) => void;
  interactive?: boolean;
  className?: string;
};

/**
 * Displays canvas-engine output with pan / wheel zoom / pinch zoom / double-tap reset.
 */
export function CanvasViewport({
  src,
  adjustments,
  transform,
  identity = false,
  zoom = 1,
  panX = 0,
  panY = 0,
  onReady,
  onPanZoom,
  interactive = true,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { buffer, version, ready, error } = useCanvasRenderer({
    src,
    adjustments,
    transform,
    identity,
  });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ dist: number; zoom: number } | null>(null);
  const lastTap = useRef(0);

  useEffect(() => {
    if (ready) onReady?.();
  }, [ready, onReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !buffer) return;

    const rect = container.getBoundingClientRect();
    const pad = 24;
    const availW = Math.max(100, rect.width - pad * 2);
    const availH = Math.max(100, rect.height - pad * 2);
    const scale = Math.min(availW / buffer.width, availH / buffer.height);
    const drawW = buffer.width * scale;
    const drawH = buffer.height * scale;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(drawW * dpr);
    canvas.height = Math.round(drawH * dpr);
    canvas.classList.add('pe-display-canvas');
    canvas.dataset.w = String(Math.round(drawW));
    canvas.dataset.h = String(Math.round(drawH));

    canvas.style.setProperty('--pe-display-w', `${Math.round(drawW)}px`);
    canvas.style.setProperty('--pe-display-h', `${Math.round(drawH)}px`);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, drawW, drawH);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(buffer, 0, 0, drawW, drawH);
  }, [buffer, version]);

  const onWheel = useCallback(
    (e: WheelEvent) => {
      if (!interactive || !onPanZoom) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      onPanZoom(Math.min(4, Math.max(0.25, zoom + delta)), panX, panY);
    },
    [interactive, onPanZoom, zoom, panX, panY],
  );

  const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.hypot(a.x - b.x, a.y - b.y);

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      if (!interactive || !onPanZoom) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

      if (pointers.current.size === 2) {
        const pts = [...pointers.current.values()];
        pinchStart.current = { dist: distance(pts[0]!, pts[1]!), zoom };
        setDragging(false);
        return;
      }

      const now = Date.now();
      if (now - lastTap.current < 280) {
        onPanZoom(1, 0, 0);
        lastTap.current = 0;
        return;
      }
      lastTap.current = now;

      setDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY, panX, panY };
    },
    [interactive, onPanZoom, zoom, panX, panY],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!interactive || !onPanZoom) return;
      if (!pointers.current.has(e.pointerId)) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.current.size === 2 && pinchStart.current) {
        const pts = [...pointers.current.values()];
        const dist = distance(pts[0]!, pts[1]!);
        const ratio = dist / Math.max(1, pinchStart.current.dist);
        const nextZoom = Math.min(4, Math.max(0.25, pinchStart.current.zoom * ratio));
        onPanZoom(nextZoom, panX, panY);
        return;
      }

      if (!dragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      onPanZoom(zoom, dragStart.current.panX + dx, dragStart.current.panY + dy);
    },
    [dragging, interactive, onPanZoom, zoom, panX, panY],
  );

  const onPointerUp = useCallback((e: PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) setDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'pe-touch-canvas relative flex h-full w-full items-center justify-center overflow-hidden',
        className,
      )}
      onWheel={onWheel}
    >
      {error ? (
        <p className="text-sm font-semibold text-[var(--pe-danger)]">{error}</p>
      ) : (
        <div
          className="pe-viewport-stage"
          data-dragging={dragging ? '1' : '0'}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            className="pe-viewport-transform"
            ref={(el) => {
              if (!el) return;
              el.style.setProperty('--pe-view-zoom', String(zoom));
              el.style.setProperty('--pe-view-pan-x', `${panX}px`);
              el.style.setProperty('--pe-view-pan-y', `${panY}px`);
            }}
          >
            <canvas
              ref={canvasRef}
              className="pe-display-canvas rounded-[var(--pe-radius)] shadow-[var(--pe-shadow-float)]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
