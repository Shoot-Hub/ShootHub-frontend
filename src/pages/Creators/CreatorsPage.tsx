import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CTASection, FAQSection, PageShell } from '@/components/marketing';
import { CreatorsFilters, type CreatorsFiltersState } from './creators/CreatorsFilters';
import { CreatorsGrid } from './creators/CreatorsGrid';
import { CreatorsHero } from './creators/CreatorsHero';
import {
  creatorCategories,
  creatorsData,
  creatorsFAQ,
  normalizeCategory,
} from './creators/data';

const initialFilters: CreatorsFiltersState = {
  city: 'All Cities',
  category: 'All Categories',
  rating: 0,
  maxPrice: 0,
};

function resolveCategoryParam(param: string | null): string {
  if (!param) return 'All Categories';
  const match = creatorCategories.find(
    (cat) => cat !== 'All Categories' && normalizeCategory(cat) === normalizeCategory(param),
  );
  return match ?? 'All Categories';
}

export function CreatorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = resolveCategoryParam(searchParams.get('category'));

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<CreatorsFiltersState>(() => ({
    ...initialFilters,
    category: categoryFromUrl,
  }));

  useEffect(() => {
    setFilters((prev) =>
      prev.category === categoryFromUrl ? prev : { ...prev, category: categoryFromUrl },
    );
  }, [categoryFromUrl]);

  const handleFiltersChange = (next: CreatorsFiltersState) => {
    setFilters(next);
    const params = new URLSearchParams(searchParams);
    if (next.category === 'All Categories') {
      params.delete('category');
    } else {
      params.set('category', next.category);
    }
    setSearchParams(params, { replace: true });
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return creatorsData.filter((c) => {
      const matchesSearch =
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query);
      const matchesCity = filters.city === 'All Cities' || c.city === filters.city;
      const matchesCategory =
        filters.category === 'All Categories' ||
        normalizeCategory(c.category) === normalizeCategory(filters.category);
      const matchesRating = c.rating >= filters.rating;
      const matchesPrice = filters.maxPrice === 0 || c.priceValue <= filters.maxPrice;
      return matchesSearch && matchesCity && matchesCategory && matchesRating && matchesPrice;
    });
  }, [search, filters]);

  const activeCategory =
    filters.category !== 'All Categories' ? filters.category : undefined;

  return (
    <PageShell>
      <CreatorsHero
        search={search}
        onSearchChange={setSearch}
        category={activeCategory}
      />
      <CreatorsFilters filters={filters} onChange={handleFiltersChange} />
      <CreatorsGrid items={filtered} category={activeCategory} />
      <FAQSection items={creatorsFAQ} />
      <CTASection
        title="Are you a creator?"
        subtitle="Join ShootHub and get discovered by thousands of clients."
        primaryLabel="Become a Creator"
        secondaryLabel="Browse Categories"
        secondaryTo="/categories"
      />
    </PageShell>
  );
}
