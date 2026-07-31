import { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  useHistoryStore,
  usePlaybackStore,
  useTimelineStore,
  useUiStore,
} from '../store';

export function useVideoEditorKeyboard() {
  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);
  const togglePlay = usePlaybackStore((s) => s.togglePlay);
  const stepFrame = usePlaybackStore((s) => s.stepFrame);
  const stop = usePlaybackStore((s) => s.stop);
  const splitClipAtPlayhead = useTimelineStore((s) => s.splitClipAtPlayhead);
  const deleteClip = useTimelineStore((s) => s.deleteClip);
  const copySelected = useTimelineStore((s) => s.copySelected);
  const pasteClipboard = useTimelineStore((s) => s.pasteClipboard);
  const duplicateClip = useTimelineStore((s) => s.duplicateClip);
  const cutSelected = useTimelineStore((s) => s.cutSelected);
  const setExportOpen = useUiStore((s) => s.setExportOpen);
  const setShortcutsOpen = useUiStore((s) => s.setShortcutsOpen);
  const setSnapEnabled = useTimelineStore((s) => s.setSnapEnabled);
  const snapEnabled = useTimelineStore((s) => s.snapEnabled);

  useHotkeys('mod+z', (e) => {
    e.preventDefault();
    undo();
  });
  useHotkeys('mod+shift+z, mod+y', (e) => {
    e.preventDefault();
    redo();
  });
  useHotkeys(
    'space',
    (e) => {
      e.preventDefault();
      togglePlay();
    },
    { enableOnFormTags: false },
  );
  useHotkeys('left', () => stepFrame(-1));
  useHotkeys('right', () => stepFrame(1));
  useHotkeys('home', () => stop());
  useHotkeys('s', () => splitClipAtPlayhead());
  useHotkeys('delete, backspace', (e) => {
    e.preventDefault();
    deleteClip();
  });
  useHotkeys('mod+c', (e) => {
    e.preventDefault();
    copySelected();
  });
  useHotkeys('mod+v', (e) => {
    e.preventDefault();
    pasteClipboard();
  });
  useHotkeys('mod+x', (e) => {
    e.preventDefault();
    cutSelected();
  });
  useHotkeys('mod+d', (e) => {
    e.preventDefault();
    duplicateClip();
  });
  useHotkeys('mod+e', (e) => {
    e.preventDefault();
    setExportOpen(true);
  });
  useHotkeys('mod+/', (e) => {
    e.preventDefault();
    setShortcutsOpen(true);
  });
  useHotkeys('n', () => setSnapEnabled(!snapEnabled));
}

export function usePlaybackTicker() {
  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const playbackSpeed = usePlaybackStore((s) => s.playbackSpeed);
  const fps = usePlaybackStore((s) => s.fps);
  const setCurrentFrame = usePlaybackStore((s) => s.setCurrentFrame);
  const pause = usePlaybackStore((s) => s.pause);
  const totalFrames = usePlaybackStore((s) => s.totalFrames);
  const loop = usePlaybackStore((s) => s.loop);

  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = 1000 / (fps * playbackSpeed);
    const id = window.setInterval(() => {
      const state = usePlaybackStore.getState();
      const next = state.currentFrame + 1;
      if (next >= state.totalFrames) {
        if (state.loop) {
          setCurrentFrame(0);
          return;
        }
        pause();
        setCurrentFrame(state.totalFrames);
        return;
      }
      setCurrentFrame(next);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [isPlaying, playbackSpeed, fps, totalFrames, setCurrentFrame, pause, loop]);
}

export function useFullscreenSync() {
  const isFullscreen = useUiStore((s) => s.isFullscreen);
  const setFullscreen = useUiStore((s) => s.setFullscreen);

  useEffect(() => {
    const onChange = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, [setFullscreen]);

  useEffect(() => {
    if (isFullscreen && !document.fullscreenElement) {
      void document.documentElement.requestFullscreen?.();
    } else if (!isFullscreen && document.fullscreenElement) {
      void document.exitFullscreen?.();
    }
  }, [isFullscreen]);
}
