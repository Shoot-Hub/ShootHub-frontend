import { useMemo, useState } from 'react';
import {
  SlidersHorizontal,
  Layers,
  History,
  Eye,
  Lock,
  Unlock,
  Trash2,
  ChevronDown,
  FlipHorizontal2,
  FlipVertical2,
  Replace,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useEditorStore, useEditorUiStore, type RightPanelId } from '../../store';
import { FONT_FAMILIES } from '../../constants';
import { getAlbumPhotoCatalog } from '../../services';
import type { PhotoElement, TextElement } from '../../types';
import { PanelSectionHeader } from '../atoms/PanelSectionHeader';

const TABS: { id: RightPanelId; label: string; icon: typeof SlidersHorizontal }[] = [
  { id: 'properties', label: 'Properties', icon: SlidersHorizontal },
  { id: 'layers', label: 'Layers', icon: Layers },
  { id: 'history', label: 'History', icon: History },
];

export function EditorRightPanel() {
  const rightPanel = useEditorUiStore((s) => s.rightPanel);
  const setRightPanel = useEditorUiStore((s) => s.setRightPanel);
  const rightCollapsed = useEditorUiStore((s) => s.rightCollapsed);
  const album = useEditorStore((s) => s.album);

  if (!album || rightCollapsed) return null;

  const tab = (['properties', 'layers', 'history'] as RightPanelId[]).includes(rightPanel)
    ? rightPanel
    : 'properties';

  return (
    <aside className="hidden h-full w-[280px] shrink-0 flex-col border-l border-[var(--ad-border)] bg-white xl:flex">
      <div className="flex border-b border-[var(--ad-border-soft)] px-1 pt-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setRightPanel(t.id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 border-b-2 py-2.5 text-[11px] font-bold transition',
              tab === t.id
                ? 'border-[var(--ad-primary)] text-[var(--ad-primary)]'
                : 'border-transparent text-[var(--ad-ink-muted)] hover:text-[var(--ad-ink)]',
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>
      <div className="ad-scrollbar min-h-0 flex-1 overflow-y-auto p-3">
        {tab === 'properties' && <PropertiesBody />}
        {tab === 'layers' && <LayersBody />}
        {tab === 'history' && <HistoryBody />}
      </div>
    </aside>
  );
}

function useSelected() {
  const album = useEditorStore((s) => s.album);
  const currentPageIndex = useEditorStore((s) => s.currentPageIndex);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  return useMemo(() => {
    const page = album?.pages[currentPageIndex];
    if (!page) return null;
    return page.elements.find((el) => selectedIds.includes(el.id)) ?? null;
  }, [album, currentPageIndex, selectedIds]);
}

