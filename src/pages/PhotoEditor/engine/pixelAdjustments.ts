import type { Adjustments } from '../types';

function clamp(v: number, min = 0, max = 255) {
  return v < min ? min : v > max ? max : v;
}

function luminance(r: number, g: number, b: number) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * In-place pixel tone/color pipeline.
 * Original image is never mutated — operates on a working ImageData copy.
 */
export function applyToneAdjustments(data: ImageData, adj: Adjustments): void {
  const exposureMul = Math.pow(2, adj.exposure);
  const contrast = adj.contrast / 100;
  const contrastFactor = Math.tan(((contrast + 1) * Math.PI) / 4);
  const highlights = adj.highlights / 100;
  const shadows = adj.shadows / 100;
  const whites = adj.whites / 100;
  const blacks = adj.blacks / 100;
  const temp = adj.temperature / 100;
  const tint = adj.tint / 100;
  const sat = adj.saturation / 100;
  const vib = adj.vibrance / 100;

  const px = data.data;
  const len = px.length;

  for (let i = 0; i < len; i += 4) {
    let r = px[i]!;
    let g = px[i + 1]!;
    let b = px[i + 2]!;

    r *= exposureMul;
    g *= exposureMul;
    b *= exposureMul;

    r = (r - 128) * contrastFactor + 128;
    g = (g - 128) * contrastFactor + 128;
    b = (b - 128) * contrastFactor + 128;

    let lum = luminance(r, g, b) / 255;

    if (highlights !== 0 && lum > 0.5) {
      const t = (lum - 0.5) * 2;
      const amt = highlights * t;
      r -= (r - 128) * amt * 0.55;
      g -= (g - 128) * amt * 0.55;
      b -= (b - 128) * amt * 0.55;
    }

    if (shadows !== 0 && lum < 0.5) {
      const t = 1 - lum * 2;
      const amt = shadows * t;
      r += (255 - r) * amt * 0.35;
      g += (255 - g) * amt * 0.35;
      b += (255 - b) * amt * 0.35;
    }

    lum = luminance(r, g, b) / 255;

    if (whites !== 0) {
      const t = Math.pow(lum, 1.6);
      r += 40 * whites * t;
      g += 40 * whites * t;
      b += 40 * whites * t;
    }
    if (blacks !== 0) {
      const t = Math.pow(1 - lum, 1.6);
      r -= 40 * blacks * t;
      g -= 40 * blacks * t;
      b -= 40 * blacks * t;
    }

    if (temp !== 0) {
      r += 30 * temp;
      b -= 30 * temp;
    }

    if (tint !== 0) {
      g += 25 * tint;
      r -= 12 * tint;
      b -= 12 * tint;
    }

    if (sat !== 0) {
      const gray = luminance(r, g, b);
      r = gray + (r - gray) * (1 + sat);
      g = gray + (g - gray) * (1 + sat);
      b = gray + (b - gray) * (1 + sat);
    }

    if (vib !== 0) {
      const maxc = Math.max(r, g, b);
      const minc = Math.min(r, g, b);
      const satLevel = maxc === 0 ? 0 : (maxc - minc) / maxc;
      const amount = vib * (1 - satLevel);
      const gray = luminance(r, g, b);
      r = gray + (r - gray) * (1 + amount);
      g = gray + (g - gray) * (1 + amount);
      b = gray + (b - gray) * (1 + amount);
    }

    px[i] = clamp(r);
    px[i + 1] = clamp(g);
    px[i + 2] = clamp(b);
  }
}

export function applyVignette(data: ImageData, amount: number): void {
  if (amount <= 0) return;
  const strength = Math.min(amount / 100, 1);
  const { width, height, data: px } = data;
  const cx = width / 2;
  const cy = height / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const d = Math.sqrt(dx * dx + dy * dy) / maxDist;
      const falloff = Math.pow(d, 1.8) * strength;
      const mul = 1 - falloff * 0.85;
      px[i] = clamp(px[i]! * mul);
      px[i + 1] = clamp(px[i + 1]! * mul);
      px[i + 2] = clamp(px[i + 2]! * mul);
    }
  }
}
