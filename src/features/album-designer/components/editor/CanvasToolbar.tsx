import {
  MousePointer2,
  Frame,
  Image as ImageIcon,
  Type,
  Shapes,
  Minus,
  Paintbrush,
  Scan,
  Layers,
  AlignCenterHorizontal,
  Grid3X3,
  Ruler,
  Magnet,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useEditorStore, useEditorUiStore } from '../../store';

export function CanvasToolbar() {
  const addHeading = useEditorStore((s) => s.addHeading);
  const applyAiAutoLayout = useEditorStore((s) => s.applyAiAutoLayout);
  const setLeftPanel = useEditorUiStore((s) => s.setLeftPanel);
  const showGrid = useEditorUiStore((s) => s.showGrid);
  const showGuides = useEditorUiStore((s) => s.showGuides);
  const showRulers = useEditorUiStore((s) => s.showRulers);
  const toggleGrid = useEditorUiStore((s) => s.toggleGrid);
  const toggleGuides = useEditorUiStore((s) => s.toggleGuides);
  const toggleRulers = useEditorUiStore((s) => s.toggleRulers);

  const tools = [
    { id: 'pointer', label: 'Select', icon: MousePointer2, onClick: () => toast('Select tool active') },
    { id: 'frame', label: 'Frame', icon: Frame, onClick: () => setLeftPanel('frames') },
    { id: 'image', label: 'Image', icon: ImageIcon, onClick: () => setLeftPanel('photos') },
    { id: 'text', label: 'Text', icon: Type, onClick: addHeading },
    { id: 'shape', label: 'Shape', icon: Shapes, onClick: () => setLeftPanel('shapes') },
    { id: 'line', label: 'Line', icon: Minus, onClick: () => setLeftPanel('elements') },
    { id: 'bg', label: 'Background', icon: Paintbrush, onClick: () => setLeftPanel('background') },
    { id: 'mask', label: 'Mask', icon: Scan, onClick: () => toast('Mask tools — select a photo') },
    { id: 'arrange', label: 'Arrange', icon: Layers, onClick: () => useEditorUiStore.getState().setRightPanel('layers') },
    { id: 'align', label: 'Align', icon: AlignCenterHorizontal, onClick: () => toast('Alignment guides on') },
  ] as const;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center px-3">
      <div className="pointer-events-auto ad-glass flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full px-1.5 py-1 shadow-[var(--ad-shadow-float)]">
        {tools.map((t) => (
          <button
            key={t.id}
            type="button"
            title={t.label}
            onClick={t.onClick}
            className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-2.5 text-[10px] font-bold text-[var(--ad-ink-soft)] hover:bg-[var(--ad-primary-soft)] hover:text-[var(--ad-primary)]"
          >
            <t.icon className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">{t.label}</span>
          </button>
        ))}
        <div className="mx-0.5 h-4 w-px shrink-0 bg-[var(--ad-border)]" />
        <TogglePill label="Grid" icon={Grid3X3} active={showGrid} onClick={toggleGrid} />
        <TogglePill label="Ruler" icon={Ruler} active={showRulers} onClick={toggleRulers} />
        <TogglePill label="Snap" icon={Magnet} active={showGuides} onClick={toggleGuides} />
        <button
          type="button"
          onClick={() => {
            applyAiAutoLayout();
            toast.success('AI layout applied');
          }}
          className="ml-0.5 inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-[var(--ad-primary)] px-2.5 text-[10px] font-bold text-white"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">AI Layout</span>
        </button>
      </div>
    </div>
  );
}

function TogglePill({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: typeof Grid3X3;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={cn(
        'inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-2.5 text-[10px] font-bold transition',
        active
          ? 'bg-[var(--ad-primary-soft)] text-[var(--ad-primary)]'
          : 'text-[var(--ad-ink-soft)] hover:bg-[#F5F6F8]',
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="hidden 2xl:inline">{label}</span>
    </button>
  );
}
