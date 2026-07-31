import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { animate, motion, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PhotoItem } from '../types';
import { DEFAULT_ADJUSTMENTS, DEFAULT_TRANSFORM } from '../types';
import { useCanvasRenderer } from '../hooks/useCanvasRenderer';
import { CompareLayerCanvas } from './CompareLayerCanvas';
import '../styles/compare.css';

const RESET_POS = 50;
const STEP = 2;
const STEP_LARGE = 10;

type Props = {
  photo: PhotoItem;
  onReady?: () => void;
};

function fitContain(
  containerW: number,
  containerH: number,
  contentW: number,
  contentH: number,
  pad = 16,
) {
  const availW = Math.max(80, containerW - pad * 2);
  const availH = Math.max(80, containerH - pad * 2);
  const scale = Math.min(availW / contentW, availH / contentH);
  return {
    w: Math.max(1, Math.round(contentW * scale)),
    h: Math.max(1, Math.round(contentH * scale)),
  };
}

/**
 * Professional Before/After compare:
 * - GPU clip-path slider (no canvas re-render while dragging)
 * - Pointer + touch + keyboard
 * - Double-click resets to 50% with spring
 * - High-DPI blit keeps sharpness
 */
export function BeforeAfterSlider({ photo, onReady }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [active, setActive] = useState(false);
  const [frameSize, setFrameSize] = useState({ w: 0, h: 0 });
  const [hintVisible, setHintVisible] = useState(true);
  const [ariaPos, setAriaPos] = useState(RESET_POS);

  const before = useCanvasRenderer({
    src: photo.src,
    adjustments: DEFAULT_ADJUSTMENTS,
    transform: DEFAULT_TRANSFORM,
    identity: true,
    maxEdge: 2200,
  });
  const after = useCanvasRenderer({
    src: photo.src,
    adjustments: photo.adjustments,
    transform: photo.transform,
    maxEdge: 2200,
  });

  const position = useMotionValue(RESET_POS);

  const applyCssPos = useCallback((pct: number) => {
    rootRef.current?.style.setProperty('--pe-compare-pos', `${pct}%`);
  }, []);

  useMotionValueEvent(position, 'change', (v) => {
    applyCssPos(v);
  });

  useEffect(() => {
    applyCssPos(position.get());
  }, [applyCssPos, position]);

  useEffect(() => {
    if (before.ready && after.ready) onReady?.();
  }, [before.ready, after.ready, onReady]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const measure = () => {
      const buffer = after.buffer ?? before.buffer;
      if (!buffer) return;
      const rect = root.getBoundingClientRect();
      const fitted = fitContain(rect.width, rect.height, buffer.width, buffer.height);
      setFrameSize(fitted);
      root.style.setProperty('--pe-compare-w', `${fitted.w}px`);
      root.style.setProperty('--pe-compare-h', `${fitted.h}px`);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [after.buffer, before.buffer, after.version, before.version]);

  const pctFromClientX = useCallback(
    (clientX: number) => {
      const frame = frameRef.current;
      if (!frame) return position.get();
      const rect = frame.getBoundingClientRect();
      if (rect.width <= 0) return position.get();
      return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    },
    [position],
  );

  const setPos = useCallback(
    (pct: number, withSpring = false, syncAria = false) => {
      const clamped = Math.min(100, Math.max(0, pct));
      if (withSpring) {
        void animate(position, clamped, {
          type: 'spring',
          stiffness: 380,
          damping: 32,
          mass: 0.55,
          onComplete: () => setAriaPos(Math.round(clamped)),
        });
      } else {
        position.set(clamped);
        if (syncAria) setAriaPos(Math.round(clamped));
      }
    },
    [position],
  );

  const endDrag = (el: HTMLElement, pointerId: number) => {
    dragging.current = false;
    setActive(false);
    setAriaPos(Math.round(position.get()));
    try {
      el.releasePointerCapture(pointerId);
    } catch {
      /* already released */
    }
  };

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragging.current = true;
    setActive(true);
    setHintVisible(false);
    e.currentTarget.setPointerCapture(e.pointerId);
    setPos(pctFromClientX(e.clientX));
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!dragging.current) return;
    setPos(pctFromClientX(e.clientX));
  };

  const onPointerUp = (e: PointerEvent<HTMLElement>) => {
    endDrag(e.currentTarget, e.pointerId);
  };

  const reset = () => setPos(RESET_POS, true, true);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const cur = position.get();
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        setPos(cur - (e.shiftKey ? STEP_LARGE : STEP), true, true);
        break;
      case 'ArrowRight':
        e.preventDefault();
        setPos(cur + (e.shiftKey ? STEP_LARGE : STEP), true, true);
        break;
      case 'Home':
        e.preventDefault();
        setPos(0, true, true);
        break;
      case 'End':
        e.preventDefault();
        setPos(100, true, true);
        break;
      case 'PageUp':
        e.preventDefault();
        setPos(cur - STEP_LARGE, true, true);
        break;
      case 'PageDown':
        e.preventDefault();
        setPos(cur + STEP_LARGE, true, true);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        reset();
        break;
      default:
        break;
    }
  };

  const ready = before.ready && after.ready && frameSize.w > 0;
  const error = before.error || after.error;

  return (
    <div
      ref={rootRef}
      className="pe-compare"
      role="slider"
      tabIndex={0}
      aria-label="Before and after comparison"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={ariaPos}
      aria-valuetext={`${ariaPos}% revealing after`}
      onKeyDown={onKeyDown}
      onDoubleClick={reset}
    >
      {error ? (
        <p className="flex h-full items-center justify-center text-sm font-semibold text-[var(--pe-danger)]">
          {error}
        </p>
      ) : (
        <div className="pe-compare-stage">
          <div
            ref={frameRef}
            className="pe-compare-frame"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {ready ? (
              <>
                <CompareLayerCanvas
                  buffer={before.buffer}
                  version={before.version}
                  width={frameSize.w}
                  height={frameSize.h}
                  className="pe-compare-layer"
                />
                <div className="pe-compare-after-clip">
                  <CompareLayerCanvas
                    buffer={after.buffer}
                    version={after.version}
                    width={frameSize.w}
                    height={frameSize.h}
                    className="pe-compare-layer"
                  />
                </div>

                <div className="pe-compare-divider" aria-hidden />

                <motion.button
                  type="button"
                  className="pe-compare-handle"
                  data-active={active ? '1' : '0'}
                  aria-label="Drag to compare. Double-click or press Enter to reset."
                  whileTap={{ scale: 0.94 }}
                  whileHover={{ scale: 1.06 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    reset();
                  }}
                >
                  <span className="flex items-center" aria-hidden>
                    <ChevronLeft className="h-3.5 w-3.5 opacity-90" />
                    <ChevronRight className="h-3.5 w-3.5 opacity-90" />
                  </span>
                </motion.button>

                <span className="pe-compare-label pe-compare-label--before">Before</span>
                <span className="pe-compare-label pe-compare-label--after">After</span>

                {hintVisible ? (
                  <span className="pe-compare-hint">Drag · ← → · Double-click reset</span>
                ) : null}
              </>
            ) : (
              <div className="flex h-full min-h-[200px] w-full items-center justify-center">
                <div className="pe-skeleton h-48 w-72 rounded-[var(--pe-radius)]" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
