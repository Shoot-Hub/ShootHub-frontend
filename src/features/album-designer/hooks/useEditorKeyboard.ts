import { useEffect } from 'react';
import { useEditorStore, useEditorUiStore } from '../store';

export function useEditorKeyboard() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const store = useEditorStore.getState();
      const ui = useEditorUiStore.getState();
      const meta = e.metaKey || e.ctrlKey;

      if (e.code === 'Space' && !meta) {
        e.preventDefault();
        ui.setSpacePanning(true);
        return;
      }

      if (meta && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        store.undo();
        return;
      }
      if (meta && ((e.key.toLowerCase() === 'z' && e.shiftKey) || e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        store.redo();
        return;
      }
      if (meta && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        store.copySelected();
        return;
      }
      if (meta && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        store.pasteClipboard();
        return;
      }
      if (meta && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        store.duplicateSelected();
        return;
      }
      if (meta && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        const page = store.getCurrentPage();
        if (page) store.select(page.elements.map((el) => el.id));
        return;
      }
      if (meta && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        ui.zoomIn();
        return;
      }
      if (meta && e.key === '-') {
        e.preventDefault();
        ui.zoomOut();
        return;
      }
      if (e.key === 'Escape') {
        store.clearSelection();
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        store.deleteSelected();
        return;
      }

      const arrows: Record<string, { dx: number; dy: number }> = {
        ArrowLeft: { dx: -1, dy: 0 },
        ArrowRight: { dx: 1, dy: 0 },
        ArrowUp: { dx: 0, dy: -1 },
        ArrowDown: { dx: 0, dy: 1 },
      };
      const delta = arrows[e.key];
      if (delta) {
        e.preventDefault();
        const step = e.shiftKey ? 5 : 1;
        store.getSelectedElements().forEach((el) => {
          store.updateElement(el.id, {
            x: Math.min(95, Math.max(0, el.x + delta.dx * step)),
            y: Math.min(95, Math.max(0, el.y + delta.dy * step)),
          });
        });
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        useEditorUiStore.getState().setSpacePanning(false);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const ui = useEditorUiStore.getState();
      if (e.deltaY < 0) ui.zoomIn();
      else ui.zoomOut();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('wheel', onWheel);
    };
  }, []);
}
