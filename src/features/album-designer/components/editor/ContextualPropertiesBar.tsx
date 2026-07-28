import { useMemo, useState } from 'react';
import {
  Replace,
  Crop,
  SlidersHorizontal,
  SunMedium,
  Square,
  RotateCw,
  FlipHorizontal2,
  FlipVertical2,
  MoreHorizontal,
  ArrowUpToLine,
  ArrowDownToLine,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEditorStore } from '../../store';
import { getAlbumPhotoCatalog } from '../../services';
import type { PhotoElement } from '../../types';
import { FONT_FAMILIES } from '../../constants';
import { cn } from '@/lib/utils';

export function ContextualPropertiesBar() {
  const album = useEditorStore((s) => s.album);
  const currentPageIndex = useEditorStore((s) => s.currentPageIndex);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const updateElement = useEditorStore((s) => s.updateElement);
  const updateElementLive = useEditorStore((s) => s.updateElementLive);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const replacePhoto = useEditorStore((s) => s.replacePhoto);
  const [replaceOpen, setReplaceOpen] = useState(false);

  const selected = useMemo(() => {
    const page = album?.pages[currentPageIndex];
    if (!page) return null;
    return page.elements.find((el) => selectedIds.includes(el.id)) ?? null;
  }, [album, currentPageIndex, selectedIds]);

  const catalog = useMemo(() => getAlbumPhotoCatalog(24), []);

  if (!selected) return null;

  if (selected.type === 'text') {
    return (
      <div className="absolute bottom-[118px] left-1/2 z-30 flex w-[min(920px,calc(100%-2rem))] -translate-x-1/2 items-center gap-2 overflow-x-auto rounded-[20px] border border-[var(--ad-border)] bg-white/95 px-3 py-2 shadow-[var(--ad-shadow-float)] backdrop-blur-xl xl:hidden">
        <span className="shrink-0 rounded-[12px] bg-[var(--ad-primary-soft)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--ad-primary)]">
          Text
        </span>
        <select
          value={selected.fontFamily}
          onChange={(e) => updateElement(selected.id, { fontFamily: e.target.value })}
          className="h-8 shrink-0 rounded-lg border border-[#E8EAEF] bg-[#F8F9FB] px-2 text-[11px] font-semibold"
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={selected.fontSize}
          onChange={(e) => updateElement(selected.id, { fontSize: Number(e.target.value) || 16 })}
          className="h-8 w-14 shrink-0 rounded-lg border border-[#E8EAEF] bg-[#F8F9FB] px-2 text-[11px] font-semibold"
        />
        <button
          type="button"
          onClick={() =>
            updateElement(selected.id, { fontWeight: selected.fontWeight >= 700 ? 400 : 700 })
          }
          className={cn(
            'h-8 w-8 shrink-0 rounded-lg border text-xs font-bold',
            selected.fontWeight >= 700
              ? 'border-[#6B46FE] bg-[#F3EEFF] text-[#6B46FE]'
              : 'border-[#E8EAEF] text-[#5B6472]',
          )}
        >
          B
        </button>
        <button
          type="button"
          onClick={() =>
            updateElement(selected.id, {
              fontStyle: selected.fontStyle === 'italic' ? 'normal' : 'italic',
            })
          }
          className={cn(
            'h-8 w-8 shrink-0 rounded-lg border text-xs italic',
            selected.fontStyle === 'italic'
              ? 'border-[#6B46FE] bg-[#F3EEFF] text-[#6B46FE]'
              : 'border-[#E8EAEF] text-[#5B6472]',
          )}
        >
          I
        </button>
        <button
          type="button"
          onClick={() =>
            updateElement(selected.id, {
              textDecoration: selected.textDecoration === 'underline' ? 'none' : 'underline',
            })
          }
          className={cn(
            'h-8 w-8 shrink-0 rounded-lg border text-xs underline',
            selected.textDecoration === 'underline'
              ? 'border-[#6B46FE] bg-[#F3EEFF] text-[#6B46FE]'
              : 'border-[#E8EAEF] text-[#5B6472]',
          )}
        >
          U
        </button>
        <input
          type="color"
          value={selected.color}
          onChange={(e) => updateElement(selected.id, { color: e.target.value })}
          className="h-8 w-10 shrink-0 cursor-pointer rounded-lg border border-[#E8EAEF]"
        />
        <label className="flex shrink-0 items-center gap-2 text-[10px] font-semibold text-[#8B93A1]">
          Tracking
          <input
            type="range"
            min={-2}
            max={12}
            value={selected.letterSpacing}
            onPointerDown={() => pushHistory()}
            onChange={(e) =>
              updateElementLive(selected.id, { letterSpacing: Number(e.target.value) })
            }
            className="w-20 accent-[#6B46FE]"
          />
        </label>
      </div>
    );
  }

  const photo = selected as PhotoElement;

  return (
    <div className="absolute bottom-[118px] left-1/2 z-30 flex w-[min(980px,calc(100%-2rem))] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-[20px] border border-[var(--ad-border)] bg-white/95 px-2 py-2 shadow-[var(--ad-shadow-float)] backdrop-blur-xl sm:gap-2 sm:px-3 xl:hidden">
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[12px] bg-[var(--ad-primary-soft)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--ad-primary)]">
        <ImageIcon className="h-3.5 w-3.5" />
        Image
      </span>

      <div className="relative">
        <ToolBtn
          icon={Replace}
          label="Replace"
          onClick={() => setReplaceOpen((v) => !v)}
        />
        {replaceOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setReplaceOpen(false)} />
            <div className="absolute bottom-12 left-0 z-50 grid w-56 grid-cols-4 gap-1 rounded-xl border border-[#E8EAEF] bg-white p-2 shadow-xl">
              {catalog.slice(0, 12).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    replacePhoto(photo.id, { id: p.id, url: p.url });
                    setReplaceOpen(false);
                  }}
                  className="aspect-square overflow-hidden rounded-md"
                >
                  <img src={p.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <ToolBtn icon={Crop} label="Crop" onClick={() => toast('Drag crop handles / use zoom')} />
      <ToolBtn icon={SlidersHorizontal} label="Filter" onClick={() => toast('Filters coming soon')} />
      <ToolBtn icon={SunMedium} label="Adjust" onClick={() => toast('Adjust coming soon')} />
      <ToolBtn
        icon={Square}
        label="Shadow"
        active={photo.shadow}
        onClick={() => updateElement(photo.id, { shadow: !photo.shadow })}
      />
      <ToolBtn
        icon={Square}
        label="Border"
        active={photo.borderWidth > 0}
        onClick={() =>
          updateElement(photo.id, {
            borderWidth: photo.borderWidth > 0 ? 0 : 2,
            borderColor: '#FFFFFF',
          })
        }
      />
      <ToolBtn
        icon={RotateCw}
        label="Rotate"
        onClick={() => updateElement(photo.id, { rotation: (photo.rotation + 15) % 360 })}
      />

      <div className="mx-1 hidden h-6 w-px bg-[#E8EAEF] sm:block" />

      <label className="flex shrink-0 items-center gap-1.5 text-[10px] font-semibold text-[#8B93A1]">
        Opacity
        <input
          type="range"
          min={10}
          max={100}
          value={Math.round(photo.opacity * 100)}
          onPointerDown={() => pushHistory()}
          onChange={(e) =>
            updateElementLive(photo.id, { opacity: Number(e.target.value) / 100 })
          }
          className="w-16 accent-[#6B46FE] sm:w-20"
        />
        <span className="w-8 text-[#2D3436]">{Math.round(photo.opacity * 100)}%</span>
      </label>

      <label className="flex shrink-0 items-center gap-1.5 text-[10px] font-semibold text-[#8B93A1]">
        Radius
        <input
          type="range"
          min={0}
          max={40}
          value={photo.borderRadius}
          onPointerDown={() => pushHistory()}
          onChange={(e) =>
            updateElementLive(photo.id, { borderRadius: Number(e.target.value) })
          }
          className="w-16 accent-[#6B46FE] sm:w-20"
        />
        <span className="w-8 text-[#2D3436]">{photo.borderRadius}px</span>
      </label>

      <button
        type="button"
        title="Flip H"
        onClick={() => updateElement(photo.id, { flipH: !photo.flipH })}
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border',
          photo.flipH
            ? 'border-[#6B46FE] bg-[#F3EEFF] text-[#6B46FE]'
            : 'border-[#E8EAEF] text-[#5B6472] hover:bg-[#F8F9FB]',
        )}
      >
        <FlipHorizontal2 className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        title="Flip V"
        onClick={() => updateElement(photo.id, { flipV: !photo.flipV })}
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border',
          photo.flipV
            ? 'border-[#6B46FE] bg-[#F3EEFF] text-[#6B46FE]'
            : 'border-[#E8EAEF] text-[#5B6472] hover:bg-[#F8F9FB]',
        )}
      >
        <FlipVertical2 className="h-3.5 w-3.5" />
      </button>

      <div className="mx-1 hidden h-6 w-px bg-[#E8EAEF] sm:block" />

      <div className="flex shrink-0 items-center gap-0.5">
        <PosBtn
          icon={ArrowDownToLine}
          title="To back"
          onClick={() => updateElement(photo.id, { zIndex: 0 })}
        />
        <PosBtn
          icon={ChevronDown}
          title="Backward"
          onClick={() => updateElement(photo.id, { zIndex: Math.max(0, photo.zIndex - 1) })}
        />
        <PosBtn
          icon={ChevronUp}
          title="Forward"
          onClick={() => updateElement(photo.id, { zIndex: photo.zIndex + 1 })}
        />
        <PosBtn
          icon={ArrowUpToLine}
          title="To front"
          onClick={() => updateElement(photo.id, { zIndex: 99 })}
        />
      </div>

      <button
        type="button"
        className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#8B93A1] hover:bg-[#F8F9FB]"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
}

function ToolBtn({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: typeof Replace;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-8 shrink-0 items-center gap-1 rounded-lg px-2 text-[10px] font-semibold transition-colors',
        active
          ? 'bg-[#F3EEFF] text-[#6B46FE]'
          : 'text-[#5B6472] hover:bg-[#F5F6F8]',
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}

function PosBtn({
  icon: Icon,
  title,
  onClick,
}: {
  icon: typeof ChevronUp;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-md text-[#5B6472] hover:bg-[#F5F6F8]"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
