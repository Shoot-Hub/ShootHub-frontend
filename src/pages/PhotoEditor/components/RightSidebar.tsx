import type { ReactNode } from 'react';
import {
  SunMedium,
  Palette,
  Aperture,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { EDITOR_FILTERS } from '../data';
import { usePhotoEditorStore } from '../store';
import { adjustmentsToCssFilter, formatAdjustmentValue, mergeAdjustments, resetAdjustments } from '../utils';
import type { Adjustments } from '../types';
import { AccordionSection, AdjustmentSlider, FilterScope } from './ui';
import { PresetsPanel } from './PresetsPanel';
import { BatchPanel } from './BatchPanel';
import { HistoryPanel } from './HistoryPanel';
import { AiEditingPanel } from './AiEditingPanel';
import { isAiToolId } from '../data';

const LIGHT_KEYS: (keyof Adjustments)[] = [
  'exposure',
  'contrast',
  'highlights',
  'shadows',
  'whites',
  'blacks',
];

const COLOR_KEYS: (keyof Adjustments)[] = [
  'temperature',
  'tint',
  'saturation',
  'vibrance',
];

const DETAIL_KEYS: (keyof Adjustments)[] = ['sharpen', 'blur'];
const EFFECT_KEYS: (keyof Adjustments)[] = ['vignette'];

const LABELS: Record<keyof Adjustments, string> = {
  exposure: 'Exposure',
  contrast: 'Contrast',
  highlights: 'Highlights',
  shadows: 'Shadows',
  whites: 'Whites',
  blacks: 'Blacks',
  temperature: 'Temperature',
  tint: 'Tint',
  saturation: 'Saturation',
  vibrance: 'Vibrance',
  sharpen: 'Sharpen',
  blur: 'Blur',
  vignette: 'Vignette',
};

function SliderGroup({ keys }: { keys: (keyof Adjustments)[] }) {
  const photo = usePhotoEditorStore((s) => s.getActivePhoto());
  const setAdjustmentLive = usePhotoEditorStore((s) => s.setAdjustmentLive);
  const commitAdjustment = usePhotoEditorStore((s) => s.commitAdjustment);
  if (!photo) return null;

  return (
    <>
      {keys.map((key) => {
        const isExposure = key === 'exposure';
        return (
          <AdjustmentSlider
            key={key}
            label={LABELS[key]}
            value={photo.adjustments[key]}
            min={isExposure ? -2 : key === 'blur' || key === 'sharpen' || key === 'vignette' ? 0 : -100}
            max={isExposure ? 2 : 100}
            step={isExposure ? 0.05 : 1}
            displayValue={formatAdjustmentValue(key, photo.adjustments[key])}
            onChange={(v) => setAdjustmentLive(key, v)}
            onCommit={(v) => commitAdjustment(key, v)}
          />
        );
      })}
    </>
  );
}

function AdjustPanel() {
  const expanded = usePhotoEditorStore((s) => s.expandedSections);
  const toggleSection = usePhotoEditorStore((s) => s.toggleSection);
  const resetActiveAdjustments = usePhotoEditorStore((s) => s.resetActiveAdjustments);

  return (
    <div className="flex h-full flex-col">
      <div className="pe-scrollbar flex-1 overflow-y-auto px-3">
        <AccordionSection
          id="light"
          title="Light"
          icon={<SunMedium className="h-3.5 w-3.5" />}
          open={!!expanded.light}
          onToggle={() => toggleSection('light')}
        >
          <SliderGroup keys={LIGHT_KEYS} />
        </AccordionSection>
        <AccordionSection
          id="color"
          title="Color"
          icon={<Palette className="h-3.5 w-3.5" />}
          open={!!expanded.color}
          onToggle={() => toggleSection('color')}
        >
          <SliderGroup keys={COLOR_KEYS} />
        </AccordionSection>
        <AccordionSection
          id="details"
          title="Details"
          icon={<Aperture className="h-3.5 w-3.5" />}
          open={!!expanded.details}
          onToggle={() => toggleSection('details')}
        >
          <SliderGroup keys={DETAIL_KEYS} />
        </AccordionSection>
        <AccordionSection
          id="effects"
          title="Effects"
          icon={<Sparkles className="h-3.5 w-3.5" />}
          open={!!expanded.effects}
          onToggle={() => toggleSection('effects')}
        >
          <SliderGroup keys={EFFECT_KEYS} />
        </AccordionSection>
      </div>
      <div className="border-t border-[var(--pe-border)] p-3">
        <button
          type="button"
          onClick={resetActiveAdjustments}
          className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-[var(--pe-border-strong)] bg-[var(--pe-elevated)] py-2.5 text-xs font-semibold text-[var(--pe-ink-soft)] transition-colors hover:border-[var(--pe-primary)]/40 hover:text-[var(--pe-primary)]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Adjustments
        </button>
      </div>
    </div>
  );
}

function FiltersPanel() {
  const photo = usePhotoEditorStore((s) => s.getActivePhoto());
  const applyFilter = usePhotoEditorStore((s) => s.applyFilter);

  return (
    <div className="pe-scrollbar grid grid-cols-2 gap-2 overflow-y-auto p-3">
      {EDITOR_FILTERS.map((filter) => {
        const active =
          (filter.id === 'none' && !photo?.filterId) || photo?.filterId === filter.id;
        const previewAdj = filter.adjustments
          ? mergeAdjustments(resetAdjustments(), filter.adjustments)
          : resetAdjustments();
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => applyFilter(filter.id)}
            className={`overflow-hidden rounded-[14px] border-2 text-left transition-all ${
              active
                ? 'border-[var(--pe-primary)] shadow-[0_0_0_1px_var(--pe-primary-glow)]'
                : 'border-transparent hover:border-[var(--pe-border-strong)]'
            }`}
          >
            <div className="aspect-square overflow-hidden bg-[var(--pe-elevated)]">
              {photo ? (
                <FilterScope
                  cssFilter={adjustmentsToCssFilter(previewAdj)}
                  vignette={previewAdj.vignette / 100}
                  className="h-full w-full"
                >
                  <img
                    src={photo.thumb}
                    alt=""
                    className="pe-filtered-img h-full w-full object-cover"
                  />
                </FilterScope>
              ) : null}
            </div>
            <p className="bg-[var(--pe-surface-2)] px-2 py-1.5 text-[11px] font-bold text-[var(--pe-ink)]">
              {filter.name}
            </p>
          </button>
        );
      })}
    </div>
  );
}

