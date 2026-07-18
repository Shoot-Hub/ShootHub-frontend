import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/marketing';
import { FeaturedCreatorCard } from '@/pages/LandingPage/landing/FeaturedCreators/FeaturedCreatorCard';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import type { CreatorProfile } from './data';

type CreatorsGridProps = {
  items: CreatorProfile[];
  category?: string;
};

export function CreatorsGrid({ items, category }: CreatorsGridProps) {
  return (
    <Section padding="lg" className="bg-white">
      <Container size="wide" padding="tight">
        <SectionHeader
          eyebrow="Browse"
          eyebrowIcon={<Star className="h-3.5 w-3.5 fill-primary-500 text-primary-500" />}
          title={
            category ? (
              <>
                {category} <span className="text-primary-500">Creators</span>
              </>
            ) : (
              <>
                All <span className="text-primary-500">Creators</span>
              </>
            )
          }
          subtitle={`${items.length} creator${items.length === 1 ? '' : 's'} match your filters.`}
        />

        {items.length === 0 ? (
          <p className="mt-12 text-center text-sm text-ink-muted">
            No creators match your filters. Try adjusting search or filters.
          </p>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={staggerContainer}
            className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6"
          >
            {items.map((creator) => (
              <motion.div key={creator.id} variants={fadeInUp}>
                <FeaturedCreatorCard
                  id={creator.id}
                  name={creator.name}
                  title={creator.title}
                  rating={creator.rating}
                  experience={creator.experience}
                  price={creator.price}
                  image={creator.image}
                  theme={creator.theme}
                  alt={creator.alt}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
    </Section>
  );
}
