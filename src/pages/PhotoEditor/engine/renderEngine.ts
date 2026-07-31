import type { Adjustments, TransformState } from '../types';
import { DEFAULT_ADJUSTMENTS, DEFAULT_TRANSFORM } from '../types';
import { loadImage } from './imageLoader';
import { applyToneAdjustments, applyVignette } from './pixelAdjustments';
import { boxBlur, sharpen } from './convolve';

export type RenderOptions = {
  /** Cap longest edge for interactive preview (default 1400) */
  maxEdge?: number;
  /** Skip tone pipeline — for before/compare */
  identity?: boolean;
};

export type RenderResult = {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
};

function hasToneWork(adj: Adjustments) {
  return (Object.keys(DEFAULT_ADJUSTMENTS) as (keyof Adjustments)[]).some(
    (k) => adj[k] !== DEFAULT_ADJUSTMENTS[k],
  );
}

function cropPixels(
  imgW: number,
  imgH: number,
  transform: TransformState,
): { sx: number; sy: number; sw: number; sh: number } {
  const sx = (transform.x / 100) * imgW;
  const sy = (transform.y / 100) * imgH;
  const sw = (transform.width / 100) * imgW;
  const sh = (transform.height / 100) * imgH;
  return {
    sx: Math.max(0, sx),
    sy: Math.max(0, sy),
    sw: Math.max(1, Math.min(sw, imgW - sx)),
    sh: Math.max(1, Math.min(sh, imgH - sy)),
  };
}

function fitSize(w: number, h: number, maxEdge: number) {
  const edge = Math.max(w, h);
  if (edge <= maxEdge) return { w: Math.round(w), h: Math.round(h), scale: 1 };
  const scale = maxEdge / edge;
  return { w: Math.max(1, Math.round(w * scale)), h: Math.max(1, Math.round(h * scale)), scale };
}

/**
 * Non-destructive render: original image is only read, never written.
 * Pipeline: crop → rotate/flip → tone → blur → sharpen → vignette
 */
export async function renderEdit(
  sourceSrc: string,
  adjustments: Adjustments = DEFAULT_ADJUSTMENTS,
  transform: TransformState = DEFAULT_TRANSFORM,
  options: RenderOptions = {},
): Promise<RenderResult> {
  const img = await loadImage(sourceSrc);
  const maxEdge = options.maxEdge ?? 1400;
  const identity = options.identity ?? false;

  const { sx, sy, sw, sh } = cropPixels(img.naturalWidth, img.naturalHeight, transform);
  const rotation = ((transform.rotation % 360) + 360) % 360;
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  const rotW = sw * cos + sh * sin;
  const rotH = sw * sin + sh * cos;

  const fitted = fitSize(rotW, rotH, maxEdge);
  const canvas = document.createElement('canvas');
  canvas.width = fitted.w;
  canvas.height = fitted.h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D unavailable');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, fitted.w, fitted.h);

  // Draw transformed crop into working canvas
  ctx.save();
  ctx.translate(fitted.w / 2, fitted.h / 2);
  ctx.rotate(rad);
  ctx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);
  const dw = sw * fitted.scale;
  const dh = sh * fitted.scale;
  ctx.drawImage(img, sx, sy, sw, sh, -dw / 2, -dh / 2, dw, dh);
  ctx.restore();

  if (identity || !hasToneWork(adjustments)) {
    return { canvas, width: fitted.w, height: fitted.h };
  }

  let imageData = ctx.getImageData(0, 0, fitted.w, fitted.h);
  applyToneAdjustments(imageData, adjustments);

  if (adjustments.blur > 0) {
    const radius = Math.max(1, Math.round((adjustments.blur / 100) * 8));
    imageData = boxBlur(imageData, radius);
  }

  if (adjustments.sharpen > 0) {
    imageData = sharpen(imageData, adjustments.sharpen);
  }

  if (adjustments.vignette > 0) {
    applyVignette(imageData, adjustments.vignette);
  }

  ctx.putImageData(imageData, 0, 0);
  return { canvas, width: fitted.w, height: fitted.h };
}

/** Draw a rendered canvas into a display canvas, clearing first */
export function blitToDisplay(
  target: HTMLCanvasElement,
  source: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  target.width = Math.max(1, Math.round(cssWidth * dpr));
  target.height = Math.max(1, Math.round(cssHeight * dpr));
  target.style.setProperty('--pe-display-w', `${cssWidth}px`);
  target.style.setProperty('--pe-display-h', `${cssHeight}px`);
  const ctx = target.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssWidth, cssHeight);
  ctx.drawImage(source, 0, 0, cssWidth, cssHeight);
}

function drawWatermark(
  canvas: HTMLCanvasElement,
  text: string,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx || !text.trim()) return;
  const w = canvas.width;
  const h = canvas.height;
  const size = Math.max(14, Math.round(Math.min(w, h) * 0.032));
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.font = `600 ${size}px "Segoe UI", system-ui, sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = Math.max(4, Math.round(size * 0.35));
  ctx.shadowOffsetY = 1;
  const pad = Math.max(12, Math.round(Math.min(w, h) * 0.028));
  ctx.fillText(text.trim(), w - pad, h - pad);
  ctx.restore();
}

export type ExportBlobOptions = {
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality?: number;
  maxEdge?: number;
  watermark?: boolean;
  watermarkText?: string;
};

export async function exportEditedBlob(
  sourceSrc: string,
  adjustments: Adjustments,
  transform: TransformState,
  formatOrOptions: 'image/jpeg' | 'image/png' | 'image/webp' | ExportBlobOptions,
  quality = 0.92,
  maxEdge = 4000,
): Promise<Blob> {
  const options: ExportBlobOptions =
    typeof formatOrOptions === 'string'
      ? { format: formatOrOptions, quality, maxEdge }
      : formatOrOptions;

  const { canvas } = await renderEdit(sourceSrc, adjustments, transform, {
    maxEdge: options.maxEdge ?? 4000,
  });

  if (options.watermark) {
    drawWatermark(canvas, options.watermarkText || 'ShootHub');
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Export failed'))),
      options.format,
      options.quality ?? 0.92,
    );
  });
}
