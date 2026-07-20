import { Search, Grid3X3, List, SlidersHorizontal, Heart, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Gallery, GalleryFilter, GallerySort, GalleryView } from '../types';

type Props = {
  gallery: Gallery;
  search: string;
  onSearchChange: (v: string) => void;
  view: GalleryView;
  onViewChange: (v: GalleryView) => void;
  sort: GallerySort;
  onSortChange: (v: GallerySort) => void;
  filter: GalleryFilter;
  onFilterChange: (v: GalleryFilter) => void;
  onShare: () => void;
  favoriteCount: number;
};

export function GalleryHeader({
  gallery, search, onSearchChange, view, onViewChange,
  sort, onSortChange, filter, onFilterChange, onShare, favoriteCount,
}: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#EEF0F4]/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-[#111827] sm:text-xl">{gallery.name}</h1>
            <p className="text-xs text-[#636E72] sm:text-sm">
              {gallery.eventDate} · {gallery.location} · {gallery.photographer.name} · {gallery.photoCount.toLocaleString()} photos
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A4B0]" />
              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search photos..."
                className="w-full rounded-2xl border border-[#EEF0F4] bg-[#F8F9FB] py-2 pl-9 pr-4 text-sm outline-none transition focus:border-[#6C3BFF]/40 focus:ring-2 focus:ring-[#6C3BFF]/10 sm:w-52"
              />
            </div>

            <div className="flex rounded-2xl border border-[#EEF0F4] bg-[#F8F9FB] p-1">
              {(['grid', 'list'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => onViewChange(v)}
                  className={cn(
                    'rounded-xl p-2 transition',
                    view === v ? 'bg-white text-[#6C3BFF] shadow-sm' : 'text-[#636E72]',
                  )}
                >
                  {v === 'grid' ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
                </button>
              ))}
            </div>

            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as GallerySort)}
              className="rounded-2xl border border-[#EEF0F4] bg-white px-3 py-2 text-sm text-[#636E72] outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name">Name</option>
              <option value="favorite">Favorites</option>
            </select>

            <button
              type="button"
              onClick={() => onFilterChange(filter === 'favorites' ? 'all' : 'favorites')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-2xl border px-3 py-2 text-sm font-medium transition',
                filter === 'favorites'
                  ? 'border-[#6C3BFF] bg-[#F3EEFF] text-[#6C3BFF]'
                  : 'border-[#EEF0F4] text-[#636E72] hover:bg-[#F8F9FB]',
              )}
            >
              <Heart className="h-4 w-4" />
              {favoriteCount}
            </button>

            <button
              type="button"
              onClick={onShare}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-[#EEF0F4] px-3 py-2 text-sm font-medium text-[#636E72] transition hover:bg-[#F8F9FB]"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button type="button" className="rounded-2xl border border-[#EEF0F4] p-2 text-[#636E72] lg:hidden">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
