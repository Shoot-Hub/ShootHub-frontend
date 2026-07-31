import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  Copy,
  ClipboardPaste,
  Trash2,
  CheckSquare,
  Square,
  Image as ImageIcon,
  Layers,
  Files,
} from 'lucide-react';

export type FilmContextAction =
  | 'activate'
  | 'select'
  | 'deselect'
  | 'selectAll'
  | 'deselectAll'
  | 'copy'
  | 'paste'
  | 'apply'
  | 'duplicate'
  | 'remove';

type Props = {
  open: boolean;
  x: number;
  y: number;
  photoName: string;
  selected: boolean;
  selectionCount: number;
  canPaste: boolean;
  onClose: () => void;
  onAction: (action: FilmContextAction) => void;
};

function Row({
  children,
  onClick,
  danger,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="pe-ctx-item disabled:opacity-40"
      data-danger={danger ? '1' : undefined}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function FilmStripContextMenu({
  open,
  x,
  y,
  photoName,
  selected,
  selectionCount,
  canPaste,
  onClose,
  onAction,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !ref.current) return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const pad = 8;
    let left = x;
    let top = y;
    if (left + rect.width > window.innerWidth - pad) left = window.innerWidth - rect.width - pad;
    if (top + rect.height > window.innerHeight - pad) top = window.innerHeight - rect.height - pad;
    el.style.setProperty('--pe-ctx-x', `${Math.max(pad, left)}px`);
    el.style.setProperty('--pe-ctx-y', `${Math.max(pad, top)}px`);
  }, [open, x, y]);

  if (!open) return null;

  const run = (action: FilmContextAction) => {
    onAction(action);
    onClose();
  };

  return createPortal(
    <div
      ref={ref}
      className="photo-editor-root pe-ctx-menu pe-ctx-menu--fixed"
      role="menu"
      aria-label="Photo actions"
    >
      <div className="truncate px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--pe-ink-muted)]">
        {photoName}
      </div>
      <Row onClick={() => run('activate')}>
        <ImageIcon className="h-3.5 w-3.5 text-[var(--pe-primary)]" />
        Open photo
      </Row>
      {selected ? (
        <Row onClick={() => run('deselect')}>
          <Square className="h-3.5 w-3.5" />
          Deselect
        </Row>
      ) : (
        <Row onClick={() => run('select')}>
          <CheckSquare className="h-3.5 w-3.5" />
          Select
        </Row>
      )}
      <div className="pe-ctx-sep" />
      <Row onClick={() => run('copy')}>
        <Copy className="h-3.5 w-3.5" />
        Copy edits
      </Row>
      <Row onClick={() => run('paste')} disabled={!canPaste}>
        <ClipboardPaste className="h-3.5 w-3.5" />
        Paste edits
      </Row>
      <Row onClick={() => run('apply')}>
        <Layers className="h-3.5 w-3.5" />
        Apply to {selectionCount || 1} selected
      </Row>
      <Row onClick={() => run('duplicate')}>
        <Files className="h-3.5 w-3.5" />
        Duplicate
      </Row>
      <div className="pe-ctx-sep" />
      <Row onClick={() => run('selectAll')}>
        <CheckSquare className="h-3.5 w-3.5" />
        Select all
      </Row>
      <Row onClick={() => run('deselectAll')}>
        <Square className="h-3.5 w-3.5" />
        Deselect all
      </Row>
      <div className="pe-ctx-sep" />
      <Row onClick={() => run('remove')} danger>
        <Trash2 className="h-3.5 w-3.5" />
        Remove from strip
      </Row>
    </div>,
    document.body,
  );
}
