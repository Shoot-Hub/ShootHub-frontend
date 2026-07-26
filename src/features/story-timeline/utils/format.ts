import type { Photo } from '@/pages/Gallery/types';

export function formatCompactCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return n.toLocaleString();
}

export function parseCoupleNames(galleryName: string): { left: string; right: string } | null {
  const andMatch = galleryName.match(/^(.+?)\s*[&+]\s*(.+?)(?:\s+Wedding)?$/i);
  if (andMatch) {
    return { left: andMatch[1].trim(), right: andMatch[2].replace(/\s+Wedding$/i, '').trim() };
  }
  return null;
}

export function buildCoupleLine(galleryName: string): string {
  const couple = parseCoupleNames(galleryName);
  if (couple) return `${couple.left} ❤️ ${couple.right}`;
  return galleryName;
}

export function formatDurationFromIndex(index: number): string {
  const total = 45 + (index % 90);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function pickPreviewPhotos(photos: Photo[], count = 4): Photo[] {
  if (photos.length <= count) return photos;
  const step = Math.max(1, Math.floor(photos.length / count));
  const picked: Photo[] = [];
  for (let i = 0; i < photos.length && picked.length < count; i += step) {
    picked.push(photos[i]);
  }
  return picked.slice(0, count);
}

export function deriveVideoCount(photoCount: number): number {
  if (photoCount <= 0) return 0;
  return Math.max(1, Math.round(photoCount / 45));
}

export function deriveDownloadCount(photoCount: number, favorites: number): number {
  return Math.round(photoCount * 0.12 + favorites * 0.4);
}

export function deriveCommentCount(photoCount: number): number {
  return Math.round(photoCount * 0.04);
}
