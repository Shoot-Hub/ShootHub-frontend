import { create } from 'zustand';
import type { MediaFolder, MediaItem, MediaSortKey, MediaSourceTab, MediaViewMode } from '../types';
import { MEDIA_FOLDERS, MEDIA_ITEMS } from '../data';
import { filesToMediaItems, sortMediaItems } from '../utils';
import { useHistoryStore } from './historyStore';

type MediaState = {
  folders: MediaFolder[];
  mediaItems: MediaItem[];
  mediaTab: MediaSourceTab;
  mediaView: MediaViewMode;
  mediaSearch: string;
  mediaSort: MediaSortKey;
  selectedFolderId: string | null;
  selectedMediaId: string | null;
  isImporting: boolean;
  draggingMediaId: string | null;

  setMediaTab: (tab: MediaSourceTab) => void;
  setMediaView: (view: MediaViewMode) => void;
  setMediaSearch: (q: string) => void;
  setMediaSort: (sort: MediaSortKey) => void;
  setSelectedFolderId: (id: string | null) => void;
  setSelectedMediaId: (id: string | null) => void;
  setDraggingMediaId: (id: string | null) => void;
  importMediaFiles: (files: File[]) => Promise<void>;
  getMediaById: (id: string) => MediaItem | undefined;
  getFilteredMedia: () => MediaItem[];
};

export const useMediaStore = create<MediaState>((set, get) => ({
  folders: MEDIA_FOLDERS,
  mediaItems: MEDIA_ITEMS.map((m) => ({ ...m, createdAt: Date.now() - 60_000 })),
  mediaTab: 'project',
  mediaView: 'grid',
  mediaSearch: '',
  mediaSort: 'recent',
  selectedFolderId: 'folder_wedding',
  selectedMediaId: 'media_1',
  isImporting: false,
  draggingMediaId: null,

  setMediaTab: (tab) => set({ mediaTab: tab }),
  setMediaView: (view) => set({ mediaView: view }),
  setMediaSearch: (q) => set({ mediaSearch: q }),
  setMediaSort: (sort) => set({ mediaSort: sort }),
  setSelectedFolderId: (id) => set({ selectedFolderId: id }),
  setSelectedMediaId: (id) => set({ selectedMediaId: id }),
  setDraggingMediaId: (id) => set({ draggingMediaId: id }),

  getMediaById: (id) => get().mediaItems.find((m) => m.id === id),

  getFilteredMedia: () => {
    const { mediaItems, mediaSearch, selectedFolderId, mediaSort } = get();
    const q = mediaSearch.trim().toLowerCase();
    const filtered = mediaItems.filter((item) => {
      if (selectedFolderId && item.folderId !== selectedFolderId) return false;
      if (q && !item.name.toLowerCase().includes(q)) return false;
      return true;
    });
    return sortMediaItems(filtered, mediaSort);
  },

  importMediaFiles: async (files) => {
    if (!files.length) return;
    set({ isImporting: true });
    try {
      const folderId = get().selectedFolderId ?? 'folder_wedding';
      const newItems = await filesToMediaItems(files, folderId);
      if (!newItems.length) return;
      set((s) => ({
        mediaItems: [...newItems, ...s.mediaItems],
        selectedMediaId: newItems[0]?.id ?? s.selectedMediaId,
        folders: s.folders.map((f) =>
          f.id === folderId ? { ...f, count: f.count + newItems.length } : f,
        ),
      }));
      useHistoryStore.getState().pushLabel(
        `Imported ${newItems.length} file${newItems.length > 1 ? 's' : ''}`,
      );
    } finally {
      set({ isImporting: false });
    }
  },
}));
