import type { ReactNode } from 'react';
import { ChevronDown, MapPin, Camera, Star, Wallet, type LucideIcon } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { creatorCategories, creatorCities } from './data';

export type CreatorsFiltersState = {
  city: string;
  category: string;
  rating: number;
  maxPrice: number;
};

type CreatorsFiltersProps = {
  filters: CreatorsFiltersState;
  onChange: (next: CreatorsFiltersState) => void;
};

function FilterSelect({
  label,
  icon: Icon,
  value,
  onChange,
  children,
}: {
  label: string;
  icon: LucideIcon;
  value: string | number;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-light">
        {label}
      </span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-500" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-border/60 bg-white pl-10 pr-9 text-sm font-semibold text-ink outline-none focus:border-primary-300"
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
      </div>
    </label>
  );
}

export function CreatorsFilters({ filters, onChange }: CreatorsFiltersProps) {
  return (
    <Container size="wide" padding="tight" className="mt-6">
      <div className="rounded-[20px] border border-border/40 bg-white/80 p-4 shadow-card backdrop-blur-md sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FilterSelect
            label="City"
            icon={MapPin}
            value={filters.city}
            onChange={(v) => onChange({ ...filters, city: v })}
          >
            {creatorCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            label="Category"
            icon={Camera}
            value={filters.category}
            onChange={(v) => onChange({ ...filters, category: v })}
          >
            {creatorCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            label="Rating"
            icon={Star}
            value={filters.rating}
            onChange={(v) => onChange({ ...filters, rating: Number(v) })}
          >
            <option value={0}>Any Rating</option>
            <option value={4.5}>4.5+</option>
            <option value={4.8}>4.8+</option>
            <option value={4.9}>4.9+</option>
          </FilterSelect>

          <FilterSelect
            label="Budget"
            icon={Wallet}
            value={filters.maxPrice}
            onChange={(v) => onChange({ ...filters, maxPrice: Number(v) })}
          >
            <option value={0}>Any Budget</option>
            <option value={30000}>Under ₹30,000</option>
            <option value={50000}>Under ₹50,000</option>
            <option value={70000}>Under ₹70,000</option>
            <option value={100000}>Under ₹1,00,000</option>
          </FilterSelect>
        </div>
      </div>
    </Container>
  );
}
