import {
  Plus,
  Type,
  Image as ImageIcon,
  Shapes,
  Paintbrush,
  Frame,
  Scan,
  Sparkles,
  AlignCenterHorizontal,
  Layers,
  Grid3X3,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEditorStore } from '../../store';
import { cn } from '@/lib/utils';

export function CanvasToolbar() {
  const addPage = useEditorStore((s) => s.addPage);
  const addHeading = useEditorStore((s) => s.addHeading);
  const addParagraph = useEditorStore((s) => s.addParagraph);

  const tools = [
    { id: 'page', label: 'Add Page', icon: Plus, onClick: addPage },
    { id: 'text', label: 'Text', icon: Type, onClick: addHeading },
    {
      id: 'image',
      label: 'Image',
      icon: ImageIcon,
      onClick: () => toast('Pick a photo from Elements panel'),
    },
    {
      id: 'shapes',
      label: 'Shapes',
      icon: Shapes,
      onClick: () => toast('Shapes coming soon'),
    },
    {
      id: 'bg',
      label: 'Background',
      icon: Paintbrush,
      onClick: () => toast('Use Background tab on the left'),
    },
    {
      id: 'frame',
      label: 'Frame',
      icon: Frame,
      onClick: () => toast('Frames coming soon'),
    },
    {
      id: 'mask',
      label: 'Mask',
      icon: Scan,
      onClick: () => toast('Masks coming soon'),
    },
    {
      id: 'ai',
      label: 'AI Auto Layout',
      icon: Sparkles,
      onClick: () => {
        addParagraph();
        toast.success('AI layout applied (demo)');
      },
      accent: true,
    },
  ] as const;

  const rightTools = [
    { id: 'align', label: 'Align', icon: AlignCenterHorizontal },
    { id: 'arrange', label: 'Arrange', icon: Layers },
    { id: 'grid', label: 'Grid', icon: Grid3X3 },
  ] as const;

  return (
    <div className="flex h-11 shrink-0 items-center gap-0.5 overflow-x-auto border-b border-[#E8EAEF] bg-white px-2">
      {tools.map((t) => (
        <button
          key={t.id}
          type="button"
          aria-label={t.label}
          onClick={t.onClick}
          className={cn(
            'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold transition-colors',
            'accent' in t && t.accent
              ? 'bg-[#F3EEFF] text-[#6B46FE] hover:bg-[#EBE4FF]'
              : 'text-[#5B6472] hover:bg-[#F5F6F8]',
          )}
        >
          <t.icon className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">{t.label}</span>
        </button>
      ))}
      <div className="mx-1 hidden h-5 w-px bg-[#E8EAEF] sm:block" />
      {rightTools.map((t) => (
        <button
          key={t.id}
          type="button"
          aria-label={t.label}
          onClick={() => toast(`${t.label} tools coming soon`)}
          className="ml-auto inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold text-[#5B6472] hover:bg-[#F5F6F8] first:ml-auto sm:ml-0"
        >
          <t.icon className="h-3.5 w-3.5" />
          <span className="hidden xl:inline">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
