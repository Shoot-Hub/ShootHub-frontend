import { create } from 'zustand';
import type { Album, AlbumFilterKey, AlbumSortKey, AlbumStats } from '../types';
import { albumStorageService } from '../services';

type AlbumStore = {
  albums: Album[];
  search: string;
  filter: AlbumFilterKey;
  sort: AlbumSortKey;
  hydrated: boolean;
  hydrate: () => void;
  refresh: () => void;
  setSearch: (v: string) => void;
  setFilter: (v: AlbumFilterKey) => void;
  setSort: (v: AlbumSortKey) => void;
  upsert: (album: Album) => Album;
  remove: (id: string) => void;
  getFiltered: () => Album[];
  getStats: () => AlbumStats;
};

function applySort(albums: Album[], sort: AlbumSortKey): Album[] {
  const copy = [...albums];
  switch (sort) {
    case 'name':
      return copy.sort((a, b) => a.info.name.localeCompare(b.info.name));
    case 'created':
      return copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case 'status':
      return copy.sort((a, b) => a.status.localeCompare(b.status));
    default:
      return copy.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }
}

export const useAlbumStore = create<AlbumStore>((set, get) => ({
  albums: [],
  search: '',
  filter: 'all',
  sort: 'updated',
  hydrated: false,

  hydrate: () => {
    set({ albums: albumStorageService.list(), hydrated: true });
  },

  refresh: () => set({ albums: albumStorageService.list() }),

  setSearch: (search) => set({ search }),
  setFilter: (filter) => set({ filter }),
  setSort: (sort) => set({ sort }),

  upsert: (album) => {
    const saved = albumStorageService.save(album);
    set({ albums: albumStorageService.list() });
    return saved;
  },

  remove: (id) => {
    albumStorageService.remove(id);
    set({ albums: albumStorageService.list() });
  },

  getFiltered: () => {
    const { albums, search, filter, sort } = get();
    let list = albums;
    if (filter !== 'all') list = list.filter((a) => a.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.info.name.toLowerCase().includes(q) ||
          a.info.client.toLowerCase().includes(q) ||
          a.info.event.toLowerCase().includes(q),
      );
    }
    return applySort(list, sort);
  },

  getStats: () => {
    const { albums } = get();
    return {
      total: albums.length,
      drafts: albums.filter((a) => a.status === 'draft').length,
      completed: albums.filter((a) => a.status === 'completed').length,
      inProgress: albums.filter((a) => a.status === 'in_progress').length,
      templatesUsed: new Set(albums.map((a) => a.templateId)).size,
    };
  },
}));
