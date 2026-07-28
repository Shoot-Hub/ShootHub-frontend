import { create } from 'zustand';
import type { Album, AlbumElement, AlbumPage, TextElement } from '../types';
import { albumStorageService } from '../services';
import {
  createBlankPage,
  createDefaultText,
  createPhotoElement,
  deepClone,
  duplicateElement,
  clamp,
  buildAiSmartAlbum,
  buildAiAutoLayoutPage,
  getPagePhotoCapacity,
} from '../utils';
import { getAlbumPhotoCatalog } from '../services';

const MAX_HISTORY = 50;

type EditorStore = {
  album: Album | null;
  currentPageIndex: number;
  selectedIds: string[];
  past: Album[];
  future: Album[];
  clipboard: AlbumElement | null;
  load: (albumId: string) => boolean;
  setAlbum: (album: Album) => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  select: (ids: string[], additive?: boolean) => void;
  clearSelection: () => void;
  setPageIndex: (index: number) => void;
  updateElement: (id: string, patch: Partial<AlbumElement>) => void;
  /** Mutate without pushing undo history (for live drag/resize). */
  updateElementLive: (id: string, patch: Partial<AlbumElement>) => void;
  replacePhoto: (elementId: string, photo: { id: string; url: string }) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  copySelected: () => void;
  pasteClipboard: () => void;
  addHeading: () => void;
  addParagraph: () => void;
  addPhotoToPage: (photo: { id: string; url: string }) => void;
  addPage: () => void;
  deletePage: (index: number) => void;
  duplicatePage: (index: number) => void;
  movePage: (from: number, to: number) => void;
  reorderPages: (orderedIds: string[]) => void;
  applyAiSmartAlbum: () => void;
  applyAiAutoLayout: () => void;
  save: (status?: Album['status']) => Album | null;
  getCurrentPage: () => AlbumPage | null;
  getSelectedElements: () => AlbumElement[];
};

