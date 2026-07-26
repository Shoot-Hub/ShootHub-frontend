import { Copy, Trash2, GripVertical } from 'lucide-react';
import { useEditorStore } from '../../store';
import { cn } from '@/lib/utils';

export function PageRail() {
  const album = useEditorStore((s) => s.album);
  const currentPageIndex = useEditorStore((s) => s.currentPageIndex);
  const setPageIndex = useEditorStore((s) => s.setPageIndex);
  const duplicatePage = useEditorStore((s) => s.duplicatePage);
  const deletePage = useEditorStore((s) => s.deletePage);
  const movePage = useEditorStore((s) => s.movePage);

  if (!album) return null;

  return (
    <aside className="flex w-[112px] shrink-0 flex-col border-r border-[#EEF0F4] bg-white">
      <div className="border-b border-[#EEF0F4] px-2 py-2.5">
        <p className="text-center text-[10px] font-bold uppercase tracking-wider text-[#A0A4B0]">
          Pages
        </p>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        {album.pages.map((page, index) => {
          const active = index === currentPageIndex;
          return (
            <div
              key={page.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/page-index', String(index));
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const from = Number(e.dataTransfer.getData('text/page-index'));
                if (!Number.isNaN(from)) movePage(from, index);
              }}
              className={cn(
                'group relative cursor-pointer rounded-lg border-2 p-1 transition-all',
                active
                  ? 'border-[#6B46FE] shadow-sm shadow-[#6B46FE]/20'
                  : 'border-transparent hover:border-[#EEF0F4]',
              )}
              onClick={() => setPageIndex(index)}
            >
              <div
                className="aspect-[3/4] rounded-md"
                style={{ background: page.background }}
              >
                <div className="flex h-full items-center justify-center">
                  <GripVertical className="h-3 w-3 text-[#C0C4CC] opacity-0 group-hover:opacity-100" />
                </div>
              </div>
              <p className="mt-1 text-center text-[10px] font-semibold text-[#636E72]">
                {index + 1}
              </p>
              {active && (
                <div className="absolute -right-1 -top-1 flex gap-0.5">
                  <button
                    type="button"
                    title="Duplicate page"
                    className="flex h-5 w-5 items-center justify-center rounded bg-white text-[#6B46FE] shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicatePage(index);
                    }}
                  >
                    <Copy className="h-2.5 w-2.5" />
                  </button>
                  <button
                    type="button"
                    title="Delete page"
                    className="flex h-5 w-5 items-center justify-center rounded bg-white text-[#EA5455] shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePage(index);
                    }}
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
