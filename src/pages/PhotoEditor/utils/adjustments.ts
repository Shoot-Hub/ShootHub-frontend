import type { Adjustments, EditSnapshot, TransformState } from '../types';
import { DEFAULT_ADJUSTMENTS, DEFAULT_TRANSFORM } from '../types';

export function mergeAdjustments(
  base: Adjustments,
  patch: Partial<Adjustments>,
): Adjustments {
  return { ...base, ...patch };
}

export function resetAdjustments(): Adjustments {
  return { ...DEFAULT_ADJUSTMENTS };
}

export function resetTransform(): TransformState {
  return { ...DEFAULT_TRANSFORM };
}

export function formatAdjustmentValue(key: keyof Adjustments, value: number): string {
  if (key === 'exposure') {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}`;
  }
  const sign = value > 0 ? '+' : '';
  return `${sign}${Math.round(value)}`;
}

export function areAdjustmentsEqual(a: Adjustments, b: Adjustments): boolean {
  return (Object.keys(DEFAULT_ADJUSTMENTS) as (keyof Adjustments)[]).every(
    (key) => a[key] === b[key],
  );
}

export function areTransformsEqual(a: TransformState, b: TransformState): boolean {
  return (
    a.x === b.x &&
    a.y === b.y &&
    a.width === b.width &&
    a.height === b.height &&
    a.rotation === b.rotation &&
    a.flipH === b.flipH &&
    a.flipV === b.flipV
  );
}

export function snapshotFromPhoto(photo: {
  adjustments: Adjustments;
  transform: TransformState;
  presetId: string | null;
  filterId: string | null;
}): EditSnapshot {
  return {
    adjustments: { ...photo.adjustments },
    transform: { ...photo.transform },
    presetId: photo.presetId,
    filterId: photo.filterId,
  };
}

/** Legacy CSS filter helper — canvas engine is primary; kept for filter thumbs */
export function adjustmentsToCssFilter(adj: Adjustments): string {
  const brightness = 1 + adj.exposure * 0.12 + adj.whites * 0.0015 - adj.blacks * 0.0012;
  const contrast = 1 + adj.contrast / 120;
  const saturate = 1 + (adj.saturation + adj.vibrance * 0.55) / 100;
  const hue = adj.temperature * 0.35 + adj.tint * 0.2;
  const blur = adj.blur > 0 ? Math.min(adj.blur / 40, 2) : 0;
  const parts = [
    `brightness(${brightness.toFixed(3)})`,
    `contrast(${contrast.toFixed(3)})`,
    `saturate(${saturate.toFixed(3)})`,
    `hue-rotate(${hue.toFixed(2)}deg)`,
  ];
  if (blur > 0.05) parts.push(`blur(${blur.toFixed(2)}px)`);
  return parts.join(' ');
}

export function getVignetteOpacity(adj: Adjustments): number {
  return Math.min(Math.max(adj.vignette / 100, 0), 0.85);
}
