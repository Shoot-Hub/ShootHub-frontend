import { Filter, Search, ArrowUpDown } from 'lucide-react';
import { FILTER_OPTIONS, SORT_OPTIONS } from '../../constants';
import type { AlbumFilterKey, AlbumSortKey } from '../../types';

type Props = {
  search: string;
  filter: AlbumFilterKey;
  sort: AlbumSortKey;
  onSearch: (v: string) => void;
  onFilter: (v: AlbumFilterKey) => void;
  onSort: (v: AlbumSortKey) => void;
};

export function AlbumToolbar({ search, filter, sort, onSearch, onFilter, onSort }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A4B0]" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search albums, clients, events…"
          className="h-11 w-full rounded-xl border border-[#EEF0F4] bg-white py-2.5 pl-10 pr-4 text-sm text-[#2D3436] outline-none transition-all placeholder:text-[#A0A4B0] focus:border-[#6B46FE]/40 focus:ring-2 focus:ring-[#6B46FE]/15"
        />
      </div>
      <div className="flex gap-2">
        <div className="relative">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A0A4B0]" />
          <select
            value={filter}
            onChange={(e) => onFilter(e.target.value as AlbumFilterKey)}
            className="h-11 appearance-none rounded-xl border border-[#EEF0F4] bg-white py-2 pl-9 pr-8 text-sm font-medium text-[#636E72] outline-none focus:border-[#6B46FE]/40"
          >
            {FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A0A4B0]" />
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as AlbumSortKey)}
            className="h-11 appearance-none rounded-xl border border-[#EEF0F4] bg-white py-2 pl-9 pr-8 text-sm font-medium text-[#636E72] outline-none focus:border-[#6B46FE]/40"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
