import type { ExportFormat, ExportSettings, PhotoItem } from '../types';

export function exportMime(format: ExportFormat): 'image/jpeg' | 'image/png' | 'image/webp' {
  if (format === 'png') return 'image/png';
  if (format === 'webp') return 'image/webp';
  return 'image/jpeg';
}

export function stripExtension(name: string) {
  return name.replace(/\.[^.]+$/, '');
}

export function buildExportFilename(
  photo: PhotoItem,
  settings: ExportSettings,
  index: number,
  total: number,
) {
  const base = stripExtension(photo.name) || 'photo';
  const date = new Date().toISOString().slice(0, 10);
  const indexStr = String(index + 1).padStart(String(total).length, '0');

  let stem = settings.renameEnabled
    ? settings.renamePattern
        .replaceAll('{name}', base)
        .replaceAll('{index}', indexStr)
        .replaceAll('{date}', date)
        .trim()
    : base;

  stem = stem
    .split('')
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code < 32) return '_';
      if ('<>:"/\\|?*'.includes(ch)) return '_';
      return ch;
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
  if (!stem) stem = base;

  return `${stem}.${settings.format === 'jpg' ? 'jpg' : settings.format}`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke after the browser has a chance to start the download
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
