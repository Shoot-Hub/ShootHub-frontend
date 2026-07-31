import { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { usePhotoEditorStore } from '../store';
import { HOTKEY_OPTS, PHOTO_EDITOR_SHORTCUTS } from '../constants/shortcuts';

export function usePhotoEditorKeyboard() {
  const undo = usePhotoEditorStore((s) => s.undo);
  const redo = usePhotoEditorStore((s) => s.redo);
  const toggleCompareMode = usePhotoEditorStore((s) => s.toggleCompareMode);
  const setExportOpen = usePhotoEditorStore((s) => s.setExportOpen);
  const copyEdits = usePhotoEditorStore((s) => s.copyEdits);
  const pasteEdits = usePhotoEditorStore((s) => s.pasteEdits);
  const resetActiveAdjustments = usePhotoEditorStore((s) => s.resetActiveAdjustments);
  const addSnapshot = usePhotoEditorStore((s) => s.addSnapshot);
  const setActiveTool = usePhotoEditorStore((s) => s.setActiveTool);

  useHotkeys([...PHOTO_EDITOR_SHORTCUTS.undo.keys], (e) => {
    e.preventDefault();
    undo();
  }, HOTKEY_OPTS);

  useHotkeys([...PHOTO_EDITOR_SHORTCUTS.redo.keys], (e) => {
    e.preventDefault();
    redo();
  }, HOTKEY_OPTS);

  useHotkeys([...PHOTO_EDITOR_SHORTCUTS.compare.keys], () => toggleCompareMode());

  useHotkeys([...PHOTO_EDITOR_SHORTCUTS.export.keys], (e) => {
    e.preventDefault();
    setExportOpen(true);
  }, HOTKEY_OPTS);

  useHotkeys([...PHOTO_EDITOR_SHORTCUTS.copyEdits.keys], (e) => {
    e.preventDefault();
    copyEdits();
  }, HOTKEY_OPTS);

  useHotkeys([...PHOTO_EDITOR_SHORTCUTS.pasteEdits.keys], (e) => {
    e.preventDefault();
    pasteEdits();
  }, HOTKEY_OPTS);

  useHotkeys([...PHOTO_EDITOR_SHORTCUTS.reset.keys], (e) => {
    e.preventDefault();
    resetActiveAdjustments();
  }, HOTKEY_OPTS);

  useHotkeys([...PHOTO_EDITOR_SHORTCUTS.snapshot.keys], (e) => {
    e.preventDefault();
    addSnapshot();
    setActiveTool('history');
  }, HOTKEY_OPTS);
}

export function useFullscreenSync() {
  const isFullscreen = usePhotoEditorStore((s) => s.isFullscreen);
  const setFullscreen = usePhotoEditorStore((s) => s.setFullscreen);

  useEffect(() => {
    const onChange = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, [setFullscreen]);

  useEffect(() => {
    const root = document.documentElement;
    if (isFullscreen && !document.fullscreenElement) {
      void root.requestFullscreen?.();
    } else if (!isFullscreen && document.fullscreenElement) {
      void document.exitFullscreen?.();
    }
  }, [isFullscreen]);
}
