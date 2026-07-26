import { useMemo } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCw,
  Crop,
  ZoomIn,
  Replace,
  Trash2,
} from 'lucide-react';
import { useEditorStore, patchSelectedText } from '../../store';
import { FONT_FAMILIES } from '../../constants';
import { getAlbumPhotoCatalog } from '../../services';
import type { PhotoElement, TextElement } from '../../types';
import { cn } from '@/lib/utils';

export function PropertiesPanel() {
  const album = useEditorStore((s) => s.album);
  const currentPageIndex = useEditorStore((s) => s.currentPageIndex);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const updateElement = useEditorStore((s) => s.updateElement);
  const updateElementLive = useEditorStore((s) => s.updateElementLive);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const replacePhoto = useEditorStore((s) => s.replacePhoto);
  const deleteSelected = useEditorStore((s) => s.deleteSelected);
  const addPhotoToPage = useEditorStore((s) => s.addPhotoToPage);

  const selected = useMemo(() => {
    const page = album?.pages[currentPageIndex];
    if (!page) return [];
    return page.elements.filter((el) => selectedIds.includes(el.id));
  }, [album, currentPageIndex, selectedIds]);

  const liveChange = (id: string, patch: Partial<PhotoElement | TextElement>) => {
    updateElementLive(id, patch);
  };

  const catalog = useMemo(() => getAlbumPhotoCatalog(48), []);
  const trayPhotos = useMemo(() => {
    if (!album) return catalog.slice(0, 16);
    const selectedSet = new Set(album.selectedPhotoIds);
    const fromAlbum = catalog.filter((p) => selectedSet.has(p.id));
    return fromAlbum.length ? fromAlbum : catalog.slice(0, 16);
  }, [album, catalog]);

  const el = selected[0];

  return (
    <aside className="flex w-full shrink-0 flex-col border-l border-[#EEF0F4] bg-white xl:w-[280px]">
      <div className="border-b border-[#EEF0F4] px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wider text-[#A0A4B0]">
          Properties
        </p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {!el && (
          <p className="text-sm text-[#A0A4B0]">
            Select a photo or text on the canvas to edit properties.
          </p>
        )}

        {el?.type === 'text' && (
          <TextProps
            el={el}
            onChange={(patch) => updateElement(el.id, patch)}
            onLiveChange={(patch) => liveChange(el.id, patch)}
            onHistoryCommit={pushHistory}
          />
        )}

        {el?.type === 'photo' && (
          <PhotoProps
            el={el}
            trayPhotos={trayPhotos}
            onChange={(patch) => updateElement(el.id, patch)}
            onLiveChange={(patch) => liveChange(el.id, patch)}
            onHistoryCommit={pushHistory}
            onReplace={(photo) => replacePhoto(el.id, photo)}
            onDelete={deleteSelected}
          />
        )}

        <div>
          <p className="mb-2 text-xs font-bold text-[#636E72]">Photo Tray</p>
          <p className="mb-2 text-[11px] text-[#A0A4B0]">
            Drag onto canvas or click to add
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {trayPhotos.map((p) => (
              <button
                key={p.id}
                type="button"
                title={p.filename}
                onClick={() => addPhotoToPage({ id: p.id, url: p.url })}
                className="aspect-square overflow-hidden rounded-lg border border-[#EEF0F4] hover:ring-2 hover:ring-[#6B46FE]/40"
              >
                <img src={p.thumbnailUrl} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function TextProps({
  el,
  onChange,
  onLiveChange,
  onHistoryCommit,
}: {
  el: TextElement;
  onChange: (p: Partial<TextElement>) => void;
  onLiveChange: (p: Partial<TextElement>) => void;
  onHistoryCommit: () => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-[#2D3436]">Text Editing</p>
      <textarea
        value={el.content}
        onChange={(e) => onChange({ content: e.target.value })}
        rows={3}
        className="w-full rounded-xl border border-[#EEF0F4] bg-[#F8F9FB] p-2.5 text-sm outline-none focus:border-[#6B46FE]/40"
      />
      <label className="block space-y-1">
        <span className="text-[11px] font-semibold text-[#A0A4B0]">Font Family</span>
        <select
          value={el.fontFamily}
          onChange={(e) => onChange({ fontFamily: e.target.value })}
          className="h-9 w-full rounded-lg border border-[#EEF0F4] bg-white px-2 text-sm"
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1">
        <span className="text-[11px] font-semibold text-[#A0A4B0]">
          Font Size ({el.fontSize}px)
        </span>
        <input
          type="range"
          min={10}
          max={72}
          value={el.fontSize}
          onPointerDown={() => onHistoryCommit()}
          onChange={(e) => onLiveChange({ fontSize: Number(e.target.value) })}
          className="w-full accent-[#6B46FE]"
        />
      </label>
      <div className="flex gap-1">
        <Toggle
          active={el.fontWeight >= 700}
          onClick={() => onChange({ fontWeight: el.fontWeight >= 700 ? 400 : 700 })}
        >
          <Bold className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle
          active={el.fontStyle === 'italic'}
          onClick={() =>
            onChange({ fontStyle: el.fontStyle === 'italic' ? 'normal' : 'italic' })
          }
        >
          <Italic className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle
          active={el.textDecoration === 'underline'}
          onClick={() =>
            onChange({
              textDecoration: el.textDecoration === 'underline' ? 'none' : 'underline',
            })
          }
        >
          <Underline className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle active={el.textAlign === 'left'} onClick={() => onChange({ textAlign: 'left' })}>
          <AlignLeft className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle
          active={el.textAlign === 'center'}
          onClick={() => onChange({ textAlign: 'center' })}
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </Toggle>
        <Toggle
          active={el.textAlign === 'right'}
          onClick={() => onChange({ textAlign: 'right' })}
        >
          <AlignRight className="h-3.5 w-3.5" />
        </Toggle>
      </div>
      <label className="block space-y-1">
        <span className="text-[11px] font-semibold text-[#A0A4B0]">
          Letter Spacing ({el.letterSpacing}px)
        </span>
        <input
          type="range"
          min={-2}
          max={12}
          value={el.letterSpacing}
          onPointerDown={() => onHistoryCommit()}
          onChange={(e) => onLiveChange({ letterSpacing: Number(e.target.value) })}
          className="w-full accent-[#6B46FE]"
        />
      </label>
      <label className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-[#A0A4B0]">Color</span>
        <input
          type="color"
          value={el.color}
          onChange={(e) => {
            onChange({ color: e.target.value });
            patchSelectedText({ color: e.target.value });
          }}
          className="h-9 w-14 cursor-pointer rounded border border-[#EEF0F4]"
        />
      </label>
    </div>
  );
}

function PhotoProps({
  el,
  trayPhotos,
  onLiveChange,
  onHistoryCommit,
  onReplace,
  onDelete,
}: {
  el: PhotoElement;
  trayPhotos: { id: string; url: string; thumbnailUrl: string }[];
  onChange?: (p: Partial<PhotoElement>) => void;
  onLiveChange: (p: Partial<PhotoElement>) => void;
  onHistoryCommit: () => void;
  onReplace: (photo: { id: string; url: string }) => void;
  onDelete: () => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-[#2D3436]">Photo Tools</p>
      <div className="overflow-hidden rounded-xl border border-[#EEF0F4]">
        <img src={el.url} alt="" className="aspect-video w-full object-cover" />
      </div>
      <label className="block space-y-1">
        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#A0A4B0]">
          <RotateCw className="h-3 w-3" /> Rotate ({el.rotation}°)
        </span>
        <input
          type="range"
          min={-180}
          max={180}
          value={el.rotation}
          onPointerDown={() => onHistoryCommit()}
          onChange={(e) => onLiveChange({ rotation: Number(e.target.value) })}
          className="w-full accent-[#6B46FE]"
        />
      </label>
      <label className="block space-y-1">
        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#A0A4B0]">
          <ZoomIn className="h-3 w-3" /> Zoom ({el.crop.zoom.toFixed(1)}×)
        </span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={el.crop.zoom}
          onPointerDown={() => onHistoryCommit()}
          onChange={(e) =>
            onLiveChange({ crop: { ...el.crop, zoom: Number(e.target.value) } })
          }
          className="w-full accent-[#6B46FE]"
        />
      </label>
      <label className="block space-y-1">
        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#A0A4B0]">
          <Crop className="h-3 w-3" /> Crop X ({el.crop.x}%)
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={el.crop.x}
          onPointerDown={() => onHistoryCommit()}
          onChange={(e) =>
            onLiveChange({ crop: { ...el.crop, x: Number(e.target.value) } })
          }
          className="w-full accent-[#6B46FE]"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-[11px] font-semibold text-[#A0A4B0]">Crop Y ({el.crop.y}%)</span>
        <input
          type="range"
          min={0}
          max={100}
          value={el.crop.y}
          onPointerDown={() => onHistoryCommit()}
          onChange={(e) =>
            onLiveChange({ crop: { ...el.crop, y: Number(e.target.value) } })
          }
          className="w-full accent-[#6B46FE]"
        />
      </label>
      <div>
        <p className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold text-[#A0A4B0]">
          <Replace className="h-3 w-3" /> Replace Photo
        </p>
        <div className="grid max-h-28 grid-cols-4 gap-1 overflow-y-auto">
          {trayPhotos.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onReplace({ id: p.id, url: p.url })}
              className="aspect-square overflow-hidden rounded-md border border-[#EEF0F4] hover:ring-2 hover:ring-[#6B46FE]"
            >
              <img src={p.thumbnailUrl} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-100 py-2 text-xs font-semibold text-[#EA5455] hover:bg-red-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete Photo
      </button>
    </div>
  );
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors',
        active
          ? 'border-[#6B46FE] bg-[#F3EEFF] text-[#6B46FE]'
          : 'border-[#EEF0F4] text-[#636E72] hover:bg-[#F8F9FB]',
      )}
    >
      {children}
    </button>
  );
}
