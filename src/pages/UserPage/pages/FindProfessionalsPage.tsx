import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  Camera,
  ChevronDown,
  ChevronRight,
  Grid2x2,
  Heart,
  LayoutGrid,
  MapPin,
  Package,
  Search,
  Shirt,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserRound,
  Video,
} from 'lucide-react';
import {
  formatPrice,
  professionalCategories,
  professionalLocations,
  professionals,
  type ProfessionalCategoryId,
  type ProfessionalListing,
} from '../data/professionalsData';

const categoryIcons: Record<ProfessionalCategoryId, typeof LayoutGrid> = {
  all: LayoutGrid,
  wedding: Heart,
  'pre-wedding': Sparkles,
  event: Camera,
  portrait: UserRound,
  fashion: Shirt,
  product: Package,
  video: Video,
};

function ProfessionalCard({
  pro,
  favorited,
  onToggleFavorite,
}: {
  pro: ProfessionalListing;
  favorited: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_4px_20px_-8px_rgba(17,24,39,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(107,70,254,0.2)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={pro.coverImage}
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <button
          type="button"
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          onClick={onToggleFavorite}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
        >
          <Heart
            className={`h-4 w-4 ${favorited ? 'fill-[#EA5455] text-[#EA5455]' : ''}`}
          />
        </button>
        <img
          src={pro.avatar}
          alt=""
          className="absolute -bottom-5 left-4 h-12 w-12 rounded-full border-[3px] border-white object-cover shadow-md"
        />
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-7">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-bold text-[#1A1A2E]">{pro.name}</h3>
            <p className="mt-0.5 truncate text-xs text-[#8B93A1]">{pro.specialty}</p>
          </div>
          {pro.verified ? (
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[#E8F8EF] px-2 py-0.5 text-[10px] font-bold text-[#1B9C5A]">
              <BadgeCheck className="h-3 w-3" />
              Verified
            </span>
          ) : null}
        </div>

        <div className="mt-3 space-y-1.5 text-xs text-[#5B6472]">
          <p className="inline-flex items-center gap-1.5 font-semibold text-[#1A1A2E]">
            <Star className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]" />
            {pro.rating.toFixed(1)}
            <span className="font-medium text-[#8B93A1]">({pro.reviewCount} reviews)</span>
          </p>
          <p className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#6B46FE]" />
            {pro.location}
          </p>
          <p className="pt-0.5 text-sm font-bold text-[#1A1A2E]">
            {formatPrice(pro.startingPrice)}{' '}
            <span className="text-xs font-medium text-[#8B93A1]">/ event onwards</span>
          </p>
        </div>

        <Link
          to={`/user/find-professionals`}
          className="mt-4 flex w-full items-center justify-center rounded-xl border border-[#6B46FE] px-3 py-2.5 text-sm font-semibold text-[#6B46FE] transition-colors hover:bg-[#6B46FE] hover:text-white"
        >
          View Profile
        </Link>
      </div>
    </article>
  );
}

export function FindProfessionalsPage() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('All Locations');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [activeCategory, setActiveCategory] = useState<ProfessionalCategoryId>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const chipsRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return professionals.filter((pro) => {
      const matchesQuery =
        !q ||
        pro.name.toLowerCase().includes(q) ||
        pro.location.toLowerCase().includes(q) ||
        pro.specialty.toLowerCase().includes(q) ||
        pro.categories.some((c) => c.toLowerCase().includes(q));

      const matchesLocation =
        location === 'All Locations' || pro.location === location;

      const matchesDropdownCategory =
        categoryFilter === 'All Categories' ||
        pro.categories.some((c) => c.toLowerCase() === categoryFilter.toLowerCase()) ||
        pro.categoryIds.includes(categoryFilter.toLowerCase() as ProfessionalCategoryId);

      const matchesChip =
        activeCategory === 'all' || pro.categoryIds.includes(activeCategory);

      return matchesQuery && matchesLocation && matchesDropdownCategory && matchesChip;
    });
  }, [query, location, categoryFilter, activeCategory]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const scrollChips = () => {
    chipsRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">Find Professionals</h2>
        <p className="mt-1 text-sm text-[#8B93A1]">
          Discover and book photographers near you.
        </p>
      </div>

      {/* Search / filters bar */}
      <div className="rounded-2xl border border-[#EEF0F4] bg-white p-3 shadow-[0_4px_20px_-8px_rgba(17,24,39,0.08)] sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A4B0]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, city, or specialty..."
              className="h-11 w-full rounded-xl border border-[#EEF0F4] bg-[#F8F9FB] py-2.5 pl-10 pr-4 text-sm text-[#2D3436] outline-none transition-all placeholder:text-[#A0A4B0] focus:border-[#6B46FE]/40 focus:bg-white focus:ring-2 focus:ring-[#6B46FE]/15"
            />
          </div>

          <div className="flex flex-wrap gap-2 sm:flex-nowrap">
            <label className="relative min-w-[150px] flex-1">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B46FE]" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-[#EEF0F4] bg-white py-2 pl-9 pr-8 text-sm font-medium text-[#2D3436] outline-none focus:border-[#6B46FE]/40 focus:ring-2 focus:ring-[#6B46FE]/15"
              >
                {professionalLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A4B0]" />
            </label>

            <label className="relative min-w-[150px] flex-1">
              <Grid2x2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B46FE]" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-[#EEF0F4] bg-white py-2 pl-9 pr-8 text-sm font-medium text-[#2D3436] outline-none focus:border-[#6B46FE]/40 focus:ring-2 focus:ring-[#6B46FE]/15"
              >
                <option>All Categories</option>
                {professionalCategories
                  .filter((c) => c.id !== 'all')
                  .map((c) => (
                    <option key={c.id} value={c.label}>
                      {c.label}
                    </option>
                  ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0A4B0]" />
            </label>

            <button
              type="button"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-[#EEF0F4] bg-white px-4 text-sm font-semibold text-[#2D3436] transition-colors hover:border-[#6B46FE]/30 hover:text-[#6B46FE]"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div className="relative flex items-center gap-2">
        <div
          ref={chipsRef}
          className="flex flex-1 gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {professionalCategories.map((cat) => {
            const Icon = categoryIcons[cat.id];
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition-all ${
                  active
                    ? 'border-[#6B46FE] bg-[#F3EEFF] text-[#6B46FE]'
                    : 'border-[#EEF0F4] bg-white text-[#2D3436] hover:border-[#6B46FE]/30 hover:text-[#6B46FE]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          aria-label="Scroll categories"
          onClick={scrollChips}
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#EEF0F4] bg-white text-[#636E72] shadow-sm transition-colors hover:text-[#6B46FE] md:flex"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#EEF0F4] bg-white px-6 py-16 text-center">
          <p className="text-sm font-semibold text-[#2D3436]">No professionals found</p>
          <p className="mt-1 text-xs text-[#8B93A1]">Try changing your search or filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((pro) => (
            <ProfessionalCard
              key={pro.id}
              pro={pro}
              favorited={favorites.has(pro.id)}
              onToggleFavorite={() => toggleFavorite(pro.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
