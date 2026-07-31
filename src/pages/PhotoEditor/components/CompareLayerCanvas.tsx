import { useLayoutEffect, useRef } from 'react';
import { paintBufferToCanvas } from '../utils';

type Props = {
  buffer: HTMLCanvasElement | null;
  version: number;
  width: number;
  height: number;
  className?: string;
};

export function CompareLayerCanvas({ buffer, version, width, height, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas || !buffer || width <= 0 || height <= 0) return;
    paintBufferToCanvas(canvas, buffer, width, height);
  }, [buffer, version, width, height]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
