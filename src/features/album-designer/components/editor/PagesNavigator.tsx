import { ChevronDown, Plus } from 'lucide-react';
import { useEditorStore } from '../../store';
import { cn } from '@/lib/utils';

export function PagesNavigator() {
  const album = useEditorStore((s) => s.album);
  const currentPageIndex = useEditorStore((s) => s.currentPageIndex);
  const setPageIndex = useEditorStore((s) => s.setPageIndex);
  const addPage = useEditorStore((s) => s.addPage);

  if (!album) return null;

  const spreads: { start: number; left: (typeof album.pages)[0]; right?: (typeof album.pages)[0] }[] =
    [];
  for (let i = 0; i < album.pages.length; i += 2) {
    spreads.push({ start: i, left: album.pages[i], right: album.pages[i + 1] });
  }
  const activeSpread = Math.floor(currentPageIndex / 2);

  return (
    <aside className="hidden w-[200px] shrink-0 flex-col border-l border-[#E8EAEF] bg-white xl:flex">
      <div className="flex items-center justify-between border-b border-[#E8EAEF] px-3 py-3">
        <div>
          <p className="text-xs font-bold text-[#2D3436]">Pages</p>
          <button
            type="button"
            className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-[#8B93A1]"
          >
            {album.pages.length} Pages
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
        <button
          type="button"
          onClick={addPage}
          className="inline-flex items-center gap-1 rounded-lg bg-[#F3EEFF] px-2 py-1.5 text-[10px] font-bold text-[#6B46FE] hover:bg-[#EBE4FF]"
        >
          <Plus className="h-3 w-3" />
          Add Page
        </button>
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto p-3">
        {spreads.map((spread, si) => {
          const active = si === activeSpread;
          const label = spread.right
            ? `${spread.start + 1}-${spread.start + 2}`
            : `${spread.start + 1}`;
          return (
            <button
              key={spread.left.id}
              type="button"
              onClick={() => setPageIndex(spread.start)}
              className="w-full text-left"
            >
              <div
                className={cn(
                  'flex aspect-[2/1.15] overflow-hidden rounded-lg border-2 transition-all',
                  active
                    ? 'border-[#6B46FE] shadow-md shadow-[#6B46FE]/15'
                    : 'border-[#E8EAEF] hover:border-[#C9B8FF]',
                )}
              >
                <div
                  className="w-1/2 border-r border-black/5"
                  style={{ background: spread.left.background }}
                >
                  <MiniPreview page={spread.left} />
                </div>
                <div
                  className="w-1/2"
                  style={{ background: spread.right?.background ?? '#F8F9FB' }}
                >
                  {spread.right ? <MiniPreview page={spread.right} /> : null}
                </div>
              </div>
              <p
                className={cn(
                  'mt-1 text-center text-[10px] font-bold',
                  active ? 'text-[#6B46FE]' : 'text-[#A0A4B0]',
                )}
              >
                {label}
              </p>
            </button>
          );
        })}
      </div>

      <div className="border-t border-[#E8EAEF] p-3">
        <button
          type="button"
          className="w-full rounded-xl border border-[#E8EAEF] py-2 text-xs font-bold text-[#5B6472] hover:bg-[#F8F9FB]"
        >
          View All Pages
        </button>
      </div>
    </aside>
  );
}

function MiniPreview({ page }: { page: { elements: { type: string; url?: string; x: number; y: number; width: number; height: number }[] } }) {
  const photos = page.elements.filter((e) => e.type === 'photo').slice(0, 3);
  if (!photos.length) return null;
  return (
    <div className="relative h-full w-full">
      {photos.map((p, i) => (
        <div
          key={i}
          className="absolute overflow-hidden rounded-[1px] bg-[#ddd]"
          style={{
            left: `${p.x * 0.9}%`,
            top: `${p.y * 0.9}%`,
            width: `${Math.max(18, p.width * 0.85)}%`,
            height: `${Math.max(18, p.height * 0.85)}%`,
          }}
        >
          {p.url ? (
            <img src={p.url} alt="" className="h-full w-full object-cover opacity-90" />
          ) : null}
        </div>
      ))}
    </div>
  );
}
