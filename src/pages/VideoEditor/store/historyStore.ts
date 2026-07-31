import { create } from 'zustand';
import type { HistoryEntry, HistorySnapshot } from '../types';
import { INITIAL_CLIPS, INITIAL_HISTORY, INITIAL_TRACKS } from '../data';
import { createId, VE_CONSTANTS } from '../utils';

type Restorer = (snapshot: HistorySnapshot) => void;
type AutoSaveSetter = (label: string) => void;

let restorer: Restorer | null = null;
let autoSaveSetter: AutoSaveSetter | null = null;
let snapshotProvider: (() => HistorySnapshot) | null = null;

export function bindHistoryRestorer(fn: Restorer) {
  restorer = fn;
}

export function bindHistoryAutoSave(fn: AutoSaveSetter) {
  autoSaveSetter = fn;
}

export function bindHistorySnapshotProvider(fn: () => HistorySnapshot) {
  snapshotProvider = fn;
}

const seedSnapshot: HistorySnapshot = {
  clips: structuredClone(INITIAL_CLIPS),
  tracks: structuredClone(INITIAL_TRACKS),
};

const seedHistory: HistoryEntry[] = INITIAL_HISTORY.map((h, i) => ({
  id: h.id ?? `h${i}`,
  label: h.label,
  timestamp: h.timestamp,
  snapshot: seedSnapshot,
}));

type HistoryState = {
  history: HistoryEntry[];
  historyIndex: number;
  pushHistory: (label: string) => void;
  pushLabel: (label: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
};

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: seedHistory,
  historyIndex: seedHistory.length - 1,

  pushLabel: (label) => {
    autoSaveSetter?.('Saving…');
    const snapshot = snapshotProvider?.() ?? seedSnapshot;
    set((s) => {
      const entry: HistoryEntry = {
        id: createId('hist'),
        label,
        timestamp: Date.now(),
        snapshot: structuredClone(snapshot),
      };
      const trimmed = s.history.slice(0, s.historyIndex + 1);
      const next = [...trimmed, entry].slice(-VE_CONSTANTS.MAX_HISTORY);
      return { history: next, historyIndex: next.length - 1 };
    });
    window.setTimeout(() => autoSaveSetter?.('Auto Saved just now'), 800);
  },

  pushHistory: (label) => get().pushLabel(label),

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex <= 0) return;
    const nextIndex = historyIndex - 1;
    const entry = history[nextIndex];
    if (!entry) return;
    restorer?.(structuredClone(entry.snapshot));
    set({ historyIndex: nextIndex });
    autoSaveSetter?.('Undo applied');
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    const entry = history[nextIndex];
    if (!entry) return;
    restorer?.(structuredClone(entry.snapshot));
    set({ historyIndex: nextIndex });
    autoSaveSetter?.('Redo applied');
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
}));
