import { motion } from 'framer-motion';
import {
  Calendar,
  Camera,
  ChevronDown,
  MapPin,
  Search,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { fadeInUp } from '@/lib/motion';

const searchFields = [
  {
    id: 'location',
    label: 'Location',
    value: 'Select City',
    icon: MapPin,
  },
  {
    id: 'category',
    label: 'Category',
    value: 'All Categories',
    icon: Camera,
  },
  {
    id: 'date',
    label: 'Event Date',
    value: 'Select Date',
    icon: Calendar,
  },
  {
    id: 'budget',
    label: 'Budget',
    value: 'Any Budget',
    icon: Wallet,
  },
] as const;

export function HeroSearch() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeInUp}
      className="relative z-20 -mt-6 md:-mt-12"
    >
      <Container size="wide" padding="tight">
        <div className="rounded-2xl border border-border/30 bg-white p-2 shadow-search md:rounded-[20px] md:p-2.5">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
            <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {searchFields.map((field) => (
                <button
                  key={field.id}
                  type="button"
                  className="group relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-colors hover:bg-gray-50 lg:border-r lg:border-border lg:px-5 lg:py-4 last:lg:border-r-0"
                  aria-label={`${field.label}: ${field.value}`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary-100 bg-primary-50">
                    <field.icon className="h-[18px] w-[18px] text-primary-500" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-ink-light">{field.label}</p>
                    <div className="flex items-center gap-1">
                      <p className="truncate text-sm font-semibold text-ink">{field.value}</p>
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-ink-light" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <Button
              size="lg"
              className="w-full shrink-0 rounded-xl lg:w-auto lg:min-w-[200px]"
              leftIcon={<Search className="h-5 w-5" strokeWidth={2.5} />}
            >
              Search Creators
            </Button>
          </div>
        </div>
      </Container>
    </motion.div>
  );
}
