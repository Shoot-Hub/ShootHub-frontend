import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

export function ReelsPagination({ page, pages, onPageChange }: Props) {
  if (pages <= 1) return null;

  const visiblePages = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pages || Math.abs(p - page) <= 1,
  );

  return (
    <div className="flex items-center justify-center gap-1.5 mt-12">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:border-slate-300 hover:shadow-sm"
      >
        <ChevronLeft className="h-4 w-4" />
        Prev
      </button>

      {visiblePages.map((p, idx, arr) => {
        const showGap = idx > 0 && p - arr[idx - 1] > 1;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {showGap && (
              <span className="flex h-9 w-9 items-center justify-center text-slate-300 text-sm select-none">
                …
              </span>
            )}
            <button
              onClick={() => onPageChange(p)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                p === page
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-slate-100'
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:border-slate-300 hover:shadow-sm"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