function PropertiesBody() {
  const selected = useSelected();
  const updateElement = useEditorStore((s) => s.updateElement);
  const updateElementLive = useEditorStore((s) => s.updateElementLive);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const replacePhoto = useEditorStore((s) => s.replacePhoto);
  const duplicateSelected = useEditorStore((s) => s.duplicateSelected);
  const [replaceOpen, setReplaceOpen] = useState(false);
  const [openAcc, setOpenAcc] = useState<string | null>('border');
  const catalog = useMemo(() => getAlbumPhotoCatalog(12), []);

  if (!selected) {
    return (
      <EmptyHint title="No selection" body="Select a photo or text on the canvas to edit properties." />
    );
  }

  if (selected.type === 'text') {
    return <TypographyBody force={selected} />;
  }

  const photo = selected as PhotoElement;

  return (
    <div className="space-y-4">
      <div>
        <PanelSectionHeader title="Position & Size" />
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="X" value={Math.round(photo.x)} onChange={(v) => updateElement(photo.id, { x: v })} />
          <NumberField label="Y" value={Math.round(photo.y)} onChange={(v) => updateElement(photo.id, { y: v })} />
          <NumberField label="W" value={Math.round(photo.width)} onChange={(v) => updateElement(photo.id, { width: v })} />
          <NumberField label="H" value={Math.round(photo.height)} onChange={(v) => updateElement(photo.id, { height: v })} />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <NumberField
            label="Rotation"
            value={Math.round(photo.rotation)}
            onChange={(v) => updateElement(photo.id, { rotation: v })}
          />
          <div className="flex gap-1 pt-4">
            <MiniBtn icon={FlipHorizontal2} label="H" active={photo.flipH} onClick={() => updateElement(photo.id, { flipH: !photo.flipH })} />
            <MiniBtn icon={FlipVertical2} label="V" active={photo.flipV} onClick={() => updateElement(photo.id, { flipV: !photo.flipV })} />
          </div>
        </div>
      </div>

      <div>
        <PanelSectionHeader title="Image" />
        <SliderField
          label="Opacity"
          value={Math.round(photo.opacity * 100)}
          min={10}
          max={100}
          suffix="%"
          onPointerDown={pushHistory}
          onChange={(v) => updateElementLive(photo.id, { opacity: v / 100 })}
        />
        <div className="relative mt-2">
          <ActionRow icon={Replace} label="Replace Image" onClick={() => setReplaceOpen((v) => !v)} />
          {replaceOpen ? (
            <div className="mt-2 grid grid-cols-4 gap-1.5 rounded-[12px] border border-[var(--ad-border)] bg-[#F8F9FB] p-2">
              {catalog.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    replacePhoto(photo.id, { id: p.id, url: p.url });
                    setReplaceOpen(false);
                  }}
                  className="aspect-square overflow-hidden rounded-[8px]"
                >
                  <img src={p.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="mt-2 flex items-center justify-between rounded-[12px] border border-[var(--ad-border)] px-3 py-2">
          <span className="text-[11px] font-semibold text-[var(--ad-ink-soft)]">Crop</span>
          <select
            className="rounded-[8px] border border-[var(--ad-border)] bg-[#F8F9FB] px-2 py-1 text-[11px] font-bold"
            defaultValue="fill"
            onChange={() => toast.success('Crop mode updated')}
          >
            <option value="fill">Fill</option>
            <option value="fit">Fit</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        <div className="mt-2">
          <SliderField
            label="Corner Radius"
            value={photo.borderRadius}
            min={0}
            max={48}
            suffix="px"
            onPointerDown={pushHistory}
            onChange={(v) => updateElementLive(photo.id, { borderRadius: v })}
          />
        </div>
      </div>

      {(['Border', 'Shadow', 'Filters', 'Adjustments', 'Effects'] as const).map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => {
            setOpenAcc(openAcc === name ? null : name);
            if (name === 'Shadow') updateElement(photo.id, { shadow: !photo.shadow });
            if (name === 'Border') {
              updateElement(photo.id, {
                borderWidth: photo.borderWidth > 0 ? 0 : 2,
                borderColor: '#FFFFFF',
              });
            }
            if (name === 'Filters' || name === 'Adjustments' || name === 'Effects') {
              toast.success(`${name} ready`);
            }
          }}
          className="flex w-full items-center justify-between rounded-[12px] border border-[var(--ad-border)] px-3 py-2.5 text-left text-[12px] font-bold text-[var(--ad-ink)] hover:bg-[#F8F9FB]"
        >
          {name}
          <ChevronDown className={cn('h-4 w-4 text-[var(--ad-ink-muted)] transition', openAcc === name && 'rotate-180')} />
        </button>
      ))}

      <div>
        <PanelSectionHeader title="Quick Actions" />
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => updateElement(photo.id, { zIndex: photo.zIndex + 1 })}
            className="rounded-[12px] border border-[var(--ad-border)] py-2 text-[11px] font-bold hover:bg-[var(--ad-primary-soft)]"
          >
            Bring Forward
          </button>
          <button
            type="button"
            onClick={() => updateElement(photo.id, { zIndex: Math.max(0, photo.zIndex - 1) })}
            className="rounded-[12px] border border-[var(--ad-border)] py-2 text-[11px] font-bold hover:bg-[var(--ad-primary-soft)]"
          >
            Send Backward
          </button>
          <button
            type="button"
            onClick={() => updateElement(photo.id, { locked: !photo.locked })}
            className="rounded-[12px] border border-[var(--ad-border)] py-2 text-[11px] font-bold hover:bg-[var(--ad-primary-soft)]"
          >
            {photo.locked ? 'Unlock' : 'Lock'}
          </button>
          <button
            type="button"
            onClick={duplicateSelected}
            className="rounded-[12px] border border-[var(--ad-border)] py-2 text-[11px] font-bold hover:bg-[var(--ad-primary-soft)]"
          >
            Duplicate
          </button>
        </div>
      </div>
    </div>
  );
}

