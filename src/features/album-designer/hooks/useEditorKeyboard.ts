import { useEffect } from 'react';
import { useEditorStore } from '../store';

export function useEditorKeyboard() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const store = useEditorStore.getState();
      const meta = e.metaKey || e.ctrlKey;

      if (meta && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        store.undo();
        return;
      }
      if (meta && e.key.toLowerCase() === 'z' && e.shiftKey) {
        e.preventDefault();
        store.redo();
        return;
      }
      if (meta && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        store.redo();
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

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
