import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutTemplate,
  LayoutGrid,
  Frame,
  Upload,
  Images,
  Type,
  Shapes,
  Sparkles as IconsSparkles,
  Circle,
  Sticker,
  Paintbrush,
  Palette,
  QrCode,
  Sparkles,
  Search,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useEditorStore, useEditorUiStore, type LeftPanelId } from '../../store';
import {
  TEMPLATE_CATEGORIES,
  searchTemplates,
  LAYOUT_PRESETS,
  LAYOUT_CATEGORIES,
  DESIGN_ELEMENTS,
  ELEMENT_CATEGORIES,
  STICKERS,
  STICKER_CATEGORIES,
  BACKGROUNDS,
  BACKGROUND_KINDS,
  TEXT_PRESETS,
  AI_TOOLS,
  type LayoutPreset,
  type PremiumTemplate,
  type TextPreset,
} from '../../data';
import { getAlbumPhotoCatalog } from '../../services';
import { createDefaultText, createPhotoElement } from '../../utils';
import { SidebarRailButton } from '../molecules/SidebarRailButton';
import { TemplateCard } from '../molecules/TemplateCard';
import { LayoutCard } from '../molecules/LayoutCard';
import { PanelSectionHeader } from '../atoms/PanelSectionHeader';

const RAIL: { id: LeftPanelId; label: string; icon: typeof LayoutTemplate }[] = [
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  { id: 'layouts', label: 'Layouts', icon: LayoutGrid },
  { id: 'frames', label: 'Frames', icon: Frame },
  { id: 'uploads', label: 'Uploads', icon: Upload },
  { id: 'photos', label: 'Photos', icon: Images },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'elements', label: 'Elements', icon: Shapes },
  { id: 'icons', label: 'Icons', icon: IconsSparkles },
  { id: 'shapes', label: 'Shapes', icon: Circle },
  { id: 'stickers', label: 'Stickers', icon: Sticker },
  { id: 'background', label: 'Background', icon: Paintbrush },
  { id: 'brand', label: 'Brand Kit', icon: Palette },
  { id: 'qr', label: 'QR Code', icon: QrCode },
  { id: 'ai', label: 'AI Tools', icon: Sparkles },
];

