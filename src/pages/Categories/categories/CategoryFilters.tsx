import type { ReactNode } from 'react';
import { ChevronDown, MapPin, Star, Wallet, CalendarCheck, type LucideIcon } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { cities, priceRanges, ratingFilters } from './filters';

export type CategoryFiltersState = {
  priceIndex: number;
  city: string;
  rating: number;
  availability: string;
};

type CategoryFiltersProps = {
  filters: CategoryFiltersState;
  onChange: (next: CategoryFiltersState) => void;
};

const availabilityOptions = ['Any Time', 'This Week', 'This Month', 'Flexible'] as const;

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
          className="h-11 w-full appearance-none rounded-xl border border-border/60 bg-white pl-10 pr-9 text-sm font-semibold text-ink outline-none transition-colors focus:border-primary-300"
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
      </div>
    </label>
  );
}

export function CategoryFilters({ filters, onChange }: CategoryFiltersProps) {
  return (
    <Container size="wide" padding="tight" className="mt-8">
      <div className="rounded-[20px] border border-border/40 bg-white/80 p-4 shadow-card backdrop-blur-md sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FilterSelect
            label="Price"
            icon={Wallet}
            value={filters.priceIndex}
            onChange={(v) => onChange({ ...filters, priceIndex: Number(v) })}
          >
            {priceRanges.map((range, i) => (
              <option key={range.label} value={i}>
                {range.label}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            label="City"
            icon={MapPin}
            value={filters.city}
            onChange={(v) => onChange({ ...filters, city: v })}
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            label="Rating"
            icon={Star}
            value={filters.rating}
            onChange={(v) => onChange({ ...filters, rating: Number(v) })}
          >
            {ratingFilters.map((r) => (
              <option key={r.label} value={r.value}>
                {r.label}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            label="Availability"
            icon={CalendarCheck}
            value={filters.availability}
            onChange={(v) => onChange({ ...filters, availability: v })}
          >
            {availabilityOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </FilterSelect>
        </div>
      </div>
    </Container>
  );
}
