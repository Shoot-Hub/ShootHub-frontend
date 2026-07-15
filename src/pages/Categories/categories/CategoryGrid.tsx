import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/marketing';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { CategoryDetailCard } from './CategoryDetailCard';
import type { CategoryItem } from './data';

type CategoryGridProps = {
  items: CategoryItem[];
  title?: string;
  subtitle?: string;
  eyebrow?: string;
};

export function CategoryGrid({
  items,
  title = 'Popular Categories',
  subtitle = 'Browse our most booked photography categories.',
  eyebrow = 'Browse',
}: CategoryGridProps) {
  return (
    <Section padding="lg" className="bg-white">
      <Container size="wide" padding="tight">
        <SectionHeader
          eyebrow={eyebrow}
          eyebrowIcon={<Sparkles className="h-3.5 w-3.5 text-primary-500" strokeWidth={2.5} />}
          title={
            <>
              {title.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-primary-500">{title.split(' ').slice(-1)}</span>
            </>
          }
          subtitle={subtitle}
        />

        {items.length === 0 ? (
          <p className="mt-12 text-center text-sm text-ink-muted">
            No categories match your filters. Try adjusting search or filters.
          </p>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((category) => (
              <motion.div key={category.id} variants={fadeInUp}>
                <CategoryDetailCard category={category} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
    </Section>
  );
}
