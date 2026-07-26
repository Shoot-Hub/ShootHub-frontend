import { useState } from 'react';
import { Check, LayoutTemplate, Shapes, ImageIcon, ChevronDown } from 'lucide-react';
import { ALBUM_TEMPLATES, getTemplate } from '../../constants';
import { useEditorStore } from '../../store';
import type { TemplateId } from '../../types';
import { cn } from '@/lib/utils';
import { getAlbumPhotoCatalog } from '../../services';

type LeftTab = 'templates' | 'elements' | 'background';

export function EditorLeftPanel() {
  const [tab, setTab] = useState<LeftTab>('templates');
  const album = useEditorStore((s) => s.album);
  const setAlbum = useEditorStore((s) => s.setAlbum);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const addPhotoToPage = useEditorStore((s) => s.addPhotoToPage);
  const addHeading = useEditorStore((s) => s.addHeading);
  const addParagraph = useEditorStore((s) => s.addParagraph);

  if (!album) return null;

  const applyTemplate = (id: TemplateId) => {
    pushHistory();
    const meta = getTemplate(id);
    setAlbum({
      ...album,
      templateId: id,
      pages: album.pages.map((p) => ({ ...p, background: meta.pageBackground })),
      updatedAt: new Date().toISOString(),
    });
  };

  const photos = getAlbumPhotoCatalog(12);

  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-[#E8EAEF] bg-white md:w-[260px]">
      <div className="flex border-b border-[#E8EAEF]">
        {(
          [
            { id: 'templates', label: 'Templates', icon: LayoutTemplate },
            { id: 'elements', label: 'Elements', icon: Shapes },
            { id: 'background', label: 'Background', icon: ImageIcon },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 border-b-2 py-2.5 text-[11px] font-semibold transition-colors',
              tab === t.id
                ? 'border-[#6B46FE] text-[#6B46FE]'
                : 'border-transparent text-[#8B93A1] hover:text-[#5B6472]',
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {tab === 'templates' && (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2D3436]">Album Templates</h3>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-[#E8EAEF] px-2 py-1 text-[10px] font-semibold text-[#8B93A1]"
              >
                All Categories
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {ALBUM_TEMPLATES.map((t) => {
                const active = album.templateId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => applyTemplate(t.id)}
                    className={cn(
                      'group relative overflow-hidden rounded-xl border-2 text-left transition-all',
                      active
                        ? 'border-[#6B46FE] shadow-md shadow-[#6B46FE]/15'
                        : 'border-[#EEF0F4] hover:border-[#C9B8FF]',
                    )}
                  >
                    <div
                      className="aspect-[3/4] w-full"
                      style={{ background: t.previewGradient }}
                    >
                      <div className="flex h-full flex-col justify-end gap-1.5 p-2">
                        <div
                          className="h-10 rounded-md"
                          style={{ background: `${t.accent}44` }}
                        />
                        <div
                          className="h-1.5 w-3/4 rounded"
                          style={{ background: t.textColor, opacity: 0.45 }}
                        />
                      </div>
                    </div>
                    <div className="border-t border-[#EEF0F4] bg-white px-2 py-1.5">
                      <p className="truncate text-[11px] font-bold text-[#2D3436]">{t.name}</p>
                    </div>
                    {active && (
                      <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#6B46FE] text-white shadow">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#C9B8FF] bg-[#F8F5FF] py-2.5 text-xs font-bold text-[#6B46FE] hover:bg-[#F3EEFF]"
            >
              <LayoutTemplate className="h-3.5 w-3.5" />
              More Templates
            </button>
          </>
        )}

        {tab === 'elements' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#2D3436]">Elements</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={addHeading}
                className="rounded-xl border border-[#E8EAEF] bg-[#F8F9FB] px-3 py-4 text-center text-xs font-bold text-[#2D3436] hover:border-[#6B46FE]/40"
              >
                Heading
              </button>
              <button
                type="button"
                onClick={addParagraph}
                className="rounded-xl border border-[#E8EAEF] bg-[#F8F9FB] px-3 py-4 text-center text-xs font-bold text-[#2D3436] hover:border-[#6B46FE]/40"
              >
                Paragraph
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#E8EAEF] bg-[#F8F9FB] px-3 py-4 text-center text-xs font-bold text-[#2D3436] hover:border-[#6B46FE]/40"
              >
                Shape
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#E8EAEF] bg-[#F8F9FB] px-3 py-4 text-center text-xs font-bold text-[#2D3436] hover:border-[#6B46FE]/40"
              >
                Frame
              </button>
            </div>
            <p className="text-[11px] font-semibold text-[#8B93A1]">Photos</p>
            <div className="grid grid-cols-3 gap-1.5">
              {photos.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => addPhotoToPage({ id: p.id, url: p.url })}
                  className="aspect-square overflow-hidden rounded-lg border border-[#E8EAEF] hover:ring-2 hover:ring-[#6B46FE]/40"
                >
                  <img src={p.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'background' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#2D3436]">Background</h3>
            <div className="grid grid-cols-4 gap-2">
              {['#FFFFFF', '#F8F9FB', '#F5F0E8', '#121218', '#0B1220', '#FFF8FA', '#EEF0F4', '#1A1A1A'].map(
                (color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      pushHistory();
                      const idx = useEditorStore.getState().currentPageIndex;
                      setAlbum({
                        ...album,
                        pages: album.pages.map((p, i) =>
                          i === idx ? { ...p, background: color } : p,
                        ),
                      });
                    }}
                    className="aspect-square rounded-lg border border-[#E8EAEF] shadow-inner"
                    style={{ background: color }}
                  />
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