function SideShell({
  title,
  subtitle,
  children,
  embedded,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  embedded?: boolean;
}) {
  if (embedded) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-[var(--pe-surface)]">
        {children}
      </div>
    );
  }
  return (
    <aside className="flex h-full w-[min(300px,32vw)] shrink-0 flex-col overflow-hidden border-l border-[var(--pe-border)] bg-[var(--pe-surface)] lg:w-[300px]">
      <div className="shrink-0 border-b border-[var(--pe-border)] px-4 py-3">
        <h3 className="text-sm font-bold text-[var(--pe-ink)]">{title}</h3>
        <p className="text-[11px] text-[var(--pe-ink-muted)]">{subtitle}</p>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </aside>
  );
}

export function RightSidebar({ embedded = false }: { embedded?: boolean }) {
  const rightTab = usePhotoEditorStore((s) => s.rightTab);
  const setRightTab = usePhotoEditorStore((s) => s.setRightTab);
  const activeTool = usePhotoEditorStore((s) => s.activeTool);

  if (activeTool === 'batch') {
    return (
      <SideShell embedded={embedded} title="Batch Edit" subtitle="Copy & apply across photos">
        <BatchPanel />
      </SideShell>
    );
  }

  if (activeTool === 'history') {
    return (
      <SideShell embedded={embedded} title="History" subtitle="Undo timeline & snapshots">
        <HistoryPanel />
      </SideShell>
    );
  }

  if (isAiToolId(activeTool)) {
    return (
      <SideShell embedded={embedded} title="AI Editing" subtitle="Mock studio · no API required">
        <AiEditingPanel />
      </SideShell>
    );
  }

  const tabs = (
    <Tabs.Root
      value={rightTab}
      onValueChange={(v) => setRightTab(v as typeof rightTab)}
      className="flex h-full min-h-0 flex-col"
    >
      <Tabs.List className="flex shrink-0 gap-1 border-b border-[var(--pe-border)] px-3 pt-2">
        {(['adjust', 'presets', 'filters'] as const).map((tab) => (
          <Tabs.Trigger
            key={tab}
            value={tab}
            className="group relative flex-1 px-2 py-2.5 text-[12px] font-bold capitalize text-[var(--pe-ink-muted)] transition-colors data-[state=active]:text-[var(--pe-primary)]"
          >
            {tab}
            <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[var(--pe-primary)] opacity-0 transition-opacity group-data-[state=active]:opacity-100" />
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <Tabs.Content value="adjust" className="min-h-0 flex-1 overflow-hidden outline-none">
        <AdjustPanel />
      </Tabs.Content>
      <Tabs.Content value="presets" className="min-h-0 flex-1 overflow-hidden outline-none">
        <PresetsPanel />
      </Tabs.Content>
      <Tabs.Content value="filters" className="min-h-0 flex-1 overflow-hidden outline-none">
        <FiltersPanel />
      </Tabs.Content>
    </Tabs.Root>
  );

  if (embedded) {
    return <div className="flex min-h-0 flex-1 flex-col">{tabs}</div>;
  }

  return (
    <aside className="flex h-full w-[min(300px,32vw)] shrink-0 flex-col overflow-hidden border-l border-[var(--pe-border)] bg-[var(--pe-surface)] lg:w-[300px]">
      {tabs}
    </aside>
  );
}
