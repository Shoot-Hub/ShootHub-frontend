import { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Crop,
  ImageMinus,
  Palette,
  CheckCircle2,
  HelpCircle,
  Loader2,
  LayoutTemplate,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useEditorStore } from '../../store';

export function AiToolsBar() {
  const applyAiSmartAlbum = useEditorStore((s) => s.applyAiSmartAlbum);
  const applyAiAutoLayout = useEditorStore((s) => s.applyAiAutoLayout);
  const save = useEditorStore((s) => s.save);
  const [busy, setBusy] = useState<'smart' | 'layout' | null>(null);

  const runSmartAlbum = async () => {
    setBusy('smart');
    await new Promise((r) => setTimeout(r, 700));
    applyAiSmartAlbum();
    save('in_progress');
    setBusy(null);
    toast.success('AI Smart Album ready — pages designed from your photos');
  };

  const runAutoLayout = async () => {
    setBusy('layout');
    await new Promise((r) => setTimeout(r, 450));
    applyAiAutoLayout();
    setBusy(null);
    toast.success('AI Auto Layout applied to this page');
  };

  const tools = [
    {
      id: 'enhance',
      label: 'AI Enhance',
      icon: Wand2,
      onClick: () => toast.success('AI Enhance applied (demo)'),
    },
    {
      id: 'crop',
      label: 'AI Smart Crop',
      icon: Crop,
      onClick: () => toast.success('AI Smart Crop applied (demo)'),
    },
    {
      id: 'bg',
      label: 'AI Background',
      icon: ImageMinus,
      onClick: () => toast.success('Background cleaned (demo)'),
    },
    {
      id: 'color',
      label: 'AI Color Match',
      icon: Palette,
      onClick: () => toast.success('Colors matched across spread (demo)'),
    },
  ] as const;

  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-t border-[var(--ad-border)] bg-white px-3">
      <button
        type="button"
        disabled={busy !== null}
        onClick={runSmartAlbum}
        className={cn(
          'inline-flex h-9 items-center gap-2 rounded-[12px] bg-gradient-to-r from-[#6B46FE] to-[#8B5CF6] px-3 text-[11px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(107,70,254,0.45)]',
          'hover:brightness-105 disabled:opacity-70',
        )}
      >
        {busy === 'smart' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
        <span className="hidden sm:inline">AI Smart Album</span>
        <span className="sm:hidden">AI Album</span>
      </button>

      <button
        type="button"
        disabled={busy !== null}
        onClick={runAutoLayout}
        className="hidden h-9 items-center gap-2 rounded-[12px] border border-[#C9B8FF] bg-[var(--ad-primary-soft)] px-3 text-[11px] font-bold text-[var(--ad-primary)] hover:bg-[var(--ad-primary-mid)] md:inline-flex"
      >
        {busy === 'layout' ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <LayoutTemplate className="h-3.5 w-3.5" />
        )}
        <span className="flex flex-col items-start leading-tight">
          <span>AI Auto Layout</span>
          <span className="text-[9px] font-medium opacity-80">Design beautiful pages in seconds</span>
        </span>
      </button>

      <div className="ad-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
        {tools.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={t.onClick}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[10px] px-2.5 text-[11px] font-semibold text-[var(--ad-ink-soft)] hover:bg-[#F5F6F8] hover:text-[var(--ad-ink)]"
          >
            <t.icon className="h-3.5 w-3.5 text-[var(--ad-primary)]" />
            <span className="hidden lg:inline">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="ml-auto hidden items-center gap-3 sm:flex">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--ad-success)]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          All changes saved
        </span>
        <button
          type="button"
          onClick={() => toast('Shortcuts: Ctrl+Z undo · Space pan · Ctrl+wheel zoom')}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--ad-border)] bg-[#F8F9FB] px-3 text-[11px] font-bold text-[var(--ad-ink-soft)] hover:bg-white"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          Need Help?
        </button>
      </div>
    </div>
  );
}
