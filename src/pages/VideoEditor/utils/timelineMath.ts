import type { TimelineClip } from '../types';
import { VE_CONSTANTS } from './constants';

export function clipEnd(clip: Pick<TimelineClip, 'startFrame' | 'durationFrames'>): number {
  return clip.startFrame + clip.durationFrames;
}

export function clipsOverlap(
  a: Pick<TimelineClip, 'startFrame' | 'durationFrames'>,
  b: Pick<TimelineClip, 'startFrame' | 'durationFrames'>,
): boolean {
  return a.startFrame < clipEnd(b) && b.startFrame < clipEnd(a);
}

export function collectSnapTargets(
  clips: TimelineClip[],
  excludeId: string | null,
  totalFrames: number,
): number[] {
  const targets = new Set<number>([0, totalFrames]);
  for (const clip of clips) {
    if (clip.id === excludeId) continue;
    targets.add(clip.startFrame);
    targets.add(clipEnd(clip));
  }
  return [...targets].sort((a, b) => a - b);
}

export function snapFrame(
  frame: number,
  targets: number[],
  enabled: boolean,
  threshold = VE_CONSTANTS.SNAP_THRESHOLD_FRAMES,
): { frame: number; snapped: boolean } {
  if (!enabled || targets.length === 0) {
    return { frame: Math.max(0, Math.round(frame)), snapped: false };
  }
  let best = Math.round(frame);
  let bestDist = threshold + 1;
  for (const t of targets) {
    const dist = Math.abs(t - frame);
    if (dist < bestDist) {
      bestDist = dist;
      best = t;
    }
  }
  if (bestDist <= threshold) {
    return { frame: best, snapped: true };
  }
  return { frame: Math.max(0, Math.round(frame)), snapped: false };
}

/** Resolve a non-overlapping start: prefer desired, else nearest gap before/after. */
export function resolveNonOverlappingStart(
  trackClips: TimelineClip[],
  excludeId: string | null,
  desiredStart: number,
  duration: number,
): number {
  const start = Math.max(0, Math.round(desiredStart));
  const others = trackClips
    .filter((c) => c.id !== excludeId)
    .sort((a, b) => a.startFrame - b.startFrame);

  const candidate = { startFrame: start, durationFrames: duration };
  const hit = others.find((o) => clipsOverlap(candidate, o));
  if (!hit) return start;

  const after = clipEnd(hit);
  const before = hit.startFrame - duration;

  // Prefer the side closer to the desired start
  const afterDist = Math.abs(after - start);
  const beforeDist = before >= 0 ? Math.abs(before - start) : Number.POSITIVE_INFINITY;

  if (beforeDist <= afterDist && before >= 0) {
    const beforeCandidate = { startFrame: before, durationFrames: duration };
    const stillHits = others.some((o) => clipsOverlap(beforeCandidate, o));
    if (!stillHits) return before;
  }

  // Walk forward until a free slot is found
  let cursor = after;
  let guard = 0;
  while (guard < 64) {
    guard += 1;
    const next = { startFrame: cursor, durationFrames: duration };
    const blocker = others.find((o) => clipsOverlap(next, o));
    if (!blocker) return cursor;
    cursor = clipEnd(blocker);
  }
  return cursor;
}

/**
 * Topmost clip at frame. `trackIds` should be ordered top → bottom
 * (as displayed in the timeline).
 */
export function findClipAtFrame(
  clips: TimelineClip[],
  trackIds: string[],
  frame: number,
): TimelineClip | null {
  for (const trackId of trackIds) {
    const hit = clips.find(
      (c) =>
        !c.disabled &&
        c.trackId === trackId &&
        frame >= c.startFrame &&
        frame < clipEnd(c),
    );
    if (hit) return hit;
  }
  return null;
}

export function pixelsToFrame(px: number, pixelsPerFrame: number): number {
  return Math.max(0, Math.round(px / pixelsPerFrame));
}

export function frameToPixels(frame: number, pixelsPerFrame: number): number {
  return frame * pixelsPerFrame;
}
