const cache = new Map<string, HTMLImageElement>();
const inflight = new Map<string, Promise<HTMLImageElement>>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  const hit = cache.get(src);
  if (hit?.complete && hit.naturalWidth > 0) return Promise.resolve(hit);

  const pending = inflight.get(src);
  if (pending) return pending;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => {
      cache.set(src, img);
      inflight.delete(src);
      resolve(img);
    };
    img.onerror = () => {
      inflight.delete(src);
      reject(new Error(`Failed to load image: ${src}`));
    };
    img.src = src;
  });

  inflight.set(src, promise);
  return promise;
}

export function getCachedImage(src: string): HTMLImageElement | null {
  const img = cache.get(src);
  return img?.complete && img.naturalWidth > 0 ? img : null;
}

export function clearImageCache(src?: string) {
  if (src) {
    cache.delete(src);
    inflight.delete(src);
    return;
  }
  cache.clear();
  inflight.clear();
}