function withHistory(get: () => EditorStore, set: (partial: Partial<EditorStore>) => void, mutate: (album: Album) => Album) {
  const { album, past } = get();
  if (!album) return;
  const snapshot = deepClone(album);
  const next = mutate(deepClone(album));
  next.updatedAt = new Date().toISOString();
  set({
    album: next,
    past: [...past.slice(-(MAX_HISTORY - 1)), snapshot],
    future: [],
  });
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  album: null,
  currentPageIndex: 0,
  selectedIds: [],
  past: [],
  future: [],
  clipboard: null,

  load: (albumId) => {
    const album = albumStorageService.getById(albumId);
    if (!album) return false;
    set({
      album: deepClone(album),
      currentPageIndex: 0,
      selectedIds: [],
      past: [],
      future: [],
      clipboard: null,
    });
    return true;
  },

  setAlbum: (album) => set({ album }),

  pushHistory: () => {
    const { album, past } = get();
    if (!album) return;
    set({ past: [...past.slice(-(MAX_HISTORY - 1)), deepClone(album)], future: [] });
  },

  undo: () => {
    const { past, album, future } = get();
    if (!album || past.length === 0) return;
    const prev = past[past.length - 1];
    set({
      album: prev,
      past: past.slice(0, -1),
      future: [deepClone(album), ...future].slice(0, MAX_HISTORY),
      selectedIds: [],
    });
  },

  redo: () => {
    const { future, album, past } = get();
    if (!album || future.length === 0) return;
    const next = future[0];
    set({
      album: next,
      future: future.slice(1),
      past: [...past, deepClone(album)].slice(-MAX_HISTORY),
      selectedIds: [],
    });
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  select: (ids, additive) =>
    set((s) => ({
      selectedIds: additive
        ? Array.from(new Set([...s.selectedIds, ...ids]))
        : ids,
    })),

  clearSelection: () => set({ selectedIds: [] }),

  setPageIndex: (index) =>
    set((s) => ({
      currentPageIndex: clamp(index, 0, Math.max(0, (s.album?.pages.length ?? 1) - 1)),
      selectedIds: [],
    })),

  updateElement: (id, patch) => {
    withHistory(get, set, (album) => {
      album.pages = album.pages.map((page) => ({
        ...page,
        elements: page.elements.map((el) =>
          el.id === id ? ({ ...el, ...patch } as AlbumElement) : el,
        ),
      }));
      return album;
    });
  },

  updateElementLive: (id, patch) => {
    const { album } = get();
    if (!album) return;
    const pages = album.pages.map((page) => ({
      ...page,
      elements: page.elements.map((el) =>
        el.id === id ? ({ ...el, ...patch } as AlbumElement) : el,
      ),
    }));
    set({ album: { ...album, pages } });
  },

  replacePhoto: (elementId, photo) => {
    withHistory(get, set, (album) => {
      album.pages = album.pages.map((page) => ({
        ...page,
        elements: page.elements.map((el) => {
          if (el.id !== elementId || el.type !== 'photo') return el;
          return { ...el, photoId: photo.id, url: photo.url, crop: { x: 50, y: 50, zoom: 1 } };
        }),
      }));
      return album;
    });
  },

  deleteSelected: () => {
    const { selectedIds } = get();
    if (!selectedIds.length) return;
    withHistory(get, set, (album) => {
      album.pages = album.pages.map((page) => ({
        ...page,
        elements: page.elements.filter((el) => !selectedIds.includes(el.id)),
      }));
      return album;
    });
    set({ selectedIds: [] });
  },

  duplicateSelected: () => {
    const els = get().getSelectedElements();
    if (!els.length) return;
    const clones = els.map(duplicateElement);
    withHistory(get, set, (album) => {
      const page = album.pages[get().currentPageIndex];
      if (!page) return album;
      page.elements = [...page.elements, ...clones];
      return album;
    });
    set({ selectedIds: clones.map((c) => c.id) });
  },

  copySelected: () => {
    const el = get().getSelectedElements()[0];
    if (!el) return;
    set({ clipboard: deepClone(el) });
  },

  pasteClipboard: () => {
    const { clipboard } = get();
    if (!clipboard) return;
    const clone = duplicateElement(clipboard);
    withHistory(get, set, (album) => {
      const page = album.pages[get().currentPageIndex];
      if (!page) return album;
      page.elements = [...page.elements, clone];
      return album;
    });
    set({ selectedIds: [clone.id] });
  },

  addHeading: () => {
    const text = createDefaultText({ content: 'Heading', fontSize: 32, fontWeight: 700 });
    withHistory(get, set, (album) => {
      const page = album.pages[get().currentPageIndex];
      if (!page) return album;
      page.elements.push(text);
      return album;
    });
    set({ selectedIds: [text.id] });
  },

  addParagraph: () => {
    const text = createDefaultText({
      content: 'Add your story here…',
      fontSize: 16,
      fontWeight: 400,
      y: 20,
      height: 16,
    });
    withHistory(get, set, (album) => {
      const page = album.pages[get().currentPageIndex];
      if (!page) return album;
      page.elements.push(text);
      return album;
    });
    set({ selectedIds: [text.id] });
  },

  addPhotoToPage: (photo) => {
    const page = get().getCurrentPage();
    if (page) {
      const cap = getPagePhotoCapacity(page);
      if (cap.full) return;
    }
    const el = createPhotoElement(photo, { x: 20, y: 20, width: 35, height: 45 });
    withHistory(get, set, (album) => {
      const p = album.pages[get().currentPageIndex];
      if (!p) return album;
      if (getPagePhotoCapacity(p).full) return album;
      p.elements.push(el);
      if (!album.selectedPhotoIds.includes(photo.id)) {
        album.selectedPhotoIds = [...album.selectedPhotoIds, photo.id];
      }
      return album;
    });
    set({ selectedIds: [el.id] });
  },

  addPage: () => {
    withHistory(get, set, (album) => {
      const page = createBlankPage(album.pages.length, album.templateId);
      album.pages.push(page);
      album.info.pageCount = album.pages.length;
      return album;
    });
    const len = get().album?.pages.length ?? 1;
    set({ currentPageIndex: len - 1, selectedIds: [] });
  },

  deletePage: (index) => {
    withHistory(get, set, (album) => {
      if (album.pages.length <= 1) return album;
      album.pages = album.pages
        .filter((_, i) => i !== index)
        .map((p, i) => ({ ...p, order: i }));
      album.info.pageCount = album.pages.length;
      return album;
    });
    set((s) => ({
      currentPageIndex: clamp(s.currentPageIndex, 0, Math.max(0, (s.album?.pages.length ?? 1) - 1)),
      selectedIds: [],
    }));
  },

  duplicatePage: (index) => {
    withHistory(get, set, (album) => {
      const source = album.pages[index];
      if (!source) return album;
      const clone: AlbumPage = {
        ...deepClone(source),
        id: `page_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`,
        order: index + 1,
        elements: source.elements.map((el) => ({
          ...deepClone(el),
          id: `${el.type}_${Math.random().toString(36).slice(2)}`,
        })),
      };
      album.pages.splice(index + 1, 0, clone);
      album.pages = album.pages.map((p, i) => ({ ...p, order: i }));
      album.info.pageCount = album.pages.length;
      return album;
    });
    set({ currentPageIndex: index + 1, selectedIds: [] });
  },

  movePage: (from, to) => {
    if (from === to) return;
    withHistory(get, set, (album) => {
      const pages = [...album.pages];
      const [item] = pages.splice(from, 1);
      pages.splice(to, 0, item);
      album.pages = pages.map((p, i) => ({ ...p, order: i }));
      return album;
    });
    set({ currentPageIndex: to, selectedIds: [] });
  },

  reorderPages: (orderedIds) => {
    withHistory(get, set, (album) => {
      const map = new Map(album.pages.map((p) => [p.id, p]));
      album.pages = orderedIds
        .map((id) => map.get(id))
        .filter(Boolean)
        .map((p, i) => ({ ...p!, order: i }));
      return album;
    });
  },

  applyAiSmartAlbum: () => {
    const { album } = get();
    if (!album) return;
    const catalog = getAlbumPhotoCatalog(36);
    const selected = catalog.filter((p) => album.selectedPhotoIds.includes(p.id));
    const photos = (selected.length ? selected : catalog).map((p) => ({ id: p.id, url: p.url }));
    const snapshot = deepClone(album);
    const next = buildAiSmartAlbum(album, photos, { pageCount: Math.max(album.info.pageCount, 12) });
    set({
      album: next,
      past: [...get().past.slice(-(MAX_HISTORY - 1)), snapshot],
      future: [],
      currentPageIndex: 0,
      selectedIds: [],
    });
  },

  applyAiAutoLayout: () => {
    const { album, currentPageIndex } = get();
    if (!album) return;
    const catalog = getAlbumPhotoCatalog(24);
    const photos = catalog.map((p) => ({ id: p.id, url: p.url }));
    const snapshot = deepClone(album);
    const next = buildAiAutoLayoutPage(album, currentPageIndex, photos);
    set({
      album: next,
      past: [...get().past.slice(-(MAX_HISTORY - 1)), snapshot],
      future: [],
      selectedIds: [],
    });
  },

  save: (status) => {
    const { album } = get();
    if (!album) return null;
    const next = {
      ...album,
      status: status ?? album.status,
      updatedAt: new Date().toISOString(),
    };
    const saved = albumStorageService.save(next);
    set({ album: saved });
    return saved;
  },

  getCurrentPage: () => {
    const { album, currentPageIndex } = get();
    return album?.pages[currentPageIndex] ?? null;
  },

  getSelectedElements: () => {
    const { album, selectedIds } = get();
    if (!album || !selectedIds.length) return [];
    return album.pages.flatMap((page) =>
      page.elements.filter((el) => selectedIds.includes(el.id)),
    );
  },
}));

/** Helper for text toolbar patches without full type gymnastics */
export function patchSelectedText(
  patch: Partial<TextElement>,
) {
  const store = useEditorStore.getState();
  store.getSelectedElements().forEach((el) => {
    if (el.type === 'text') store.updateElement(el.id, patch);
  });
}
