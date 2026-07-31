import { useMemo, useState } from 'react';
import {
  Briefcase,
  Cake,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Gem,
  Heart,
  Images,
  Lock,
  Share2,
  Sparkles,
  UserRound,
} from 'lucide-react';
import {
  galleryCategories,
  userGalleries,
  type GalleryCategory,
} from '../data/galleriesData';

const categoryIcons: Record<GalleryCategory, typeof Images> = {
  all: Images,
  wedding: Heart,
  'pre-wedding': Sparkles,
  engagement: Gem,
  birthday: Cake,
  corporate: Briefcase,
  other: Images,
};

export function MyGalleriesPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const totalGalleries = 23;

  const filtered = useMemo(() => {
    const list =
      activeCategory === 'all'
        ? [...userGalleries]
        : userGalleries.filter((g) => g.category === activeCategory);
    return sortBy === 'oldest' ? list.reverse() : list;
  }, [activeCategory, sortBy]);

  const totalPages = Math.max(1, Math.ceil(Math.max(filtered.length, 1) / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const showingFrom = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, filtered.length);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">My Galleries</h2>
          <p className="mt-1 text-sm text-[#8B93A1]">
            Browse all shared photo galleries from your events.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#EEF0F4] bg-white px-3.5 text-sm font-semibold text-[#2D3436] transition-colors hover:border-[#6B46FE]/30 hover:text-[#6B46FE]"
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
          <label className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 appearance-none rounded-xl border border-[#EEF0F4] bg-white py-2 pl-3 pr-8 text-sm font-semibold text-[#2D3436] outline-none focus:border-[#6B46FE]/40 focus:ring-2 focus:ring-[#6B46FE]/15"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A0A4B0]" />
          </label>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {galleryCategories.map((cat) => {
          const Icon = categoryIcons[cat.id];
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                setPage(1);
              }}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition-all ${
                active
                  ? 'border-[#6B46FE] bg-[#6B46FE] text-white shadow-sm shadow-[#6B46FE]/25'
                  : 'border-[#EEF0F4] bg-white text-[#2D3436] hover:border-[#6B46FE]/30 hover:text-[#6B46FE]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {paged.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#EEF0F4] bg-white px-6 py-16 text-center">
          <p className="text-sm font-semibold text-[#2D3436]">No galleries found</p>
          <p className="mt-1 text-xs text-[#8B93A1]">Try another category.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {paged.map((gallery) => (
            <article
              key={gallery.id}
              className="overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_4px_20px_-8px_rgba(17,24,39,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(107,70,254,0.2)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={gallery.coverImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                  {gallery.photoCount} Photos
                </span>
                {gallery.locked ? (
                  <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm">
                    <Lock className="h-3.5 w-3.5" />
                  </span>
                ) : null}
              </div>

              <div className="space-y-3 p-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3EEFF] px-2.5 py-1 text-[11px] font-bold text-[#6B46FE]">
                  <CalendarDays className="h-3 w-3" />
                  {gallery.date}
                </span>
                <div>
                  <h3 className="truncate text-[15px] font-bold text-[#1A1A2E]">{gallery.title}</h3>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[#8B93A1]">
                    <UserRound className="h-3.5 w-3.5 text-[#6B46FE]" />
                    {gallery.photographer}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex-1 rounded-xl border border-[#6B46FE] px-3 py-2 text-sm font-semibold text-[#6B46FE] transition-colors hover:bg-[#6B46FE] hover:text-white"
                  >
                    View Gallery
                  </button>
                  <button
                    type="button"
                    aria-label="Download"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EEF0F4] text-[#636E72] transition-colors hover:border-[#6B46FE]/30 hover:text-[#6B46FE]"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Share"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EEF0F4] text-[#636E72] transition-colors hover:border-[#6B46FE]/30 hover:text-[#6B46FE]"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous page"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEF0F4] bg-white text-[#636E72] disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {[1, 2, 3].slice(0, totalPages).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                n === currentPage
                  ? 'bg-[#6B46FE] text-white shadow-md shadow-[#6B46FE]/25'
                  : 'border border-[#EEF0F4] bg-white text-[#636E72]'
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next page"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEF0F4] bg-white text-[#636E72] disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs font-medium text-[#8B93A1]">
          Showing {showingFrom} to {showingTo} of {totalGalleries} galleries
        </p>
      </div>
    </section>
  );
}
