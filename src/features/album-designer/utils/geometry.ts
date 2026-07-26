import type { AlbumOrientation } from '../types';

/** Aspect ratio width/height for page preview */
export function getPageAspect(orientation: AlbumOrientation, size: string): number {
  if (orientation === 'square' || size === '10x10' || size === '14x14') return 1;
  if (orientation === 'portrait') return 3 / 4;
  return 4 / 3;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function deepClone<T>(value: T): T {
  return structuredClone(value);
}
