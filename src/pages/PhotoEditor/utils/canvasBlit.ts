/** Device-pixel-aware blit for compare / preview canvases. */
export function paintBufferToCanvas(
  target: HTMLCanvasElement,
  buffer: HTMLCanvasElement,
  cssW: number,
  cssH: number,
) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const tw = Math.max(1, Math.round(cssW * dpr));
  const th = Math.max(1, Math.round(cssH * dpr));
  if (target.width !== tw || target.height !== th) {
    target.width = tw;
    target.height = th;
  }
  const ctx = target.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, tw, th);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(buffer, 0, 0, tw, th);
}
