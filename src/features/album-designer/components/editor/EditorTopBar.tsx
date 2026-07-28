import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Undo2,
  Redo2,
  Save,
  Eye,
  Copy,
  ClipboardPaste,
  Files,
  Trash2,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ChevronLeft,
  Pencil,
  Bell,
  FileDown,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEditorStore, useEditorUiStore } from '../../store';
import { ToolIconButton } from '../atoms/ToolIconButton';
import shoothubLogo from '@/assets/landing/shoothub-logo-mark.png';

type Props = {
  lastSavedLabel: string;
  onRename?: () => void;
};

const EXPORT_OPTIONS = [
  { id: 'pdf', label: 'Export PDF', hint: 'High quality · RGB' },
  { id: 'png', label: 'Export PNG', hint: 'Lossless pages' },
  { id: 'jpg', label: 'Export JPG', hint: 'Compressed previews' },
  { id: 'print', label: 'Export Print Ready', hint: '300 DPI · CMYK preview' },
  { id: 'zip', label: 'Export ZIP', hint: 'All pages bundled' },
] as const;

export function EditorTopBar({ lastSavedLabel, onRename }: Props) {
  const album = useEditorStore((s) => s.album);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const past = useEditorStore((s) => s.past);
  const future = useEditorStore((s) => s.future);
  const save = useEditorStore((s) => s.save);
  const duplicateSelected = useEditorStore((s) => s.duplicateSelected);
  const deleteSelected = useEditorStore((s) => s.deleteSelected);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const copySelected = useEditorStore((s) => s.copySelected);
  const pasteClipboard = useEditorStore((s) => s.pasteClipboard);
  const applyAiSmartAlbum = useEditorStore((s) => s.applyAiSmartAlbum);
  const zoom = useEditorUiStore((s) => s.zoom);
  const zoomIn = useEditorUiStore((s) => s.zoomIn);
  const zoomOut = useEditorUiStore((s) => s.zoomOut);
  const resetZoom = useEditorUiStore((s) => s.resetZoom);
  const exportMenuOpen = useEditorUiStore((s) => s.exportMenuOpen);
  const setExportMenuOpen = useEditorUiStore((s) => s.setExportMenuOpen);
  const menuRef = useRef<HTMLDivElement>(null);
  const [aiBusy, setAiBusy] = useState(false);

  useEffect(() => {
    if (!exportMenuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setExportMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [exportMenuOpen, setExportMenuOpen]);

  if (!album) return null;

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--ad-border)] bg-white px-2 sm:gap-3 sm:px-4">
      <Link to="/creator/album-designer" className="hidden items-center gap-2 lg:flex">
        <img src={shoothubLogo} alt="ShootHub" className="h-7 w-auto object-contain" />
      </Link>
      <Link
        to="/creator/album-designer"
        aria-label="Back"
        className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-[var(--ad-ink-soft)] hover:bg-[#F5F6F8] lg:hidden"
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      <div className="flex min-w-0 items-center gap-1.5 text-sm">
        <Link
          to="/creator/album-designer"
          className="hidden truncate text-[var(--ad-ink-muted)] hover:text-[var(--ad-primary)] sm:inline"
        >
          Album Designer
        </Link>
        <span className="hidden text-[#C0C4CC] sm:inline">/</span>
        <button
          type="button"
          onClick={onRename}
          className="group flex min-w-0 items-center gap-1.5 font-semibold text-[var(--ad-ink)]"
        >
          <span className="truncate max-w-[120px] sm:max-w-[200px]">{album.info.name || 'Untitled Album'}</span>
          <Pencil className="h-3.5 w-3.5 shrink-0 text-[var(--ad-ink-muted)] opacity-100 sm:opacity-0 sm:group-hover:opacity-100" />
        </button>
      </div>

      <div className="mx-auto hidden items-center gap-0.5 rounded-[12px] bg-[#F5F6F8] p-1 md:flex">
        <ToolIconButton compact icon={<Undo2 className="h-4 w-4" />} aria-label="Undo" disabled={!past.length} onClick={undo} />
        <ToolIconButton compact icon={<Redo2 className="h-4 w-4" />} aria-label="Redo" disabled={!future.length} onClick={redo} />
        <div className="mx-0.5 h-4 w-px bg-[var(--ad-border)]" />
        <ToolIconButton
          compact
          icon={<Copy className="h-4 w-4" />}
          aria-label="Copy"
          disabled={!selectedIds.length}
          onClick={() => {
            copySelected();
            toast.success('Copied');
          }}
        />
        <ToolIconButton
          compact
          icon={<ClipboardPaste className="h-4 w-4" />}
          aria-label="Paste"
          onClick={() => {
            if (!useEditorStore.getState().clipboard) return toast.error('Clipboard empty');
            pasteClipboard();
            toast.success('Pasted');
          }}
        />
        <ToolIconButton compact icon={<Files className="h-4 w-4" />} aria-label="Duplicate" disabled={!selectedIds.length} onClick={duplicateSelected} />
        <ToolIconButton compact icon={<Trash2 className="h-4 w-4" />} aria-label="Delete" disabled={!selectedIds.length} onClick={deleteSelected} />
        <div className="mx-0.5 h-4 w-px bg-[var(--ad-border)]" />
        <ToolIconButton compact icon={<ZoomOut className="h-4 w-4" />} aria-label="Zoom out" onClick={zoomOut} />
        <button
          type="button"
          onClick={resetZoom}
          className="h-8 min-w-[48px] rounded-[10px] text-[11px] font-bold text-[var(--ad-ink-soft)] hover:bg-white"
        >
          {zoom}%
        </button>
        <ToolIconButton compact icon={<ZoomIn className="h-4 w-4" />} aria-label="Zoom in" onClick={zoomIn} />
        <ToolIconButton icon={<Eye className="h-3.5 w-3.5" />} label="Preview" onClick={() => toast('Preview coming soon')} />
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <span className="hidden text-[11px] font-semibold text-[var(--ad-ink-muted)] lg:inline">
          Auto-Saved {lastSavedLabel}
        </span>
        <ToolIconButton
          className="hidden sm:inline-flex"
          icon={<Save className="h-3.5 w-3.5" />}
          label="Save"
          onClick={() => {
            save('draft');
            toast.success('Draft saved');
          }}
        />
        <button
          type="button"
          disabled={aiBusy}
          onClick={async () => {
            setAiBusy(true);
            await new Promise((r) => setTimeout(r, 600));
            applyAiSmartAlbum();
            save('in_progress');
            setAiBusy(false);
            toast.success('AI album generated');
          }}
          className="hidden h-9 items-center gap-1.5 rounded-[10px] border border-[#C9B8FF] bg-[var(--ad-primary-soft)] px-2.5 text-[11px] font-bold text-[var(--ad-primary)] hover:bg-[var(--ad-primary-mid)] lg:inline-flex"
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI Generate
        </button>
        <button
          type="button"
          className="hidden h-9 w-9 items-center justify-center rounded-[10px] text-[var(--ad-ink-soft)] hover:bg-[#F5F6F8] xl:inline-flex"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <div className="hidden items-center gap-2 rounded-[12px] border border-[var(--ad-border)] bg-[#F8F9FB] py-1 pl-1 pr-2.5 xl:flex">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--ad-primary)] text-[10px] font-bold text-white">
            YB
          </div>
          <div className="leading-tight">
            <p className="text-[11px] font-bold text-[var(--ad-ink)]">Yuvraj Baloriya</p>
            <p className="text-[9px] font-semibold text-[var(--ad-primary)]">Premium Member</p>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-[var(--ad-primary)] px-3 text-xs font-semibold text-white shadow-[0_8px_20px_-8px_var(--ad-primary-glow)] hover:bg-[var(--ad-primary-hover)]"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-80" />
          </button>
          {exportMenuOpen ? (
            <div className="absolute right-0 top-11 z-50 w-64 overflow-hidden rounded-[16px] border border-[var(--ad-border)] bg-white p-1.5 shadow-[var(--ad-shadow-float)]">
              {EXPORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    save(opt.id === 'print' || opt.id === 'pdf' ? 'completed' : 'draft');
                    setExportMenuOpen(false);
                    toast.success(`${opt.label} ready`);
                  }}
                  className="flex w-full flex-col rounded-[12px] px-3 py-2.5 text-left hover:bg-[var(--ad-primary-soft)]"
                >
                  <span className="text-[12px] font-bold text-[var(--ad-ink)]">{opt.label}</span>
                  <span className="text-[10px] font-medium text-[var(--ad-ink-muted)]">{opt.hint}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
