import type { Album } from '../types';
import { STORAGE_KEY } from '../constants';
import { createId } from '../utils';
import type { AlbumInfo, TemplateId } from '../types';
import { buildInitialPages } from '../utils';
import { getAlbumPhotoCatalog } from './photoCatalog';

function readRaw(): Album[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Album[];
  } catch {
    return [];
  }
}

function writeRaw(albums: Album[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(albums));
}

export const albumStorageService = {
  list(): Album[] {
    return readRaw();
  },

  getById(id: string): Album | undefined {
    return readRaw().find((a) => a.id === id);
  },

  save(album: Album): Album {
    const list = readRaw();
    const idx = list.findIndex((a) => a.id === album.id);
    const next = { ...album, updatedAt: new Date().toISOString() };
    if (idx >= 0) list[idx] = next;
    else list.unshift(next);
    writeRaw(list);
    return next;
  },

  remove(id: string): void {
    writeRaw(readRaw().filter((a) => a.id !== id));
  },

  createFromWizard(input: {
    info: AlbumInfo;
    templateId: TemplateId;
    selectedPhotoIds: string[];
  }): Album {
    const catalog = getAlbumPhotoCatalog();
    const selected = catalog.filter((p) => input.selectedPhotoIds.includes(p.id));
    const photos = selected.length
      ? selected
      : catalog.slice(0, 8);

    const now = new Date().toISOString();
    const album: Album = {
      id: createId('album'),
      info: input.info,
      templateId: input.templateId,
      selectedPhotoIds: photos.map((p) => p.id),
      pages: buildInitialPages(
        input.info.pageCount,
        input.templateId,
        photos,
        input.info.name,
      ),
      status: 'draft',
      coverThumbnail: photos[0]?.thumbnailUrl,
      createdAt: now,
      updatedAt: now,
    };

    return this.save(album);
  },
};
