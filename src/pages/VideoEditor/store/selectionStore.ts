import { create } from 'zustand';
import type { ClipboardPayload, ContextMenuState } from '../types';

type SelectionState = {
  selectedClipId: string | null;
  clipboard: ClipboardPayload | null;
  contextMenu: ContextMenuState;

  selectClip: (id: string | null) => void;
  setClipboard: (payload: ClipboardPayload | null) => void;
  openContextMenu: (x: number, y: number, clipId: string) => void;
  closeContextMenu: () => void;
};

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedClipId: 'clip_v1',
  clipboard: null,
  contextMenu: { open: false, x: 0, y: 0, clipId: null },

  selectClip: (id) => set({ selectedClipId: id, contextMenu: { open: false, x: 0, y: 0, clipId: null } }),
  setClipboard: (payload) => set({ clipboard: payload }),
  openContextMenu: (x, y, clipId) =>
    set({
      selectedClipId: clipId,
      contextMenu: { open: true, x, y, clipId },
    }),
  closeContextMenu: () =>
    set((s) => ({ contextMenu: { ...s.contextMenu, open: false } })),
}));
