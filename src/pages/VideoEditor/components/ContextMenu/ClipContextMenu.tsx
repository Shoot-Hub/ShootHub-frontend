import { useEffect, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Copy,
  ClipboardPaste,
  Scissors,
  Trash2,
  SplitSquareVertical,
  Files,
  SlidersHorizontal,
} from 'lucide-react';
import { useSelectionStore, useTimelineStore, useUiStore } from '../../store';

const ITEMS = [
  { id: 'cut', label: 'Cut', icon: Scissors },
  { id: 'copy', label: 'Copy', icon: Copy },
  { id: 'paste', label: 'Paste', icon: ClipboardPaste },
  { id: 'duplicate', label: 'Duplicate', icon: Files },
  { id: 'split', label: 'Split', icon: SplitSquareVertical },
  { id: 'delete', label: 'Delete', icon: Trash2 },
  { id: 'properties', label: 'Properties', icon: SlidersHorizontal },
] as const;

export function ClipContextMenu() {
  const contextMenu = useSelectionStore((s) => s.contextMenu);
  const closeContextMenu = useSelectionStore((s) => s.closeContextMenu);
  const cutSelected = useTimelineStore((s) => s.cutSelected);
  const copySelected = useTimelineStore((s) => s.copySelected);
  const pasteClipboard = useTimelineStore((s) => s.pasteClipboard);
  const duplicateClip = useTimelineStore((s) => s.duplicateClip);
  const splitClipAtPlayhead = useTimelineStore((s) => s.splitClipAtPlayhead);
  const deleteClip = useTimelineStore((s) => s.deleteClip);
  const setPropertiesOpen = useUiStore((s) => s.setPropertiesOpen);

  useEffect(() => {
    if (!contextMenu.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeContextMenu();
    };
    const onClick = () => closeContextMenu();
    window.addEventListener('keydown', onKey);
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('click', onClick);
    };
  }, [contextMenu.open, closeContextMenu]);

  const run = (id: (typeof ITEMS)[number]['id']) => {
    const clipId = contextMenu.clipId;
    switch (id) {
      case 'cut':
        cutSelected();
        break;
      case 'copy':
        copySelected();
        break;
      case 'paste':
        pasteClipboard();
        break;
      case 'duplicate':
        duplicateClip(clipId);
        break;
      case 'split':
        splitClipAtPlayhead(clipId);
        break;
      case 'delete':
        deleteClip(clipId);
        break;
      case 'properties':
        setPropertiesOpen(true);
        break;
      default:
        break;
    }
    closeContextMenu();
  };

  return (
    <AnimatePresence>
      {contextMenu.open ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="video-editor-root fixed z-[70] min-w-[180px] overflow-hidden rounded-[14px] border border-[var(--ve-border-strong)] bg-[var(--ve-surface)] py-1 shadow-[var(--ve-shadow-float)] [left:var(--ve-menu-x)] [top:var(--ve-menu-y)]"
          style={
            {
              '--ve-menu-x': `${contextMenu.x}px`,
              '--ve-menu-y': `${contextMenu.y}px`,
            } as CSSProperties
          }
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          {ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => run(item.id)}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[12px] font-semibold text-[var(--ve-ink-soft)] transition-colors hover:bg-[var(--ve-elevated)] hover:text-[var(--ve-ink)]"
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
