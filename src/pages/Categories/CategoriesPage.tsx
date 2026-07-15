import { useMemo, useState } from 'react';
import {
  CTASection,
  FAQSection,
  PageShell,
  TestimonialGrid,
} from '@/components/marketing';
import { CategoriesHero } from './categories/CategoriesHero';
import { CategoryFilters, type CategoryFiltersState } from './categories/CategoryFilters';
import { CategoryGrid } from './categories/CategoryGrid';
import { categoriesData } from './categories/data';
import { categoriesFAQ, priceRanges } from './categories/filters';

const initialFilters: CategoryFiltersState = {
  priceIndex: 0,
  city: 'All Cities',
  rating: 0,
  availability: 'Any Time',
};

export function CategoriesPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<CategoryFiltersState>(initialFilters);

  const filtered = useMemo(() => {
    const range = priceRanges[filters.priceIndex];
    const query = search.trim().toLowerCase();

    return categoriesData.filter((cat) => {
      const matchesSearch =
        !query ||
        cat.title.toLowerCase().includes(query) ||
        cat.description.toLowerCase().includes(query);
      const matchesPrice =
        cat.startingPrice >= range.min && cat.startingPrice <= range.max;
      const matchesRating = cat.rating >= filters.rating;
      return matchesSearch && matchesPrice && matchesRating;
    });
  }, [search, filters]);

  const featured = categoriesData.filter((c) => c.featured);
  const recent = categoriesData.filter((c) => c.recentlyAdded);

  return (
    <PageShell>
      <CategoriesHero search={search} onSearchChange={setSearch} />
      <CategoryFilters filters={filters} onChange={setFilters} />
      <CategoryGrid items={filtered} />
      <CategoryGrid
        items={featured}
        eyebrow="Featured"
        title="Featured Categories"
        subtitle="Hand-picked categories with exceptional creator quality."
      />
      <div className="bg-[#fbfaff]">
        <CategoryGrid
          items={recent}
          eyebrow="New"
          title="Recently Added"
          subtitle="Fresh specialties joining the ShootHub marketplace."
        />
      </div>
      <TestimonialGrid className="bg-white" />
      <FAQSection items={categoriesFAQ} />
      <CTASection />
    </PageShell>
  );
}
