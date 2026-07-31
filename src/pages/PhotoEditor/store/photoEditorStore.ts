import { create } from 'zustand';
import { MOCK_PHOTOS, EDITOR_PRESETS, EDITOR_FILTERS, getAiTool, mockFaceBoxes } from '../data';
import type {
  Adjustments,
  AiJobState,
  AiResultState,
  AiToolId,
  BatchProgressState,
  BatchScope,
  BatchUndoEntry,
  ClipboardEdits,
  EditorTool,
  ExportSettings,
  HistoryEntry,
  PhotoItem,
  PresetCategory,
  RightTab,
  TransformState,
  EditSnapshot,
} from '../types';
import { DEFAULT_ADJUSTMENTS, DEFAULT_TRANSFORM } from '../types';
import {
  createId,
  mergeAdjustments,
  resetAdjustments,
  resetTransform,
  snapshotFromPhoto,
} from '../utils';
const MAX_HISTORY = 60;
const FAVORITES_KEY = 'shoothub.photoEditor.favoritePresets';

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function saveFavorites(ids: string[]) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {
    /* ignore quota */
  }
}

type PhotoEditorState = {
  photos: PhotoItem[];
  activePhotoId: string | null;
  selectedIds: string[];
  selectionAnchorId: string | null;
  activeTool: EditorTool;
  rightTab: RightTab;
  compareMode: boolean;
  /** Viewport zoom (view only — does not bake into edits) */
  zoom: number;
  panX: number;
  panY: number;
  isFullscreen: boolean;
  isImageLoading: boolean;
  clipboard: ClipboardEdits;
  history: HistoryEntry[];
  historyIndex: number;
  exportOpen: boolean;
  exportSettings: ExportSettings;
  expandedSections: Record<string, boolean>;
  thumbSize: number;

  /** Presets module UI */
  favoritePresetIds: string[];
  presetQuery: string;
  presetCategory: PresetCategory | 'all' | 'favorites';
  presetPreviewId: string | null;
  presetPreviewBaseline: EditSnapshot | null;
  applyingPresetId: string | null;

  /** Batch editing */
  batchProgress: BatchProgressState | null;
  batchUndoStack: BatchUndoEntry[];
  batchPreviewActive: boolean;
  batchPreviewBaseline: Record<string, EditSnapshot> | null;
  batchApplyBefore: Record<string, EditSnapshot> | null;
  batchBusy: boolean;

  /** AI editing (UI / mock only) */
  aiJob: AiJobState | null;
  aiResult: AiResultState | null;
  aiCancelToken: number;

  /** Responsive layout */
  leftCollapsed: boolean;
  leftDrawerOpen: boolean;
  rightCollapsed: boolean;
  rightSheetOpen: boolean;
  breakpoint: 'mobile' | 'tablet' | 'laptop' | 'desktop';

  getActivePhoto: () => PhotoItem | null;
  setActivePhoto: (id: string) => void;
  toggleSelect: (id: string) => void;
  selectOnly: (id: string) => void;
  selectRangeTo: (id: string) => void;
  setSelection: (ids: string[]) => void;
  selectAll: () => void;
  deselectAll: () => void;
  removePhotos: (ids: string[]) => void;
  duplicatePhoto: (id: string) => void;
  reorderPhotos: (fromIndex: number, toIndex: number) => void;
  setActiveTool: (tool: EditorTool) => void;
  setRightTab: (tab: RightTab) => void;
  setCompareMode: (on: boolean) => void;
  toggleCompareMode: () => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;
  setFullscreen: (on: boolean) => void;
  setImageLoading: (loading: boolean) => void;

  /** Live slider update — no history */
  setAdjustmentLive: <K extends keyof Adjustments>(key: K, value: Adjustments[K]) => void;
  /** Commit adjustment to history (on pointer up) */
  commitAdjustment: <K extends keyof Adjustments>(key: K, value: Adjustments[K]) => void;
  setTransform: (patch: Partial<TransformState>, label?: string) => void;
  setTransformLive: (patch: Partial<TransformState>) => void;
  rotateBy: (degrees: number) => void;
  flipHorizontal: () => void;
  flipVertical: () => void;
  applyPreset: (presetId: string) => void;
  beginPresetPreview: (presetId: string) => void;
  endPresetPreview: () => void;
  toggleFavoritePreset: (presetId: string) => void;
  setPresetQuery: (query: string) => void;
  setPresetCategory: (category: PresetCategory | 'all' | 'favorites') => void;
  applyFilter: (filterId: string | null) => void;
  resetActiveAdjustments: () => void;
  resetActiveTransform: () => void;
  copyEdits: () => void;
  pasteEdits: () => void;
  applyEditsToSelected: () => void;
  applyEditsToAll: () => void;
  runBatchApply: (scope: BatchScope) => Promise<void>;
  cancelBatchApply: () => void;
  dismissBatchProgress: () => void;
  setBatchPreview: (on: boolean) => void;
  undoBatchEdit: () => void;
  undo: () => void;
  redo: () => void;
  addSnapshot: (label?: string) => void;
  restoreHistory: (entryId: string) => void;
  clearHistory: () => void;
  setExportOpen: (open: boolean) => void;
  setExportSettings: (patch: Partial<ExportSettings>) => void;
  toggleSection: (id: string) => void;
  setThumbSize: (size: number) => void;
  runAiEnhance: () => void;
  runAiTool: (toolId: AiToolId) => Promise<void>;
  cancelAiTool: () => void;
  applyAiResult: () => void;
  discardAiResult: () => void;
  setLeftCollapsed: (on: boolean) => void;
  toggleLeftCollapsed: () => void;
  setLeftDrawerOpen: (on: boolean) => void;
  setRightCollapsed: (on: boolean) => void;
  toggleRightCollapsed: () => void;
  setRightSheetOpen: (on: boolean) => void;
  openInspector: () => void;
  setBreakpoint: (bp: 'mobile' | 'tablet' | 'laptop' | 'desktop') => void;
  addPhotos: (
    items: Omit<PhotoItem, 'adjustments' | 'transform' | 'presetId' | 'filterId'>[],
  ) => void;
};

