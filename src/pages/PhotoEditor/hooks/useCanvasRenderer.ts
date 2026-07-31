import { useEffect, useRef, useState } from 'react';
import type { Adjustments, TransformState } from '../types';
import { renderEdit } from '../engine';

type Params = {
  src: string;
  adjustments: Adjustments;
  transform: TransformState;
  identity?: boolean;
  maxEdge?: number;
  enabled?: boolean;
};

/**
 * Renders edits to an offscreen canvas via the HTML Canvas engine.
 * Original `src` is never mutated.
 */
export function useCanvasRenderer({
  src,
  adjustments,
  transform,
  identity = false,
  maxEdge = 1400,
  enabled = true,
}: Params) {
  const [version, setVersion] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [buffer, setBuffer] = useState<HTMLCanvasElement | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    if (!enabled || !src) return;

    const id = ++requestId.current;
    let cancelled = false;

    const run = async () => {
      try {
        const result = await renderEdit(src, adjustments, transform, {
          maxEdge,
          identity,
        });
        if (cancelled || id !== requestId.current) return;
        setBuffer(result.canvas);
        setError(null);
        setReady(true);
        setVersion((v) => v + 1);
      } catch (e) {
        if (cancelled || id !== requestId.current) return;
        setError(e instanceof Error ? e.message : 'Render failed');
        setReady(false);
      }
    };

    const raf = requestAnimationFrame(() => {
      void run();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [src, adjustments, transform, identity, maxEdge, enabled]);

  return {
    buffer,
    version,
    ready,
    error,
  };
}
