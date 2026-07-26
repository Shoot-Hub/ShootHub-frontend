import { Plus } from 'lucide-react';
import { useEditorStore } from '../../store';
import { cn } from '@/lib/utils';

export function PageFilmstrip() {
  const album = useEditorStore((s) => s.album);
  const currentPageIndex = useEditorStore((s) => s.currentPageIndex);
  const setPageIndex = useEditorStore((s) => s.setPageIndex);
  const addPage = useEditorStore((s) => s.addPage);

  if (!album) return null;

  const spreads: { start: number; left: (typeof album.pages)[0]; right?: (typeof album.pages)[0] }[] =
    [];
  for (let i = 0; i < album.pages.length; i += 2) {
    spreads.push({
      start: i,
      left: album.pages[i],
      right: album.pages[i + 1],
    });
  }

  const activeSpread = Math.floor(currentPageIndex / 2);

  return (
    <div className="flex h-[88px] shrink-0 items-center gap-2 overflow-x-auto border-t border-[#E8EAEF] bg-white px-3">
      {spreads.map((spread, si) => {
        const active = si === activeSpread;
        const label = spread.right ? `${spread.start + 1}-${spread.start + 2}` : `${spread.start + 1}`;
        return (
          <button
            key={spread.left.id}
            type="button"
            onClick={() => setPageIndex(spread.start)}
            className="flex shrink-0 flex-col items-center gap-1"
          >
            <div
              className={cn(
                'flex h-12 overflow-hidden rounded-md border-2 bg-[#F3F4F7] shadow-sm transition-all',
                active ? 'border-[#6B46FE] shadow-[#6B46FE]/20' : 'border-[#E8EAEF] hover:border-[#C9B8FF]',
              )}
            >
              <div
                className="h-full w-9 border-r border-black/5"
                style={{ background: spread.left.background }}
              />
              <div
                className="h-full w-9"
                style={{ background: spread.right?.background ?? '#F8F9FB' }}
              />
            </div>
            <span
              className={cn(
                'text-[10px] font-bold',
                active ? 'text-[#6B46FE]' : 'text-[#A0A4B0]',
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
      <button
        type="button"
        onClick={addPage}
        className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-md border-2 border-dashed border-[#C9B8FF] bg-[#F8F5FF] text-[#6B46FE] hover:bg-[#F3EEFF]"
        title="Add Page"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}