export function EditorLeftPanel() {
  const leftPanel = useEditorUiStore((s) => s.leftPanel);
  const setLeftPanel = useEditorUiStore((s) => s.setLeftPanel);
  const leftCollapsed = useEditorUiStore((s) => s.leftCollapsed);

  return (
    <aside className="flex h-full shrink-0 border-r border-[var(--ad-border)] bg-white">
      <nav className="ad-scrollbar flex w-[72px] shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-[var(--ad-border-soft)] bg-[#FAFBFC] p-1.5">
        {RAIL.map((item) => (
          <SidebarRailButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={leftPanel === item.id}
            onClick={() => setLeftPanel(item.id)}
          />
        ))}
      </nav>

      <AnimatePresence initial={false}>
        {!leftCollapsed ? (
          <motion.div
            key="panel"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            className="ad-scrollbar h-full overflow-hidden border-r border-[var(--ad-border-soft)]"
          >
            <div className="h-full w-[300px] overflow-y-auto p-3">
              <PanelBody panel={leftPanel} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </aside>
  );
}

function PanelBody({ panel }: { panel: LeftPanelId }) {
  switch (panel) {
    case 'templates':
      return <TemplatesPanel />;
    case 'layouts':
      return <LayoutsPanel />;
    case 'frames':
      return <FramesPanel />;
    case 'uploads':
      return <UploadsPanel />;
    case 'photos':
      return <PhotosPanel />;
    case 'text':
      return <TextPanel />;
    case 'elements':
    case 'icons':
      return <ElementsPanel filterCategory={panel === 'icons' ? 'Wedding Icons' : undefined} />;
    case 'shapes':
      return <ElementsPanel filterCategory="Shapes" />;
    case 'stickers':
      return <StickersPanel />;
    case 'background':
      return <BackgroundPanel />;
    case 'brand':
      return <BrandKitPanel />;
    case 'qr':
      return <QrPanel />;
    case 'ai':
      return <AiPanel />;
    default:
      return null;
  }
}

function TemplatesPanel() {
  const album = useEditorStore((s) => s.album);
  const setAlbum = useEditorStore((s) => s.setAlbum);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const category = useEditorUiStore((s) => s.templateCategory);
  const setCategory = useEditorUiStore((s) => s.setTemplateCategory);
  const query = useEditorUiStore((s) => s.templateQuery);
  const setQuery = useEditorUiStore((s) => s.setTemplateQuery);
  const [sizeFilter, setSizeFilter] = useState<'all' | '12x36' | '14x36' | 'square' | '3:4'>('all');

  const templates = useMemo(() => {
    let list = searchTemplates(query, category, 80);
    if (sizeFilter === 'square') list = list.filter((t) => t.aspectRatio === '1:1');
    if (sizeFilter === '3:4') list = list.filter((t) => t.aspectRatio === '3:4');
    if (sizeFilter === '12x36' || sizeFilter === '14x36') {
      list = list.filter((t) => t.aspectRatio === '16:9' || t.aspectRatio === '4:3' || t.imageSlots >= 4);
    }
    return list.slice(0, 48);
  }, [query, category, sizeFilter]);

  if (!album) return null;

  const apply = (t: PremiumTemplate) => {
    pushHistory();
    setAlbum({
      ...album,
      templateId: t.baseTemplateId,
      pages: album.pages.map((p) => ({ ...p, background: t.pageBackground })),
      updatedAt: new Date().toISOString(),
    });
    toast.success(`${t.name} · ${t.imageSlots} photos / page`);
  };

  const quickCats = TEMPLATE_CATEGORIES.filter((c) =>
    ['wedding', 'luxury_wedding', 'minimal', 'classic', 'modern', 'magazine'].includes(c.id),
  );

  return (
    <div>
      <PanelSectionHeader title="Templates" />
      <div className="relative mb-2.5">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ad-ink-muted)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search templates…"
          className="h-9 w-full rounded-[10px] border border-[var(--ad-border)] bg-[#F8F9FB] pl-8 pr-3 text-xs font-medium outline-none focus:ring-2 focus:ring-[var(--ad-primary)]/30"
        />
      </div>
      <div className="ad-scrollbar mb-2 flex gap-1.5 overflow-x-auto pb-1">
        <CategoryChip label="All" active={category === 'all'} onClick={() => setCategory('all')} />
        {quickCats.map((c) => (
          <CategoryChip
            key={c.id}
            label={c.label.replace('Luxury Wedding', 'Luxury')}
            active={category === c.id}
            onClick={() => setCategory(c.id)}
          />
        ))}
      </div>
      <div className="ad-scrollbar mb-3 flex gap-1.5 overflow-x-auto pb-1">
        {(
          [
            { id: 'all', label: 'All' },
            { id: '12x36', label: '12×36' },
            { id: '14x36', label: '14×36' },
            { id: 'square', label: 'Square' },
            { id: '3:4', label: 'Portrait' },
          ] as const
        ).map((s) => (
          <CategoryChip
            key={s.id}
            label={s.label}
            active={sizeFilter === s.id}
            onClick={() => setSizeFilter(s.id)}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {templates.map((t) => (
          <TemplateCard
            key={t.id}
            template={t}
            active={album.templateId === t.baseTemplateId && album.pages[0]?.background === t.pageBackground}
            onSelect={() => apply(t)}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => toast.success('More templates loading…')}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[12px] border border-dashed border-[#C9B8FF] bg-[var(--ad-primary-soft)] py-2.5 text-xs font-bold text-[var(--ad-primary)]"
      >
        Import More Templates
      </button>
    </div>
  );
}

function LayoutsPanel() {
  const [cat, setCat] = useState<(typeof LAYOUT_CATEGORIES)[number] | 'All'>('All');
  const album = useEditorStore((s) => s.album);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const setAlbum = useEditorStore((s) => s.setAlbum);
  const currentPageIndex = useEditorStore((s) => s.currentPageIndex);

  const list = LAYOUT_PRESETS.filter((l) => cat === 'All' || l.category === cat);

  const applyLayout = (layout: LayoutPreset) => {
    if (!album) return;
    const page = album.pages[currentPageIndex];
    if (!page) return;
    const photos = page.elements.filter((e) => e.type === 'photo');
    const catalog = getAlbumPhotoCatalog(layout.slots.length);
    pushHistory();
    const nextElements = layout.slots.map((slot, i) => {
      const existing = photos[i];
      const fallback = catalog[i % catalog.length];
      return createPhotoElement(
        existing
          ? { id: existing.photoId, url: existing.url }
          : { id: fallback.id, url: fallback.url },
        {
          x: slot.x,
          y: slot.y,
          width: slot.width,
          height: slot.height,
          zIndex: i + 1,
          ...(existing
            ? {
                crop: existing.crop,
                opacity: existing.opacity,
                borderRadius: existing.borderRadius,
                flipH: existing.flipH,
                flipV: existing.flipV,
                shadow: existing.shadow,
                borderWidth: existing.borderWidth,
                borderColor: existing.borderColor,
              }
            : {}),
        },
      );
    });
    const texts = page.elements.filter((e) => e.type === 'text');
    setAlbum({
      ...album,
      pages: album.pages.map((p, i) =>
        i === currentPageIndex ? { ...p, elements: [...nextElements, ...texts] } : p,
      ),
      updatedAt: new Date().toISOString(),
    });
    toast.success(`${layout.name} layout applied`);
  };

  return (
    <div>
      <PanelSectionHeader title="Layouts" />
      <div className="ad-scrollbar mb-3 flex gap-1.5 overflow-x-auto pb-1">
        <CategoryChip label="All" active={cat === 'All'} onClick={() => setCat('All')} />
        {LAYOUT_CATEGORIES.map((c) => (
          <CategoryChip key={c} label={c} active={cat === c} onClick={() => setCat(c)} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {list.map((l) => (
          <LayoutCard key={l.id} layout={l} onSelect={() => applyLayout(l)} />
        ))}
      </div>
    </div>
  );
}

function FramesPanel() {
  const frames = DESIGN_ELEMENTS.filter((e) => e.category === 'Frames' || e.category === 'Borders');
  return (
    <div>
      <PanelSectionHeader title="Frames" />
      <div className="grid grid-cols-3 gap-2">
        {frames.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => toast.success(`${f.name} — drop onto a photo`)}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-[16px] border border-[var(--ad-border)] bg-[#F8F9FB] transition hover:border-[#C9B8FF] hover:bg-[var(--ad-primary-soft)]"
          >
            <span className="text-2xl">{f.emoji}</span>
            <span className="px-1 text-center text-[9px] font-bold text-[var(--ad-ink-soft)]">{f.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function UploadsPanel() {
  return (
    <div>
      <PanelSectionHeader title="Uploads" />
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[20px] border-2 border-dashed border-[#C9B8FF] bg-[var(--ad-primary-soft)] px-4 py-10 text-center transition hover:bg-[var(--ad-primary-mid)]">
        <Upload className="h-6 w-6 text-[var(--ad-primary)]" />
        <span className="text-xs font-bold text-[var(--ad-primary)]">Drop photos here</span>
        <span className="text-[10px] font-medium text-[var(--ad-ink-muted)]">or click to browse</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={() => toast.success('Upload queued (local demo)')}
        />
      </label>
    </div>
  );
}

function PhotosPanel() {
  const addPhotoToPage = useEditorStore((s) => s.addPhotoToPage);
  const album = useEditorStore((s) => s.album);
  const currentPageIndex = useEditorStore((s) => s.currentPageIndex);
  const photos = useMemo(() => getAlbumPhotoCatalog(24), []);
  const page = album?.pages[currentPageIndex];
  const used = page ? page.elements.filter((e) => e.type === 'photo').length : 0;
  const max = 10;
  const remaining = Math.max(0, max - used);

  return (
    <div>
      <PanelSectionHeader
        title="Photos"
        action={
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-bold',
              remaining === 0
                ? 'bg-red-50 text-red-500'
                : 'bg-[var(--ad-primary-soft)] text-[var(--ad-primary)]',
            )}
          >
            {used}/{max} on page
          </span>
        }
      />
      <p className="mb-3 text-[11px] font-medium text-[var(--ad-ink-muted)]">
        Is page pe max {max} photos. {remaining} slots left.
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {photos.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              if (remaining <= 0) {
                toast.error(`Page full — max ${max} photos. Add a new page or remove one.`);
                return;
              }
              addPhotoToPage({ id: p.id, url: p.url });
            }}
            className="aspect-square overflow-hidden rounded-[12px] border border-[var(--ad-border)] transition hover:ring-2 hover:ring-[var(--ad-primary)]/40"
          >
            <img src={p.thumbnailUrl} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function TextPanel() {
  const album = useEditorStore((s) => s.album);
  const setAlbum = useEditorStore((s) => s.setAlbum);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const currentPageIndex = useEditorStore((s) => s.currentPageIndex);
  const select = useEditorStore((s) => s.select);

  const addPreset = (preset: TextPreset) => {
    if (!album) return;
    const text = createDefaultText({
      content: preset.content,
      fontFamily: preset.fontFamily,
      fontSize: preset.fontSize,
      fontWeight: preset.fontWeight,
      letterSpacing: preset.letterSpacing,
      textAlign: preset.textAlign,
      color: preset.color,
      x: 10,
      y: 20,
      width: 80,
      height: 14,
    });
    pushHistory();
    setAlbum({
      ...album,
      pages: album.pages.map((p, i) =>
        i === currentPageIndex ? { ...p, elements: [...p.elements, text] } : p,
      ),
      updatedAt: new Date().toISOString(),
    });
    select([text.id]);
  };

  return (
    <div>
      <PanelSectionHeader title="Typography" />
      <p className="mb-3 text-[11px] font-medium text-[var(--ad-ink-muted)]">
        Professional presets · Google Fonts ready
      </p>
      <div className="space-y-2">
        {TEXT_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => addPreset(p)}
            className="flex w-full items-center justify-between rounded-[16px] border border-[var(--ad-border)] bg-white px-3 py-2.5 text-left transition hover:border-[#C9B8FF] hover:bg-[var(--ad-primary-soft)]"
          >
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-[var(--ad-ink)]">{p.name}</p>
              <p
                className="truncate text-sm text-[var(--ad-ink-soft)]"
                style={{ fontFamily: p.fontFamily, fontWeight: p.fontWeight }}
              >
                {p.content}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-[var(--ad-ink-muted)]" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ElementsPanel({ filterCategory }: { filterCategory?: string }) {
  const [cat, setCat] = useState<string>(filterCategory ?? 'All');
  const list = DESIGN_ELEMENTS.filter(
    (e) =>
      (filterCategory ? e.category === filterCategory : cat === 'All' || e.category === cat),
  );

  return (
    <div>
      <PanelSectionHeader title={filterCategory ?? 'Elements'} />
      {!filterCategory ? (
        <div className="ad-scrollbar mb-3 flex gap-1.5 overflow-x-auto pb-1">
          <CategoryChip label="All" active={cat === 'All'} onClick={() => setCat('All')} />
          {ELEMENT_CATEGORIES.map((c) => (
            <CategoryChip key={c} label={c} active={cat === c} onClick={() => setCat(c)} />
          ))}
        </div>
      ) : null}
      <div className="grid grid-cols-3 gap-2">
        {list.map((el) => (
          <button
            key={el.id}
            type="button"
            onClick={() => toast.success(`${el.name} added (decorative overlay demo)`)}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-[16px] border border-[var(--ad-border)] bg-white transition hover:-translate-y-0.5 hover:border-[#C9B8FF] hover:shadow-[var(--ad-shadow-soft)]"
          >
            <span className="text-2xl" style={{ filter: `drop-shadow(0 2px 4px ${el.accent}55)` }}>
              {el.emoji}
            </span>
            <span className="px-1 text-center text-[9px] font-bold text-[var(--ad-ink-soft)]">{el.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StickersPanel() {
  const [cat, setCat] = useState<string>('All');
  const list = STICKERS.filter((s) => cat === 'All' || s.category === cat);
  return (
    <div>
      <PanelSectionHeader title="Stickers" />
      <div className="ad-scrollbar mb-3 flex gap-1.5 overflow-x-auto pb-1">
        <CategoryChip label="All" active={cat === 'All'} onClick={() => setCat('All')} />
        {STICKER_CATEGORIES.map((c) => (
          <CategoryChip key={c} label={c} active={cat === c} onClick={() => setCat(c)} />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {list.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => toast.success(`${s.name} sticker ready`)}
            className="flex aspect-square items-center justify-center rounded-[14px] border border-[var(--ad-border)] bg-[#F8F9FB] text-2xl transition hover:scale-105 hover:bg-[var(--ad-primary-soft)]"
            title={s.name}
          >
            {s.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

function BackgroundPanel() {
  const [kind, setKind] = useState<string>('All');
  const album = useEditorStore((s) => s.album);
  const setAlbum = useEditorStore((s) => s.setAlbum);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const currentPageIndex = useEditorStore((s) => s.currentPageIndex);

  const list = BACKGROUNDS.filter((b) => kind === 'All' || b.kind === kind);

  const apply = (value: string) => {
    if (!album) return;
    pushHistory();
    setAlbum({
      ...album,
      pages: album.pages.map((p, i) => (i === currentPageIndex ? { ...p, background: value } : p)),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div>
      <PanelSectionHeader title="Background" />
      <div className="ad-scrollbar mb-3 flex gap-1.5 overflow-x-auto pb-1">
        <CategoryChip label="All" active={kind === 'All'} onClick={() => setKind('All')} />
        {BACKGROUND_KINDS.map((k) => (
          <CategoryChip key={k} label={k} active={kind === k} onClick={() => setKind(k)} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {list.map((bg) => (
          <button
            key={bg.id}
            type="button"
            title={bg.name}
            onClick={() => apply(bg.value)}
            className="aspect-square overflow-hidden rounded-[14px] border border-[var(--ad-border)] shadow-inner transition hover:ring-2 hover:ring-[var(--ad-primary)]/40"
            style={{ background: bg.value }}
          />
        ))}
      </div>
      {kind === 'Image' || list.length === 0 ? (
        <p className="mt-3 text-center text-[11px] font-medium text-[var(--ad-ink-muted)]">
          Use Photos or Uploads for image backgrounds
        </p>
      ) : null}
    </div>
  );
}

function BrandKitPanel() {
  const colors = ['#6B46FE', '#0A0A0B', '#C9A227', '#FFFFFF', '#C45C7A', '#0B1220'];
  return (
    <div>
      <PanelSectionHeader title="Brand Kit" />
      <p className="mb-3 text-[11px] font-medium text-[var(--ad-ink-muted)]">Saved brand colors & logos</p>
      <div className="mb-4 grid grid-cols-6 gap-2">
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => toast.success(`Brand color ${c}`)}
            className="aspect-square rounded-full border border-[var(--ad-border)] shadow-sm"
            style={{ background: c }}
          />
        ))}
      </div>
      <div className="rounded-[20px] border border-dashed border-[var(--ad-border)] bg-[#F8F9FB] p-6 text-center">
        <Palette className="mx-auto mb-2 h-5 w-5 text-[var(--ad-primary)]" />
        <p className="text-xs font-bold text-[var(--ad-ink)]">Upload logo</p>
        <p className="mt-1 text-[10px] text-[var(--ad-ink-muted)]">PNG / SVG · transparent preferred</p>
      </div>
    </div>
  );
}

function QrPanel() {
  return (
    <div>
      <PanelSectionHeader title="QR Code" />
      <div className="rounded-[20px] border border-[var(--ad-border)] bg-white p-4 shadow-[var(--ad-shadow-soft)]">
        <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center rounded-[16px] bg-[linear-gradient(145deg,#F3EEFF,#E8E4FF)] text-4xl">
          ▦
        </div>
        <input
          placeholder="https://gallery.shoothub.app/…"
          className="mb-2 h-9 w-full rounded-[12px] border border-[var(--ad-border)] bg-[#F8F9FB] px-3 text-xs outline-none focus:ring-2 focus:ring-[var(--ad-primary)]/30"
        />
        <button
          type="button"
          onClick={() => toast.success('QR added to page (demo)')}
          className="h-9 w-full rounded-[12px] bg-[var(--ad-primary)] text-xs font-bold text-white shadow-[0_8px_20px_-8px_var(--ad-primary-glow)] hover:bg-[var(--ad-primary-hover)]"
        >
          Insert QR
        </button>
      </div>
    </div>
  );
}

function AiPanel() {
  const applyAiSmartAlbum = useEditorStore((s) => s.applyAiSmartAlbum);
  const applyAiAutoLayout = useEditorStore((s) => s.applyAiAutoLayout);
  const save = useEditorStore((s) => s.save);
  const addParagraph = useEditorStore((s) => s.addParagraph);
  const [busy, setBusy] = useState(false);

  return (
    <div>
      <PanelSectionHeader
        title="AI Tools"
        action={
          <span className="rounded-full bg-gradient-to-r from-[#6B46FE] to-[#A78BFA] px-2 py-0.5 text-[9px] font-bold text-white">
            Studio
          </span>
        }
      />
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          await new Promise((r) => setTimeout(r, 700));
          applyAiSmartAlbum();
          save('in_progress');
          setBusy(false);
          toast.success('AI ne poora album design kar diya!');
        }}
        className="mb-3 flex w-full flex-col items-start gap-1 rounded-[16px] bg-gradient-to-br from-[#6B46FE] to-[#8B5CF6] p-4 text-left text-white shadow-[0_12px_28px_-12px_rgba(107,70,254,0.55)]"
      >
        <span className="inline-flex items-center gap-1.5 text-[13px] font-bold">
          <Sparkles className="h-4 w-4" />
          {busy ? 'Designing album…' : 'AI Smart Album'}
        </span>
        <span className="text-[11px] font-medium text-white/85">
          Click karo — photos se complete album auto-ban jayega
        </span>
      </button>
      <button
        type="button"
        onClick={() => {
          applyAiAutoLayout();
          toast.success('Current page AI layout ready');
        }}
        className="mb-3 flex w-full items-center gap-2 rounded-[14px] border border-[#C9B8FF] bg-[var(--ad-primary-soft)] px-3 py-3 text-left text-[12px] font-bold text-[var(--ad-primary)]"
      >
        <Sparkles className="h-4 w-4" />
        AI Auto Layout — this page
      </button>
      <div className="space-y-2">
        {AI_TOOLS.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => {
              if (tool.id === 'smart_album') {
                applyAiSmartAlbum();
                save('in_progress');
                toast.success('AI Smart Album ready');
                return;
              }
              if (tool.id === 'auto_layout' || tool.id === 'layout_suggest') {
                applyAiAutoLayout();
                toast.success(`${tool.name} applied`);
                return;
              }
              if (tool.id === 'quote_gen' || tool.id === 'story_gen' || tool.id === 'caption_gen') {
                addParagraph();
              }
              toast.success(`${tool.name} — done`);
            }}
            className="group flex w-full items-start gap-3 rounded-[16px] border border-[var(--ad-border)] bg-white p-3 text-left transition hover:border-[#C9B8FF] hover:bg-[var(--ad-primary-soft)]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[var(--ad-primary-soft)] text-[var(--ad-primary)] group-hover:bg-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5">
                <span className="text-[12px] font-bold text-[var(--ad-ink)]">{tool.name}</span>
                {tool.badge ? (
                  <span className="rounded-full bg-[var(--ad-primary)] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white">
                    {tool.badge}
                  </span>
                ) : null}
              </span>
              <span className="mt-0.5 block text-[10px] font-medium text-[var(--ad-ink-muted)]">
                {tool.description}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold transition',
        active
          ? 'bg-[var(--ad-primary)] text-white shadow-sm shadow-[var(--ad-primary-glow)]'
          : 'bg-[#F3F4F7] text-[var(--ad-ink-soft)] hover:bg-[var(--ad-primary-soft)] hover:text-[var(--ad-primary)]',
      )}
    >
      {label}
    </button>
  );
}
