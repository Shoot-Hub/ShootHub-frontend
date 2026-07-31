const FPS = 30;

export function framesToTimecode(frames: number, fps = FPS): string {
  const totalSeconds = Math.max(0, frames) / fps;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const f = Math.floor(Math.max(0, frames) % fps);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
}

export function secondsToDisplay(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function estimateExportSizeMb(
  resolution: '1080p' | '2k' | '4k',
  fps: 24 | 30 | 60,
  durationSec: number,
): number {
  const bitrateMbps =
    resolution === '4k' ? 45 : resolution === '2k' ? 28 : 16;
  const fpsFactor = fps === 60 ? 1.4 : fps === 30 ? 1 : 0.85;
  return Math.round(bitrateMbps * fpsFactor * (durationSec / 8) * 10) / 10;
}

export function createId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export { FPS };
