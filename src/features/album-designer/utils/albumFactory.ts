import type { Album, AlbumElement, AlbumPage, PhotoElement, TextElement, TemplateId } from '../types';
import { getTemplate } from '../constants';
import { createId } from './id';

export function createDefaultText(partial?: Partial<TextElement>): TextElement {
  return {
    id: createId('txt'),
    type: 'text',
    x: 10,
    y: 10,
    width: 40,
    height: 12,
    rotation: 0,
    zIndex: 10,
    content: 'Heading',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 28,
    fontWeight: 700,
    fontStyle: 'normal',
    textDecoration: 'none',
    letterSpacing: 0,
    textAlign: 'center',
    color: '#2D3436',
    ...partial,
  };
}

export function createPhotoElement(
  photo: { id: string; url: string },
  partial?: Partial<PhotoElement>,
): PhotoElement {
  return {
    id: createId('ph'),
    type: 'photo',
    photoId: photo.id,
    url: photo.url,
    x: 8,
    y: 12,
    width: 40,
    height: 55,
    rotation: 0,
    zIndex: 1,
    crop: { x: 50, y: 50, zoom: 1 },
    opacity: 1,
    borderRadius: 0,
    flipH: false,
    flipV: false,
    shadow: false,
    borderWidth: 0,
    borderColor: '#FFFFFF',
    ...partial,
  };
}

export function createBlankPage(order: number, templateId: TemplateId): AlbumPage {
  const template = getTemplate(templateId);
  return {
    id: createId('page'),
    order,
    background: template.pageBackground,
    elements: [],
  };
}

export function buildInitialPages(
  pageCount: number,
  templateId: TemplateId,
  photos: { id: string; url: string }[],
  albumName: string,
): AlbumPage[] {
  const template = getTemplate(templateId);
  const pages: AlbumPage[] = [];

  for (let i = 0; i < pageCount; i++) {
    const page = createBlankPage(i, templateId);
    if (i === 0) {
      page.elements.push(
        createDefaultText({
          content: albumName || 'Untitled Album',
          x: 10,
          y: 38,
          width: 80,
          height: 14,
          fontSize: 36,
          color: template.textColor,
          fontFamily: templateId === 'classic' || templateId === 'luxury' ? 'Georgia' : 'Plus Jakarta Sans',
        }),
        createDefaultText({
          content: 'A ShootHub Album',
          x: 20,
          y: 54,
          width: 60,
          height: 8,
          fontSize: 16,
          fontWeight: 500,
          color: template.accent,
        }),
      );
    } else {
      const photo = photos[(i - 1) % Math.max(photos.length, 1)];
      if (photo) {
        const layouts: Partial<PhotoElement>[][] = [
          [{ x: 8, y: 10, width: 84, height: 80 }],
          [
            { x: 5, y: 8, width: 44, height: 84 },
            { x: 51, y: 8, width: 44, height: 84 },
          ],
          [
            { x: 6, y: 6, width: 88, height: 52 },
            { x: 6, y: 62, width: 42, height: 32 },
            { x: 52, y: 62, width: 42, height: 32 },
          ],
        ];
        const layout = layouts[(i - 1) % layouts.length];
        layout.forEach((slot, slotIdx) => {
          const p = photos[(i - 1 + slotIdx) % photos.length];
          if (p) {
            page.elements.push(
              createPhotoElement(p, {
                ...slot,
                zIndex: slotIdx + 1,
              }),
            );
          }
        });
      }
    }
    pages.push(page);
  }

  return pages;
}

export function duplicateElement(el: AlbumElement): AlbumElement {
  return {
    ...structuredClone(el),
    id: createId(el.type === 'photo' ? 'ph' : 'txt'),
    x: Math.min(90, el.x + 3),
    y: Math.min(90, el.y + 3),
    zIndex: el.zIndex + 1,
  };
}

export function sortAlbumsByUpdated(albums: Album[]): Album[] {
  return [...albums].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}