function LayersBody() {
  const album = useEditorStore((s) => s.album);
  const currentPageIndex = useEditorStore((s) => s.currentPageIndex);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const select = useEditorStore((s) => s.select);
  const updateElement = useEditorStore((s) => s.updateElement);
  const deleteSelected = useEditorStore((s) => s.deleteSelected);

  const page = album?.pages[currentPageIndex];
  if (!page) return null;

  const layers = [...page.elements].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div>
      <PanelSectionHeader title="Layers" />
      <div className="space-y-1.5">
        {layers.map((el) => {
          const active = selectedIds.includes(el.id);
          return (
            <div
              key={el.id}
              className={cn(
                'flex items-center gap-2 rounded-[14px] border px-2 py-2 transition',
                active
                  ? 'border-[var(--ad-primary)] bg-[var(--ad-primary-soft)]'
                  : 'border-[var(--ad-border)] bg-white hover:bg-[#F8F9FB]',
              )}
            >
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => select([el.id])}
              >
                <p className="truncate text-[11px] font-bold text-[var(--ad-ink)]">
                  {el.type === 'photo' ? 'Photo' : 'Text'} · z{el.zIndex}
                </p>
                <p className="truncate text-[10px] text-[var(--ad-ink-muted)]">
                  {el.type === 'text' ? el.content : el.photoId}
                </p>
              </button>
              <button
                type="button"
                className="rounded-lg p-1 text-[var(--ad-ink-muted)] hover:bg-white"
                onClick={() => updateElement(el.id, { locked: !el.locked })}
              >
                {el.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                className="rounded-lg p-1 text-[var(--ad-ink-muted)] hover:bg-white"
                onClick={() => {
                  select([el.id]);
                  toast('Visibility is visual-only in demo');
                }}
              >
                <Eye className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className="rounded-lg p-1 text-[var(--ad-danger)] hover:bg-red-50"
                onClick={() => {
                  select([el.id]);
                  deleteSelected();
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
        {!layers.length ? <EmptyHint title="Empty page" body="Add photos or text to see layers." /> : null}
      </div>
    </div>
  );
}

function HistoryBody() {
  const past = useEditorStore((s) => s.past);
  const future = useEditorStore((s) => s.future);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);

  return (
    <div>
      <PanelSectionHeader title="History" />
      <div className="mb-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={!past.length}
          onClick={undo}
          className="rounded-[12px] border border-[var(--ad-border)] py-2 text-[11px] font-bold disabled:opacity-40"
        >
          Undo ({past.length})
        </button>
        <button
          type="button"
          disabled={!future.length}
          onClick={redo}
          className="rounded-[12px] border border-[var(--ad-border)] py-2 text-[11px] font-bold disabled:opacity-40"
        >
          Redo ({future.length})
        </button>
      </div>
      <div className="space-y-1.5">
        {[...past].reverse().slice(0, 12).map((_, i) => (
          <div
            key={i}
            className="rounded-[12px] border border-[var(--ad-border-soft)] bg-[#F8F9FB] px-3 py-2 text-[11px] font-semibold text-[var(--ad-ink-soft)]"
          >
            Edit · {past.length - i} steps ago
          </div>
        ))}
        {!past.length ? <EmptyHint title="Fresh canvas" body="Edits will appear here as you work." /> : null}
      </div>
    </div>
  );
}

function TypographyBody({ force }: { force?: TextElement }) {
  const selectedFromStore = useSelected();
  const selected = force ?? (selectedFromStore?.type === 'text' ? selectedFromStore : null);
  const updateElement = useEditorStore((s) => s.updateElement);
  const updateElementLive = useEditorStore((s) => s.updateElementLive);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  if (!selected || selected.type !== 'text') {
    return <EmptyHint title="Typography" body="Select a text layer to refine type." />;
  }

  return (
    <div className="space-y-3">
      <PanelSectionHeader title="Typography" />
      <label className="block text-[10px] font-bold uppercase tracking-wide text-[var(--ad-ink-muted)]">
        Content
        <textarea
          value={selected.content}
          onChange={(e) => updateElement(selected.id, { content: e.target.value })}
          rows={3}
          className="mt-1 w-full rounded-[12px] border border-[var(--ad-border)] bg-[#F8F9FB] p-2 text-xs font-medium outline-none focus:ring-2 focus:ring-[var(--ad-primary)]/30"
        />
      </label>
      <label className="block text-[10px] font-bold uppercase tracking-wide text-[var(--ad-ink-muted)]">
        Font
        <select
          value={selected.fontFamily}
          onChange={(e) => updateElement(selected.id, { fontFamily: e.target.value })}
          className="mt-1 h-9 w-full rounded-[12px] border border-[var(--ad-border)] bg-[#F8F9FB] px-2 text-xs font-semibold"
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-2">
        <NumberField
          label="Size"
          value={selected.fontSize}
          onChange={(v) => updateElement(selected.id, { fontSize: v })}
        />
        <NumberField
          label="Weight"
          value={selected.fontWeight}
          onChange={(v) => updateElement(selected.id, { fontWeight: v })}
        />
      </div>
      <SliderField
        label="Letter spacing"
        value={selected.letterSpacing}
        min={-2}
        max={16}
        onPointerDown={pushHistory}
        onChange={(v) => updateElementLive(selected.id, { letterSpacing: v })}
      />
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[var(--ad-ink-soft)]">Color</span>
        <input
          type="color"
          value={selected.color}
          onChange={(e) => updateElement(selected.id, { color: e.target.value })}
          className="h-8 w-10 cursor-pointer rounded-[8px] border border-[var(--ad-border)]"
        />
      </div>
      <div className="flex gap-1.5">
        {(['left', 'center', 'right'] as const).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => updateElement(selected.id, { textAlign: a })}
            className={cn(
              'h-8 flex-1 rounded-[10px] text-[10px] font-bold capitalize',
              selected.textAlign === a
                ? 'bg-[var(--ad-primary)] text-white'
                : 'border border-[var(--ad-border)] text-[var(--ad-ink-soft)]',
            )}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {['Shadow', 'Gradient', 'Stroke', 'Opacity'].map((fx) => (
          <button
            key={fx}
            type="button"
            onClick={() => toast.success(`Text ${fx} (demo)`)}
            className="rounded-[12px] border border-[var(--ad-border)] py-2 text-[10px] font-bold text-[var(--ad-ink-soft)] hover:bg-[var(--ad-primary-soft)]"
          >
            {fx}
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyHint({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[20px] border border-dashed border-[var(--ad-border)] bg-[#F8F9FB] p-6 text-center">
      <p className="text-sm font-bold text-[var(--ad-ink)]">{title}</p>
      <p className="mt-1 text-[11px] font-medium text-[var(--ad-ink-muted)]">{body}</p>
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
  onPointerDown,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (v: number) => void;
  onPointerDown?: () => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-[var(--ad-ink-soft)]">
        <span>{label}</span>
        <span className="text-[var(--ad-ink)]">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onPointerDown={onPointerDown}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--ad-primary)]"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block text-[10px] font-bold uppercase tracking-wide text-[var(--ad-ink-muted)]">
      {label}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1 h-9 w-full rounded-[12px] border border-[var(--ad-border)] bg-[#F8F9FB] px-2 text-xs font-semibold"
      />
    </label>
  );
}

function ActionRow({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Replace;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-[14px] border border-[var(--ad-border)] px-3 py-2.5 text-[11px] font-bold text-[var(--ad-ink)] hover:border-[#C9B8FF] hover:bg-[var(--ad-primary-soft)]"
    >
      <Icon className="h-4 w-4 text-[var(--ad-primary)]" />
      {label}
    </button>
  );
}

function MiniBtn({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: typeof FlipHorizontal2;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1 rounded-[12px] border py-2 text-[9px] font-bold',
        active
          ? 'border-[var(--ad-primary)] bg-[var(--ad-primary-soft)] text-[var(--ad-primary)]'
          : 'border-[var(--ad-border)] text-[var(--ad-ink-soft)]',
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
