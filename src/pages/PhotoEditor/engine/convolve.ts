function clampByte(v: number) {
  return v < 0 ? 0 : v > 255 ? 255 : v | 0;
}

/** Separable box blur — fast approximate Gaussian for preview */
export function boxBlur(data: ImageData, radius: number): ImageData {
  const r = Math.max(0, Math.round(radius));
  if (r <= 0) return data;

  const { width, height } = data;
  const src = data.data;
  const tmp = new Uint8ClampedArray(src.length);
  const out = new Uint8ClampedArray(src.length);
  const w = r * 2 + 1;

  // Horizontal
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sr = 0;
      let sg = 0;
      let sb = 0;
      let sa = 0;
      for (let k = -r; k <= r; k++) {
        const xx = Math.min(width - 1, Math.max(0, x + k));
        const i = (y * width + xx) * 4;
        sr += src[i]!;
        sg += src[i + 1]!;
        sb += src[i + 2]!;
        sa += src[i + 3]!;
      }
      const o = (y * width + x) * 4;
      tmp[o] = sr / w;
      tmp[o + 1] = sg / w;
      tmp[o + 2] = sb / w;
      tmp[o + 3] = sa / w;
    }
  }

  // Vertical
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sr = 0;
      let sg = 0;
      let sb = 0;
      let sa = 0;
      for (let k = -r; k <= r; k++) {
        const yy = Math.min(height - 1, Math.max(0, y + k));
        const i = (yy * width + x) * 4;
        sr += tmp[i]!;
        sg += tmp[i + 1]!;
        sb += tmp[i + 2]!;
        sa += tmp[i + 3]!;
      }
      const o = (y * width + x) * 4;
      out[o] = sr / w;
      out[o + 1] = sg / w;
      out[o + 2] = sb / w;
      out[o + 3] = sa / w;
    }
  }

  return new ImageData(out, width, height);
}

/** Unsharp-mask style sharpen via 3×3 kernel blended by amount (0–100) */
export function sharpen(data: ImageData, amount: number): ImageData {
  if (amount <= 0) return data;
  const strength = Math.min(amount / 100, 1) * 1.2;
  const { width, height, data: src } = data;
  const out = new Uint8ClampedArray(src);
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sr = 0;
      let sg = 0;
      let sb = 0;
      let ki = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const i = ((y + ky) * width + (x + kx)) * 4;
          const kv = kernel[ki++]!;
          sr += src[i]! * kv;
          sg += src[i + 1]! * kv;
          sb += src[i + 2]! * kv;
        }
      }
      const o = (y * width + x) * 4;
      out[o] = clampByte(src[o]! * (1 - strength) + sr * strength);
      out[o + 1] = clampByte(src[o + 1]! * (1 - strength) + sg * strength);
      out[o + 2] = clampByte(src[o + 2]! * (1 - strength) + sb * strength);
    }
  }

  return new ImageData(out, width, height);
}
