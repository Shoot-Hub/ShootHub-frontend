import type { Album, AlbumPage, PhotoElement } from '../types';
import { LAYOUT_PRESETS, type LayoutPreset } from '../data';
import { getTemplate } from '../constants';
import { createBlankPage, createDefaultText, createPhotoElement } from './albumFactory';
import { createId } from './id';
import { deepClone } from './geometry';

/** Recommended max photos that fit cleanly on one album page */
export const MAX_PHOTOS_PER_PAGE = 10;

/** Soft ideal for premium wedding spreads */
export const IDEAL_PHOTOS_PER_PAGE = 4;

export function getPagePhotoCount(page: AlbumPage): number {
  return page.elements.filter((e) => e.type === 'photo').length;
}

export function getPagePhotoCapacity(page: AlbumPage): {
  used: number;
  max: number;
  remaining: number;
  full: boolean;
} {
  const used = getPagePhotoCount(page);
  const max = MAX_PHOTOS_PER_PAGE;
  return { used, max, remaining: Math.max(0, max - used), full: used >= max };
}

function pickLayoutForCount(n: number): LayoutPreset {
  const exact = LAYOUT_PRESETS.find((l) => l.slots.length === n);
  if (exact) return exact;
  const sorted = [...LAYOUT_PRESETS].sort(
    (a, b) => Math.abs(a.slots.length - n) - Math.abs(b.slots.length - n),
  );
  return sorted[0] ?? LAYOUT_PRESETS[0];
}

function layoutCycle(): LayoutPreset[] {
  return [
    LAYOUT_PRESETS.find((l) => l.id === 'single-framed')!,
    LAYOUT_PRESETS.find((l) => l.id === 'two-split')!,
    LAYOUT_PRESETS.find((l) => l.id === 'three-hero')!,
    LAYOUT_PRESETS.find((l) => l.id === 'four-grid')!,
    LAYOUT_PRESETS.find((l) => l.id === 'luxury-centered')!,
    LAYOUT_PRESETS.find((l) => l.id === 'magazine-spread')!,
    LAYOUT_PRESETS.find((l) => l.id === 'collage-asymmetric')!,
  ].filter(Boolean);
}

export function buildPageFromLayout(
  order: number,
  templateId: Album['templateId'],
  layout: LayoutPreset,
  photos: { id: string; url: string }[],
  caption?: string,
): AlbumPage {
  const page = createBlankPage(order, templateId);
  const slots = layout.slots;
  slots.forEach((slot, i) => {
    const photo = photos[i % Math.max(photos.length, 1)];
    if (!photo) return;
    page.elements.push(
      createPhotoElement(photo, {
        x: slot.x,
        y: slot.y,
        width: slot.width,
        height: slot.height,
        zIndex: i + 1,
        borderRadius: layout.category === 'Luxury' ? 4 : 0,
        shadow: layout.category === 'Luxury' || layout.category === 'Magazine',
      }),
    );
  });
  if (caption) {
    const template = getTemplate(templateId);
    page.elements.push(
      createDefaultText({
        content: caption,
        x: 8,
        y: 88,
        width: 84,
        height: 8,
        fontSize: 14,
        fontWeight: 500,
        fontFamily: 'Playfair Display',
        color: template.textColor,
        textAlign: 'center',
        zIndex: 20,
      }),
    );
  }
  return page;
}

/**
 * AI Smart Album — rebuilds full album pages from selected photos.
 * Local heuristic layout engine (no backend).
 */
export function buildAiSmartAlbum(
  album: Album,
  photos: { id: string; url: string }[],
  options?: { pageCount?: number },
): Album {
  const next = deepClone(album);
  const pool = photos.length ? photos : [{ id: 'ph_empty', url: '' }];
  const cycles = layoutCycle();
  const targetPages = Math.max(
    4,
    options?.pageCount ?? Math.min(24, Math.max(album.info.pageCount, Math.ceil(pool.length / IDEAL_PHOTOS_PER_PAGE) + 1)),
  );

  const pages: AlbumPage[] = [];
  let photoCursor = 0;

  // Cover
  const cover = createBlankPage(0, album.templateId);
  const template = getTemplate(album.templateId);
  cover.elements.push(
    createDefaultText({
      content: album.info.name || 'Our Album',
      x: 10,
      y: 36,
      width: 80,
      height: 14,
      fontSize: 36,
      fontWeight: 700,
      fontFamily: 'Playfair Display',
      color: template.textColor,
      textAlign: 'center',
      zIndex: 10,
    }),
    createDefaultText({
      content: 'Designed with ShootHub AI',
      x: 15,
      y: 54,
      width: 70,
      height: 8,
      fontSize: 14,
      fontWeight: 500,
      color: template.accent,
      textAlign: 'center',
      zIndex: 11,
    }),
  );
  if (pool[0]?.url) {
    cover.elements.push(
      createPhotoElement(pool[0], {
        x: 20,
        y: 10,
        width: 60,
        height: 22,
        zIndex: 1,
        borderRadius: 8,
        opacity: 0.9,
      }),
    );
  }
  pages.push(cover);
  photoCursor = 1;

  const captions = [
    'Together is our favourite place to be',
    'A day wrapped in love',
    'Moments that stay forever',
    'The beginning of forever',
    'Every glance, a memory',
  ];

  for (let i = 1; i < targetPages; i++) {
    const layout = cycles[(i - 1) % cycles.length];
    const need = Math.min(layout.slots.length, MAX_PHOTOS_PER_PAGE);
    const slice: { id: string; url: string }[] = [];
    for (let s = 0; s < need; s++) {
      slice.push(pool[(photoCursor + s) % pool.length]);
    }
    photoCursor += need;
    pages.push(
      buildPageFromLayout(
        i,
        album.templateId,
        layout,
        slice,
        i % 2 === 0 ? captions[(i / 2) % captions.length] : undefined,
      ),
    );
  }

  next.pages = pages.map((p, i) => ({ ...p, order: i, id: p.id || createId('page') }));
  next.info.pageCount = next.pages.length;
  next.selectedPhotoIds = Array.from(new Set([...next.selectedPhotoIds, ...pool.map((p) => p.id)]));
  next.updatedAt = new Date().toISOString();
  next.status = 'in_progress';
  return next;
}

/**
 * AI Auto Layout — re-layout current page only with best-fit slots.
 */
export function buildAiAutoLayoutPage(
  album: Album,
  pageIndex: number,
  photos: { id: string; url: string }[],
): Album {
  const next = deepClone(album);
  const page = next.pages[pageIndex];
  if (!page) return next;

  const existingPhotos = page.elements.filter((e): e is PhotoElement => e.type === 'photo');
  const texts = page.elements.filter((e) => e.type === 'text');
  const pool =
    existingPhotos.length > 0
      ? existingPhotos.map((p) => ({ id: p.photoId, url: p.url }))
      : photos;

  const count = Math.min(Math.max(pool.length, 1), MAX_PHOTOS_PER_PAGE);
  const layout = pickLayoutForCount(Math.min(count, IDEAL_PHOTOS_PER_PAGE + 2));
  const rebuilt = buildPageFromLayout(page.order, album.templateId, layout, pool.slice(0, layout.slots.length));
  rebuilt.id = page.id;
  rebuilt.background = page.background;
  rebuilt.elements = [...rebuilt.elements, ...texts];
  next.pages[pageIndex] = rebuilt;
  next.updatedAt = new Date().toISOString();
  return next;
}
