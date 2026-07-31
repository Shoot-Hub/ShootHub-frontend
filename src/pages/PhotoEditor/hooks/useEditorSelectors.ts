import { usePhotoEditorStore } from '../store';
import type { PhotoItem } from '../types';

/** Active photo from the Zustand store — shared across panels. */
export function useActivePhoto(): PhotoItem | null {
  return usePhotoEditorStore((s) => s.getActivePhoto());
}

export function useHistoryControls() {
  const undo = usePhotoEditorStore((s) => s.undo);
  const redo = usePhotoEditorStore((s) => s.redo);
  const history = usePhotoEditorStore((s) => s.history);
  const historyIndex = usePhotoEditorStore((s) => s.historyIndex);

  return {
    undo,
    redo,
    history,
    historyIndex,
    canUndo: historyIndex >= 0,
    canRedo: historyIndex < history.length - 1,
  };
}

export function useEditorLayout() {
  const breakpoint = usePhotoEditorStore((s) => s.breakpoint);
  const leftCollapsed = usePhotoEditorStore((s) => s.leftCollapsed);
  const leftDrawerOpen = usePhotoEditorStore((s) => s.leftDrawerOpen);
  const rightCollapsed = usePhotoEditorStore((s) => s.rightCollapsed);
  const rightSheetOpen = usePhotoEditorStore((s) => s.rightSheetOpen);
  const setLeftDrawerOpen = usePhotoEditorStore((s) => s.setLeftDrawerOpen);
  const setRightSheetOpen = usePhotoEditorStore((s) => s.setRightSheetOpen);
  const toggleLeftCollapsed = usePhotoEditorStore((s) => s.toggleLeftCollapsed);
  const toggleRightCollapsed = usePhotoEditorStore((s) => s.toggleRightCollapsed);
  const openInspector = usePhotoEditorStore((s) => s.openInspector);

  const isCompact = breakpoint === 'mobile' || breakpoint === 'tablet';
  const showDockedRight = !isCompact && !rightCollapsed;

  return {
    breakpoint,
    leftCollapsed,
    leftDrawerOpen,
    rightCollapsed,
    rightSheetOpen,
    isCompact,
    showDockedRight,
    setLeftDrawerOpen,
    setRightSheetOpen,
    toggleLeftCollapsed,
    toggleRightCollapsed,
    openInspector,
  };
}
