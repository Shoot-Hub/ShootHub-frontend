import {
  bindHistoryAutoSave,
  bindHistoryRestorer,
  bindHistorySnapshotProvider,
  useHistoryStore,
} from './historyStore';
import { useTimelineStore } from './timelineStore';
import { useUiStore } from './uiStore';
import { useMediaStore } from './mediaStore';
import { usePlaybackStore } from './playbackStore';
import { useSelectionStore } from './selectionStore';

let bound = false;

/** Wire cross-store history restore / autosave once. */
export function bindEditorStores() {
  if (bound) return;
  bound = true;

  bindHistoryRestorer((snapshot) => {
    useTimelineStore.getState().restoreSnapshot(snapshot.clips, snapshot.tracks);
  });

  bindHistorySnapshotProvider(() => {
    const { clips, tracks } = useTimelineStore.getState();
    return {
      clips: structuredClone(clips),
      tracks: structuredClone(tracks),
    };
  });

  bindHistoryAutoSave((label) => {
    useUiStore.getState().setAutoSaveLabel(label);
  });
}

/**
 * Compatibility facade for Phase 1 components.
 * Prefer domain stores (useTimelineStore, useMediaStore, …) for new code.
 */
export function useVideoEditorStore<T>(
  selector: (state: CompatibilityState) => T,
): T {
  // Subscribe to all domain stores so selector stays reactive
  const media = useMediaStore();
  const timeline = useTimelineStore();
  const playback = usePlaybackStore();
  const selection = useSelectionStore();
  const history = useHistoryStore();
  const ui = useUiStore();

  const combined: CompatibilityState = {
    ...media,
    ...timeline,
    ...playback,
    ...selection,
    ...history,
    ...ui,
    // aliases used by Phase 1
    selectClip: selection.selectClip,
    splitSelectedClip: () => timeline.splitClipAtPlayhead(),
    deleteSelectedClip: () => timeline.deleteClip(),
    pushHistory: history.pushLabel,
    undo: history.undo,
    redo: history.redo,
    importMediaFiles: (files: File[]) => {
      void media.importMediaFiles(files);
    },
  };

  return selector(combined);
}

type CompatibilityState = Omit<
  ReturnType<typeof useMediaStore.getState>,
  'importMediaFiles'
> &
  ReturnType<typeof useTimelineStore.getState> &
  ReturnType<typeof usePlaybackStore.getState> &
  ReturnType<typeof useSelectionStore.getState> &
  ReturnType<typeof useHistoryStore.getState> &
  ReturnType<typeof useUiStore.getState> & {
    selectClip: (id: string | null) => void;
    splitSelectedClip: () => void;
    deleteSelectedClip: () => void;
    pushHistory: (label: string) => void;
    undo: () => void;
    redo: () => void;
    importMediaFiles: (files: File[]) => void;
  };

export {
  useMediaStore,
  useTimelineStore,
  usePlaybackStore,
  useSelectionStore,
  useHistoryStore,
  useUiStore,
};