function pushHistory(
  history: HistoryEntry[],
  historyIndex: number,
  entry: HistoryEntry,
): { history: HistoryEntry[]; historyIndex: number } {
  const trimmed = history.slice(0, historyIndex + 1);
  const next = [...trimmed, entry].slice(-MAX_HISTORY);
  return { history: next, historyIndex: next.length - 1 };
}

function applySnapshot(photo: PhotoItem, snapshot: HistoryEntry['snapshot']): PhotoItem {
  return {
    ...photo,
    adjustments: { ...snapshot.adjustments },
    transform: { ...snapshot.transform },
    presetId: snapshot.presetId,
    filterId: snapshot.filterId,
  };
}

export const usePhotoEditorStore = create<PhotoEditorState>((set, get) => ({
  photos: MOCK_PHOTOS,
  activePhotoId: MOCK_PHOTOS[0]?.id ?? null,
  selectedIds: MOCK_PHOTOS.map((p) => p.id),
  selectionAnchorId: MOCK_PHOTOS[0]?.id ?? null,
  activeTool: 'light',
  rightTab: 'adjust',
  compareMode: false,
  zoom: 1,
  panX: 0,
  panY: 0,
  isFullscreen: false,
  isImageLoading: true,
  clipboard: null,
  history: [],
  historyIndex: -1,
  exportOpen: false,
  exportSettings: {
    format: 'jpg',
    quality: 92,
    resizeEnabled: false,
    resizeWidth: 2400,
    watermark: false,
    watermarkText: 'ShootHub',
    renameEnabled: true,
    renamePattern: '{name}_edited',
  },
  expandedSections: {
    light: true,
    color: false,
    details: false,
    effects: false,
  },
  thumbSize: 72,
  favoritePresetIds: loadFavorites(),
  presetQuery: '',
  presetCategory: 'all',
  presetPreviewId: null,
  presetPreviewBaseline: null,
  applyingPresetId: null,
  batchProgress: null,
  batchUndoStack: [],
  batchPreviewActive: false,
  batchPreviewBaseline: null,
  batchApplyBefore: null,
  batchBusy: false,
  aiJob: null,
  aiResult: null,
  aiCancelToken: 0,
  leftCollapsed: false,
  leftDrawerOpen: false,
  rightCollapsed: false,
  rightSheetOpen: false,
  breakpoint: 'desktop',

  getActivePhoto: () => {
    const { photos, activePhotoId } = get();
    return photos.find((p) => p.id === activePhotoId) ?? null;
  },

  setActivePhoto: (id) =>
    set({
      activePhotoId: id,
      selectionAnchorId: id,
      isImageLoading: true,
      zoom: 1,
      panX: 0,
      panY: 0,
    }),

  toggleSelect: (id) =>
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((x) => x !== id)
        : [...s.selectedIds, id],
      selectionAnchorId: id,
    })),

  selectOnly: (id) => set({ selectedIds: [id], selectionAnchorId: id }),

  selectRangeTo: (id) => {
    const { photos, selectionAnchorId } = get();
    const anchor = selectionAnchorId ?? get().activePhotoId;
    if (!anchor) {
      set({ selectedIds: [id], selectionAnchorId: id });
      return;
    }
    const a = photos.findIndex((p) => p.id === anchor);
    const b = photos.findIndex((p) => p.id === id);
    if (a < 0 || b < 0) return;
    const [start, end] = a < b ? [a, b] : [b, a];
    const range = photos.slice(start, end + 1).map((p) => p.id);
    set({ selectedIds: range });
  },

  setSelection: (ids) => set({ selectedIds: ids }),

  selectAll: () => set((s) => ({ selectedIds: s.photos.map((p) => p.id) })),
  deselectAll: () => set({ selectedIds: [] }),

  removePhotos: (ids) =>
    set((s) => {
      if (!ids.length) return s;
      const idSet = new Set(ids);
      const photos = s.photos.filter((p) => !idSet.has(p.id));
      const selectedIds = s.selectedIds.filter((id) => !idSet.has(id));
      let activePhotoId = s.activePhotoId;
      if (activePhotoId && idSet.has(activePhotoId)) {
        activePhotoId = photos[0]?.id ?? null;
      }
      return {
        photos,
        selectedIds,
        activePhotoId,
        selectionAnchorId: activePhotoId,
        isImageLoading: Boolean(activePhotoId),
      };
    }),

  duplicatePhoto: (id) =>
    set((s) => {
      const photo = s.photos.find((p) => p.id === id);
      if (!photo) return s;
      const copy: PhotoItem = {
        ...photo,
        id: createId('photo'),
        name: photo.name.replace(/(\.\w+)?$/, '_copy$1'),
        adjustments: { ...photo.adjustments },
        transform: { ...photo.transform },
      };
      const idx = s.photos.findIndex((p) => p.id === id);
      const photos = [...s.photos];
      photos.splice(idx + 1, 0, copy);
      return { photos, selectedIds: [...s.selectedIds, copy.id] };
    }),

  reorderPhotos: (fromIndex, toIndex) =>
    set((s) => {
      const next = [...s.photos];
      const [moved] = next.splice(fromIndex, 1);
      if (!moved) return s;
      next.splice(toIndex, 0, moved);
      return { photos: next };
    }),

  setActiveTool: (tool) =>
    set((s) => {
      const tabMap: Partial<Record<EditorTool, RightTab>> = {
        presets: 'presets',
        light: 'adjust',
        color: 'adjust',
        details: 'adjust',
        flip: 'adjust',
        rotate: 'adjust',
        crop: 'adjust',
      };
      const sectionMap: Partial<Record<EditorTool, string>> = {
        light: 'light',
        color: 'color',
        details: 'details',
      };
      const section = sectionMap[tool];
      const isCompact = s.breakpoint === 'mobile' || s.breakpoint === 'tablet';
      return {
        activeTool: tool,
        rightTab: tabMap[tool] ?? s.rightTab,
        expandedSections: section
          ? { ...s.expandedSections, [section]: true }
          : s.expandedSections,
        leftDrawerOpen: false,
        rightSheetOpen: isCompact ? true : s.rightSheetOpen,
        rightCollapsed: isCompact ? s.rightCollapsed : false,
      };
    }),

  setRightTab: (tab) => set({ rightTab: tab }),
  setCompareMode: (on) => set({ compareMode: on }),
  toggleCompareMode: () => set((s) => ({ compareMode: !s.compareMode })),
  setZoom: (zoom) => set({ zoom: Math.min(4, Math.max(0.25, zoom)) }),
  setPan: (x, y) => set({ panX: x, panY: y }),
  resetView: () => set({ zoom: 1, panX: 0, panY: 0 }),
  setFullscreen: (on) => set({ isFullscreen: on }),
  setImageLoading: (loading) => set({ isImageLoading: loading }),

  setAdjustmentLive: (key, value) => {
    const photo = get().getActivePhoto();
    if (!photo) return;
    set({
      photos: get().photos.map((p) =>
        p.id === photo.id
          ? { ...p, adjustments: { ...p.adjustments, [key]: value }, presetId: null }
          : p,
      ),
    });
  },

  commitAdjustment: (key, value) => {
    const state = get();
    const photo = state.getActivePhoto();
    if (!photo) return;
    const nextAdj = { ...photo.adjustments, [key]: value };
    const nextPhoto = { ...photo, adjustments: nextAdj, presetId: null };
    const hist = pushHistory(state.history, state.historyIndex, {
      id: createId('hist'),
      label: `Adjusted ${key}`,
      photoId: photo.id,
      snapshot: snapshotFromPhoto(nextPhoto),
      timestamp: Date.now(),
    });
    set({
      photos: state.photos.map((p) => (p.id === photo.id ? nextPhoto : p)),
      ...hist,
    });
  },

  setTransform: (patch, label = 'Transform') => {
    const state = get();
    const photo = state.getActivePhoto();
    if (!photo) return;
    const nextPhoto = {
      ...photo,
      transform: { ...photo.transform, ...patch },
    };
    const hist = pushHistory(state.history, state.historyIndex, {
      id: createId('hist'),
      label,
      photoId: photo.id,
      snapshot: snapshotFromPhoto(nextPhoto),
      timestamp: Date.now(),
    });
    set({
      photos: state.photos.map((p) => (p.id === photo.id ? nextPhoto : p)),
      ...hist,
    });
  },

  setTransformLive: (patch) => {
    const photo = get().getActivePhoto();
    if (!photo) return;
    set({
      photos: get().photos.map((p) =>
        p.id === photo.id ? { ...p, transform: { ...p.transform, ...patch } } : p,
      ),
    });
  },

  rotateBy: (degrees) => {
    const photo = get().getActivePhoto();
    if (!photo) return;
    const next = (((photo.transform.rotation + degrees) % 360) + 360) % 360;
    get().setTransform({ rotation: next }, `Rotate ${degrees > 0 ? '+' : ''}${degrees}°`);
  },

  flipHorizontal: () => {
    const photo = get().getActivePhoto();
    if (!photo) return;
    get().setTransform({ flipH: !photo.transform.flipH }, 'Flip horizontal');
  },

  flipVertical: () => {
    const photo = get().getActivePhoto();
    if (!photo) return;
    get().setTransform({ flipV: !photo.transform.flipV }, 'Flip vertical');
  },

  applyPreset: (presetId) => {
    const preset = EDITOR_PRESETS.find((p) => p.id === presetId);
    const state = get();
    const photo = state.getActivePhoto();
    if (!preset || !photo) return;

    const nextPhoto = {
      ...photo,
      adjustments: mergeAdjustments(resetAdjustments(), preset.adjustments),
      presetId,
      filterId: null,
    };
    const hist = pushHistory(state.history, state.historyIndex, {
      id: createId('hist'),
      label: `Preset: ${preset.name}`,
      photoId: photo.id,
      snapshot: snapshotFromPhoto(nextPhoto),
      timestamp: Date.now(),
    });
    set({
      photos: state.photos.map((p) => (p.id === photo.id ? nextPhoto : p)),
      rightTab: 'presets',
      presetPreviewId: null,
      presetPreviewBaseline: null,
      applyingPresetId: presetId,
      ...hist,
    });
    window.setTimeout(() => {
      if (get().applyingPresetId === presetId) set({ applyingPresetId: null });
    }, 650);
  },

  beginPresetPreview: (presetId) => {
    const preset = EDITOR_PRESETS.find((p) => p.id === presetId);
    const state = get();
    const photo = state.getActivePhoto();
    if (!preset || !photo) return;

    const baseline = state.presetPreviewBaseline ?? snapshotFromPhoto(photo);
    const nextAdj = mergeAdjustments(resetAdjustments(), preset.adjustments);
    set({
      presetPreviewId: presetId,
      presetPreviewBaseline: baseline,
      photos: state.photos.map((p) =>
        p.id === photo.id
          ? { ...p, adjustments: nextAdj, presetId: null, filterId: null }
          : p,
      ),
    });
  },

  endPresetPreview: () => {
    const state = get();
    const { presetPreviewId, presetPreviewBaseline } = state;
    if (!presetPreviewId || !presetPreviewBaseline) {
      set({ presetPreviewId: null, presetPreviewBaseline: null });
      return;
    }
    const photo = state.getActivePhoto();
    if (!photo) {
      set({ presetPreviewId: null, presetPreviewBaseline: null });
      return;
    }
    set({
      presetPreviewId: null,
      presetPreviewBaseline: null,
      photos: state.photos.map((p) =>
        p.id === photo.id
          ? {
              ...p,
              adjustments: { ...presetPreviewBaseline.adjustments },
              transform: { ...presetPreviewBaseline.transform },
              presetId: presetPreviewBaseline.presetId,
              filterId: presetPreviewBaseline.filterId,
            }
          : p,
      ),
    });
  },

  toggleFavoritePreset: (presetId) => {
    const current = get().favoritePresetIds;
    const next = current.includes(presetId)
      ? current.filter((id) => id !== presetId)
      : [...current, presetId];
    saveFavorites(next);
    set({ favoritePresetIds: next });
  },

  setPresetQuery: (query) => set({ presetQuery: query }),
  setPresetCategory: (category) => set({ presetCategory: category }),

  applyFilter: (filterId) => {
    const state = get();
    const photo = state.getActivePhoto();
    if (!photo) return;
    const filter = EDITOR_FILTERS.find((f) => f.id === filterId);
    const id = filterId === 'none' ? null : filterId;
    const nextAdj = filter?.adjustments
      ? mergeAdjustments(resetAdjustments(), filter.adjustments)
      : photo.adjustments;
    const nextPhoto = {
      ...photo,
      filterId: id,
      adjustments: nextAdj,
      presetId: null,
    };
    const hist = pushHistory(state.history, state.historyIndex, {
      id: createId('hist'),
      label: filter ? `Filter: ${filter.name}` : 'Clear filter',
      photoId: photo.id,
      snapshot: snapshotFromPhoto(nextPhoto),
      timestamp: Date.now(),
    });
    set({
      photos: state.photos.map((p) => (p.id === photo.id ? nextPhoto : p)),
      ...hist,
    });
  },

  resetActiveAdjustments: () => {
    const state = get();
    const photo = state.getActivePhoto();
    if (!photo) return;
    const nextPhoto = {
      ...photo,
      adjustments: resetAdjustments(),
      presetId: null,
      filterId: null,
    };
    const hist = pushHistory(state.history, state.historyIndex, {
      id: createId('hist'),
      label: 'Reset adjustments',
      photoId: photo.id,
      snapshot: snapshotFromPhoto(nextPhoto),
      timestamp: Date.now(),
    });
    set({
      photos: state.photos.map((p) => (p.id === photo.id ? nextPhoto : p)),
      ...hist,
    });
  },

  resetActiveTransform: () => {
    const state = get();
    const photo = state.getActivePhoto();
    if (!photo) return;
    const nextPhoto = { ...photo, transform: resetTransform() };
    const hist = pushHistory(state.history, state.historyIndex, {
      id: createId('hist'),
      label: 'Reset transform',
      photoId: photo.id,
      snapshot: snapshotFromPhoto(nextPhoto),
      timestamp: Date.now(),
    });
    set({
      photos: state.photos.map((p) => (p.id === photo.id ? nextPhoto : p)),
      ...hist,
    });
  },

  copyEdits: () => {
    const photo = get().getActivePhoto();
    if (!photo) return;
    set({
      clipboard: {
        adjustments: { ...photo.adjustments },
        transform: { ...photo.transform },
        presetId: photo.presetId,
        filterId: photo.filterId,
      },
    });
  },

  pasteEdits: () => {
    const state = get();
    const { clipboard } = state;
    const photo = state.getActivePhoto();
    if (!clipboard || !photo) return;
    const nextPhoto = {
      ...photo,
      adjustments: { ...clipboard.adjustments },
      transform: { ...clipboard.transform },
      presetId: clipboard.presetId,
      filterId: clipboard.filterId,
    };
    const hist = pushHistory(state.history, state.historyIndex, {
      id: createId('hist'),
      label: 'Pasted edits',
      photoId: photo.id,
      snapshot: snapshotFromPhoto(nextPhoto),
      timestamp: Date.now(),
    });
    set({
      photos: state.photos.map((p) => (p.id === photo.id ? nextPhoto : p)),
      ...hist,
    });
  },

  applyEditsToSelected: () => {
    void get().runBatchApply('selected');
  },

  applyEditsToAll: () => {
    void get().runBatchApply('all');
  },

  runBatchApply: async (scope) => {
    const state = get();
    if (state.batchBusy) return;

    if (state.batchPreviewActive) {
      get().setBatchPreview(false);
    }

    const sourcePhoto = state.getActivePhoto();
    const sourceFromClipboard =
      scope === 'clipboard-selected' ? state.clipboard : null;

    if (scope === 'clipboard-selected') {
      if (!sourceFromClipboard) return;
    } else if (!sourcePhoto) {
      return;
    }

    const targetIds =
      scope === 'all'
        ? state.photos.map((p) => p.id)
        : [...state.selectedIds];

    if (!targetIds.length) return;

    const sourceSnap: EditSnapshot = sourceFromClipboard
      ? {
          adjustments: { ...sourceFromClipboard.adjustments },
          transform: { ...sourceFromClipboard.transform },
          presetId: sourceFromClipboard.presetId,
          filterId: sourceFromClipboard.filterId,
        }
      : snapshotFromPhoto(sourcePhoto!);

    const before: Record<string, EditSnapshot> = {};
    for (const id of targetIds) {
      const p = state.photos.find((x) => x.id === id);
      if (p) before[id] = snapshotFromPhoto(p);
    }

    const label =
      scope === 'all'
        ? `Applying to all ${targetIds.length} photos…`
        : scope === 'clipboard-selected'
          ? `Pasting to ${targetIds.length} photos…`
          : `Applying to ${targetIds.length} selected…`;

    set({
      batchBusy: true,
      batchApplyBefore: before,
      batchProgress: {
        open: true,
        label,
        current: 0,
        total: targetIds.length,
        phase: 'running',
      },
      ...(scope === 'all' ? { selectedIds: targetIds } : {}),
    });

    for (let i = 0; i < targetIds.length; i++) {
      if (get().batchProgress?.phase === 'cancelled') {
        const restore = get().batchApplyBefore;
        if (restore) {
          set((s) => ({
            photos: s.photos.map((p) => {
              const snap = restore[p.id];
              return snap ? applySnapshot(p, snap) : p;
            }),
            batchBusy: false,
            batchApplyBefore: null,
            batchProgress: {
              open: true,
              label: 'Batch cancelled',
              current: i,
              total: targetIds.length,
              phase: 'cancelled',
            },
          }));
        } else {
          set({ batchBusy: false, batchApplyBefore: null, batchProgress: null });
        }
        window.setTimeout(() => {
          if (get().batchProgress?.phase === 'cancelled') {
            set({ batchProgress: null });
          }
        }, 700);
        return;
      }

      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 42);
      });

      const id = targetIds[i]!;
      set((s) => ({
        photos: s.photos.map((p) =>
          p.id === id
            ? {
                ...p,
                adjustments: { ...sourceSnap.adjustments },
                transform: { ...sourceSnap.transform },
                presetId: sourceSnap.presetId,
                filterId: sourceSnap.filterId,
              }
            : p,
        ),
        batchProgress: s.batchProgress
          ? {
              ...s.batchProgress,
              current: i + 1,
              label:
                i + 1 >= targetIds.length
                  ? 'Finishing…'
                  : `Processing ${i + 1} of ${targetIds.length}…`,
            }
          : null,
      }));
    }

    if (get().batchProgress?.phase !== 'running') return;

    const undoEntry: BatchUndoEntry = {
      id: createId('batch'),
      label:
        scope === 'all'
          ? `Batch · all (${targetIds.length})`
          : scope === 'clipboard-selected'
            ? `Batch · paste (${targetIds.length})`
            : `Batch · selected (${targetIds.length})`,
      timestamp: Date.now(),
      before,
    };

    set((s) => ({
      batchBusy: false,
      batchApplyBefore: null,
      batchUndoStack: [...s.batchUndoStack, undoEntry].slice(-12),
      batchProgress: {
        open: true,
        label: `Applied to ${targetIds.length} photos`,
        current: targetIds.length,
        total: targetIds.length,
        phase: 'done',
      },
    }));

    window.setTimeout(() => {
      if (get().batchProgress?.phase === 'done') {
        set({ batchProgress: null });
      }
    }, 1100);
  },

  cancelBatchApply: () => {
    const progress = get().batchProgress;
    if (!progress) return;
    if (progress.phase === 'running') {
      set({
        batchProgress: { ...progress, phase: 'cancelled', label: 'Cancelling…' },
      });
      return;
    }
    set({ batchProgress: null, batchBusy: false, batchApplyBefore: null });
  },

  dismissBatchProgress: () => {
    if (get().batchProgress?.phase === 'running') return;
    set({ batchProgress: null });
  },

  setBatchPreview: (on) => {
    const state = get();
    if (state.batchBusy) return;

    if (!on) {
      const baseline = state.batchPreviewBaseline;
      if (!baseline) {
        set({ batchPreviewActive: false, batchPreviewBaseline: null });
        return;
      }
      set({
        batchPreviewActive: false,
        batchPreviewBaseline: null,
        photos: state.photos.map((p) => {
          const snap = baseline[p.id];
          return snap ? applySnapshot(p, snap) : p;
        }),
      });
      return;
    }

    const source = state.getActivePhoto();
    if (!source || !state.selectedIds.length) return;

    if (state.batchPreviewActive && state.batchPreviewBaseline) {
      // Refresh preview from current source while keeping original baselines
      const baseline = state.batchPreviewBaseline;
      const sourceSnap = snapshotFromPhoto(source);
      set({
        photos: state.photos.map((p) => {
          if (!state.selectedIds.includes(p.id) || p.id === source.id) return p;
          return {
            ...p,
            adjustments: { ...sourceSnap.adjustments },
            transform: { ...sourceSnap.transform },
            presetId: sourceSnap.presetId,
            filterId: sourceSnap.filterId,
          };
        }),
        batchPreviewBaseline: baseline,
        batchPreviewActive: true,
      });
      return;
    }

    const baseline: Record<string, EditSnapshot> = {};
    const sourceSnap = snapshotFromPhoto(source);
    const nextPhotos = state.photos.map((p) => {
      if (!state.selectedIds.includes(p.id) || p.id === source.id) return p;
      baseline[p.id] = snapshotFromPhoto(p);
      return {
        ...p,
        adjustments: { ...sourceSnap.adjustments },
        transform: { ...sourceSnap.transform },
        presetId: sourceSnap.presetId,
        filterId: sourceSnap.filterId,
      };
    });

    set({
      batchPreviewActive: true,
      batchPreviewBaseline: baseline,
      photos: nextPhotos,
    });
  },

  undoBatchEdit: () => {
    const state = get();
    if (state.batchBusy || !state.batchUndoStack.length) return;
    if (state.batchPreviewActive) get().setBatchPreview(false);

    const stack = state.batchUndoStack;
    const entry = stack[stack.length - 1]!;
    set({
      photos: state.photos.map((p) => {
        const snap = entry.before[p.id];
        return snap ? applySnapshot(p, snap) : p;
      }),
      batchUndoStack: stack.slice(0, -1),
    });
  },

  undo: () => {
    const state = get();
    if (state.historyIndex < 0) return;
    const prevIndex = state.historyIndex - 1;
    const current = state.history[state.historyIndex];
    if (!current) return;

    if (prevIndex < 0) {
      set({
        historyIndex: -1,
        photos: state.photos.map((p) =>
          p.id === current.photoId
            ? {
                ...p,
                adjustments: { ...DEFAULT_ADJUSTMENTS },
                transform: { ...DEFAULT_TRANSFORM },
                presetId: null,
                filterId: null,
              }
            : p,
        ),
      });
      return;
    }

    const entry = state.history[prevIndex];
    if (!entry) {
      set({ historyIndex: prevIndex });
      return;
    }

    set({
      historyIndex: prevIndex,
      activePhotoId: entry.photoId,
      photos: state.photos.map((p) =>
        p.id === entry.photoId ? applySnapshot(p, entry.snapshot) : p,
      ),
    });
  },

  redo: () => {
    const state = get();
    if (state.historyIndex >= state.history.length - 1) return;
    const nextIndex = state.historyIndex + 1;
    const entry = state.history[nextIndex];
    if (!entry) return;
    set({
      historyIndex: nextIndex,
      activePhotoId: entry.photoId,
      photos: state.photos.map((p) =>
        p.id === entry.photoId ? applySnapshot(p, entry.snapshot) : p,
      ),
    });
  },

  addSnapshot: (label) => {
    const state = get();
    const photo = state.getActivePhoto();
    if (!photo) return;
    const hist = pushHistory(state.history, state.historyIndex, {
      id: createId('snap'),
      label: label || `Snapshot ${state.history.filter((h) => h.isSnapshot).length + 1}`,
      photoId: photo.id,
      snapshot: snapshotFromPhoto(photo),
      timestamp: Date.now(),
      isSnapshot: true,
    });
    set(hist);
  },

  restoreHistory: (entryId) => {
    const state = get();
    const entry = state.history.find((h) => h.id === entryId);
    if (!entry) return;
    const index = state.history.findIndex((h) => h.id === entryId);
    set({
      historyIndex: index,
      activePhotoId: entry.photoId,
      photos: state.photos.map((p) =>
        p.id === entry.photoId ? applySnapshot(p, entry.snapshot) : p,
      ),
    });
  },

  clearHistory: () => set({ history: [], historyIndex: -1 }),

  setExportOpen: (open) => set({ exportOpen: open }),
  setExportSettings: (patch) =>
    set((s) => ({ exportSettings: { ...s.exportSettings, ...patch } })),

  toggleSection: (id) =>
    set((s) => ({
      expandedSections: { ...s.expandedSections, [id]: !s.expandedSections[id] },
    })),

  setThumbSize: (size) => set({ thumbSize: Math.min(120, Math.max(48, size)) }),

  runAiEnhance: () => {
    void get().runAiTool('ai-enhance');
  },

  runAiTool: async (toolId) => {
    const tool = getAiTool(toolId);
    const state = get();
    const photo = state.getActivePhoto();
    if (!tool || !photo) return;
    if (state.aiJob?.status === 'running') return;

    const token = state.aiCancelToken + 1;
    set({
      aiCancelToken: token,
      activeTool: toolId,
      aiResult: null,
      aiJob: {
        toolId,
        status: 'running',
        progress: 0,
        stage: tool.stages[0] ?? 'Processing…',
        stageIndex: 0,
        stageCount: tool.stages.length,
      },
    });

    const stepMs = Math.max(280, Math.floor(tool.durationMs / Math.max(tool.stages.length, 1)));

    for (let i = 0; i < tool.stages.length; i++) {
      if (get().aiCancelToken !== token) {
        set({
          aiJob: {
            toolId,
            status: 'cancelled',
            progress: Math.round((i / tool.stages.length) * 100),
            stage: 'Cancelled',
            stageIndex: i,
            stageCount: tool.stages.length,
          },
        });
        window.setTimeout(() => {
          if (get().aiJob?.status === 'cancelled') set({ aiJob: null });
        }, 600);
        return;
      }

      set({
        aiJob: {
          toolId,
          status: 'running',
          progress: Math.round((i / tool.stages.length) * 100),
          stage: tool.stages[i]!,
          stageIndex: i,
          stageCount: tool.stages.length,
        },
      });

      // Smooth progress ticks within each stage
      const ticks = 5;
      for (let t = 1; t <= ticks; t++) {
        if (get().aiCancelToken !== token) return;
        await new Promise<void>((r) => window.setTimeout(r, stepMs / ticks));
        const base = i / tool.stages.length;
        const frac = t / ticks / tool.stages.length;
        set((s) =>
          s.aiJob
            ? {
                aiJob: {
                  ...s.aiJob,
                  progress: Math.min(99, Math.round((base + frac) * 100)),
                },
              }
            : {},
        );
      }
    }

    if (get().aiCancelToken !== token) return;

    set({
      aiJob: {
        toolId,
        status: 'done',
        progress: 100,
        stage: 'Preview ready',
        stageIndex: tool.stages.length - 1,
        stageCount: tool.stages.length,
      },
      aiResult: {
        toolId,
        previewMode: tool.previewMode,
        faceBoxes: toolId === 'face-detect' ? mockFaceBoxes(photo.id) : [],
        applied: false,
      },
    });
  },

  cancelAiTool: () => {
    set((s) => ({
      aiCancelToken: s.aiCancelToken + 1,
      aiJob:
        s.aiJob?.status === 'running'
          ? { ...s.aiJob, status: 'cancelled' as const, stage: 'Cancelled' }
          : s.aiJob,
    }));
    window.setTimeout(() => {
      if (get().aiJob?.status === 'cancelled') set({ aiJob: null });
    }, 700);
  },

  applyAiResult: () => {
    const state = get();
    const result = state.aiResult;
    const tool = result ? getAiTool(result.toolId) : null;
    const photo = state.getActivePhoto();
    if (!result || !tool || !photo || result.applied) return;

    // Face detection is preview-only — no pixel changes
    if (result.toolId === 'face-detect') {
      set({
        aiResult: { ...result, applied: true },
        aiJob: null,
      });
      return;
    }

    const nextAdj = mergeAdjustments(photo.adjustments, tool.adjustments);
    const nextPhoto = { ...photo, adjustments: nextAdj, presetId: null };
    const hist = pushHistory(state.history, state.historyIndex, {
      id: createId('hist'),
      label: tool.historyLabel,
      photoId: photo.id,
      snapshot: snapshotFromPhoto(nextPhoto),
      timestamp: Date.now(),
    });
    set({
      photos: state.photos.map((p) => (p.id === photo.id ? nextPhoto : p)),
      aiResult: { ...result, applied: true },
      aiJob: null,
      ...hist,
    });
  },

  discardAiResult: () => {
    set({ aiResult: null, aiJob: null });
  },

  setLeftCollapsed: (on) => set({ leftCollapsed: on }),
  toggleLeftCollapsed: () => set((s) => ({ leftCollapsed: !s.leftCollapsed })),
  setLeftDrawerOpen: (on) => set({ leftDrawerOpen: on }),
  setRightCollapsed: (on) => set({ rightCollapsed: on }),
  toggleRightCollapsed: () => set((s) => ({ rightCollapsed: !s.rightCollapsed })),
  setRightSheetOpen: (on) => set({ rightSheetOpen: on }),
  openInspector: () =>
    set((s) => {
      if (s.breakpoint === 'mobile' || s.breakpoint === 'tablet') {
        return { rightSheetOpen: true };
      }
      return { rightCollapsed: false };
    }),
  setBreakpoint: (bp) =>
    set(() => {
      const next: {
        breakpoint: typeof bp;
        leftCollapsed?: boolean;
        leftDrawerOpen?: boolean;
        rightCollapsed?: boolean;
        rightSheetOpen?: boolean;
      } = { breakpoint: bp };
      if (bp === 'mobile') {
        next.leftCollapsed = true;
        next.leftDrawerOpen = false;
        next.rightCollapsed = true;
      } else if (bp === 'tablet') {
        next.leftCollapsed = true;
        next.leftDrawerOpen = false;
        next.rightCollapsed = true;
        next.rightSheetOpen = false;
      } else if (bp === 'laptop') {
        next.leftCollapsed = true;
        next.leftDrawerOpen = false;
        next.rightSheetOpen = false;
      } else {
        next.leftDrawerOpen = false;
        next.rightSheetOpen = false;
      }
      return next;
    }),

  addPhotos: (items) => {
    const mapped: PhotoItem[] = items.map((item) => ({
      ...item,
      adjustments: { ...DEFAULT_ADJUSTMENTS },
      transform: { ...DEFAULT_TRANSFORM },
      presetId: null,
      filterId: null,
    }));
    set((s) => ({
      photos: [...s.photos, ...mapped],
      selectedIds: [...s.selectedIds, ...mapped.map((p) => p.id)],
      activePhotoId: mapped[0]?.id ?? s.activePhotoId,
      isImageLoading: true,
    }));
  },
}));
