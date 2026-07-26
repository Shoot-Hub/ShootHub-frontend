import { Link } from 'react-router-dom';
import {
  Undo2,
  Redo2,
  Save,
  Eye,
  Share2,
  ChevronDown,
  ChevronLeft,
  Pencil,
  Cloud,
  FileDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEditorStore } from '../../store';
import shoothubLogo from '@/assets/landing/shoothub-logo-mark.png';

type Props = {
  lastSavedLabel: string;
  onRename?: () => void;
};

export function EditorTopBar({ lastSavedLabel, onRename }: Props) {
  const album = useEditorStore((s) => s.album);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const past = useEditorStore((s) => s.past);
  const future = useEditorStore((s) => s.future);
  const save = useEditorStore((s) => s.save);

  if (!album) return null;

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[#E8EAEF] bg-white px-3 sm:px-4">
      <Link to="/creator/album-designer" className="hidden items-center gap-2 lg:flex">
        <img src={shoothubLogo} alt="ShootHub" className="h-7 w-auto object-contain" />
      </Link>
      <Link
        to="/creator/album-designer"
        aria-label="Back to Album Designer"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#636E72] hover:bg-[#F5F6F8] lg:hidden"
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      <div className="flex min-w-0 items-center gap-1.5 text-sm">
        <Link
          to="/creator/album-designer"
          className="hidden truncate text-[#8B93A1] hover:text-[#6B46FE] sm:inline"
        >
          Album Designer
        </Link>
        <span className="hidden text-[#C0C4CC] sm:inline">/</span>
        <button
          type="button"
          onClick={onRename}
          className="group flex min-w-0 items-center gap-1.5 font-semibold text-[#2D3436]"
        >
          <span className="truncate">{album.info.name || 'Untitled Album'}</span>
          <Pencil className="h-3.5 w-3.5 shrink-0 text-[#A0A4B0] opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100" />
        </button>
      </div>

      <div className="mx-auto hidden items-center gap-1.5 rounded-full bg-[#F3F4F7] px-3 py-1 text-xs font-medium text-[#8B93A1] md:flex">
        <Cloud className="h-3.5 w-3.5 text-[#28C76F]" />
        Autosaved {lastSavedLabel}
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          aria-label="Undo"
          disabled={!past.length}
          onClick={undo}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#5B6472] hover:bg-[#F5F6F8] disabled:opacity-30 sm:w-auto sm:gap-1.5 sm:px-2.5 sm:text-xs sm:font-semibold"
        >
          <Undo2 className="h-4 w-4" />
          <span className="hidden sm:inline">Undo</span>
        </button>
        <button
          type="button"
          aria-label="Redo"
          disabled={!future.length}
          onClick={redo}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#5B6472] hover:bg-[#F5F6F8] disabled:opacity-30 sm:w-auto sm:gap-1.5 sm:px-2.5 sm:text-xs sm:font-semibold"
        >
          <Redo2 className="h-4 w-4" />
          <span className="hidden sm:inline">Redo</span>
        </button>

        <button
          type="button"
          onClick={() => {
            save('draft');
            toast.success('Draft saved');
          }}
          className="hidden h-9 items-center gap-1.5 rounded-lg border border-[#E8EAEF] bg-white px-3 text-xs font-semibold text-[#5B6472] hover:bg-[#F8F9FB] sm:inline-flex"
        >
          <Save className="h-3.5 w-3.5" />
          Save Draft
        </button>
        <button
          type="button"
          onClick={() => toast('Preview coming soon')}
          className="hidden h-9 items-center gap-1.5 rounded-lg border border-[#E8EAEF] bg-white px-3 text-xs font-semibold text-[#5B6472] hover:bg-[#F8F9FB] md:inline-flex"
        >
          <Eye className="h-3.5 w-3.5" />
          Preview
        </button>
        <button
          type="button"
          onClick={() => toast('Share link copied (demo)')}
          className="hidden h-9 items-center gap-1.5 rounded-lg border border-[#E8EAEF] bg-white px-3 text-xs font-semibold text-[#5B6472] hover:bg-[#F8F9FB] lg:inline-flex"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </button>

        <button
          type="button"
          onClick={() => {
            save('completed');
            toast.success('Export ready — album saved');
          }}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#6B46FE] px-3 text-xs font-semibold text-white shadow-sm shadow-[#6B46FE]/25 hover:bg-[#5A38F0]"
        >
          <FileDown className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export PDF</span>
          <span className="sm:hidden">Export</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-80" />
        </button>
      </div>
    </header>
  );
}
