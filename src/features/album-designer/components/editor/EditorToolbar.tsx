import {
  Undo2,
  Redo2,
  Type,
  AlignLeft,
  Plus,
  Copy,
  Trash2,
  Save,
  CheckCircle2,
  Keyboard,
} from 'lucide-react';
import { useState } from 'react';
import { useEditorStore } from '../../store';
import { EDITOR_SHORTCUTS } from '../../constants';
import toast from 'react-hot-toast';

type Props = {
  onBack: () => void;
};

export function EditorToolbar({ onBack }: Props) {
  const album = useEditorStore((s) => s.album);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const past = useEditorStore((s) => s.past);
  const future = useEditorStore((s) => s.future);
  const addHeading = useEditorStore((s) => s.addHeading);
  const addParagraph = useEditorStore((s) => s.addParagraph);
  const addPage = useEditorStore((s) => s.addPage);
  const duplicateSelected = useEditorStore((s) => s.duplicateSelected);
  const deleteSelected = useEditorStore((s) => s.deleteSelected);
  const save = useEditorStore((s) => s.save);
  const [showShortcuts, setShowShortcuts] = useState(false);

  if (!album) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-[#EEF0F4] bg-white px-3 py-2.5 sm:px-4">
      <button
        type="button"
        onClick={onBack}
        className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#636E72] hover:bg-[#F8F9FB]"
      >
        ← Back
      </button>
      <div className="hidden h-6 w-px bg-[#EEF0F4] sm:block" />
      <p className="max-w-[160px] truncate text-sm font-bold text-[#2D3436] sm:max-w-xs">
        {album.info.name}
      </p>

      <div className="ml-auto flex flex-wrap items-center gap-1">
        <IconBtn label="Undo" disabled={!past.length} onClick={undo}>
          <Undo2 className="h-4 w-4" />
        </IconBtn>
        <IconBtn label="Redo" disabled={!future.length} onClick={redo}>
          <Redo2 className="h-4 w-4" />
        </IconBtn>
        <div className="mx-1 hidden h-6 w-px bg-[#EEF0F4] sm:block" />
        <IconBtn label="Add heading" onClick={addHeading}>
          <Type className="h-4 w-4" />
        </IconBtn>
        <IconBtn label="Add paragraph" onClick={addParagraph}>
          <AlignLeft className="h-4 w-4" />
        </IconBtn>
        <IconBtn label="Add page" onClick={addPage}>
          <Plus className="h-4 w-4" />
        </IconBtn>
        <IconBtn label="Duplicate" onClick={duplicateSelected}>
          <Copy className="h-4 w-4" />
        </IconBtn>
        <IconBtn label="Delete" onClick={deleteSelected}>
          <Trash2 className="h-4 w-4" />
        </IconBtn>
        <div className="relative">
          <IconBtn label="Shortcuts" onClick={() => setShowShortcuts((v) => !v)}>
            <Keyboard className="h-4 w-4" />
          </IconBtn>
          {showShortcuts && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowShortcuts(false)} />
              <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-[#EEF0F4] bg-white p-3 shadow-xl">
                <p className="mb-2 text-xs font-bold text-[#2D3436]">Keyboard Shortcuts</p>
                <ul className="space-y-1.5">
                  {EDITOR_SHORTCUTS.map((s) => (
                    <li key={s.action} className="flex justify-between gap-2 text-[11px]">
                      <span className="text-[#A0A4B0]">{s.action}</span>
                      <kbd className="rounded border border-[#EEF0F4] bg-[#F8F9FB] px-1.5 font-semibold text-[#636E72]">
                        {s.keys}
                      </kbd>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            save('draft');
            toast.success('Draft saved');
          }}
          className="ml-1 inline-flex items-center gap-1.5 rounded-xl border border-[#EEF0F4] px-3 py-2 text-xs font-semibold text-[#636E72] hover:bg-[#F8F9FB]"
        >
          <Save className="h-3.5 w-3.5" />
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            save('completed');
            toast.success('Album marked completed');
          }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] px-3 py-2 text-xs font-semibold text-white shadow-md shadow-[#6B46FE]/25"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Complete
        </button>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-[#636E72] transition-colors hover:bg-[#F8F9FB] disabled:opacity-30"
    >
      {children}
    </button>
  );
}
