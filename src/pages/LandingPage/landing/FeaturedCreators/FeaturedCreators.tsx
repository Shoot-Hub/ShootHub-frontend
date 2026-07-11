import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { FeaturedCreatorCard } from './FeaturedCreatorCard';

import creator1 from '@/assets/landing/featured-creator-1.jpg';
import creator2 from '@/assets/landing/featured-creator-2.jpg';
import creator3 from '@/assets/landing/featured-creator-3.jpg';
import creator4 from '@/assets/landing/featured-creator-4.jpg';

const creators = [
  {
    name: 'Aria Moore',
    title: 'Wedding & Editorial Photographer',
    rating: 4.98,
    experience: '9 yrs exp',
    price: '₹65,000',
    image: creator1,
    theme: 'purple' as const,
    alt: 'Aria Moore, wedding photographer',
  },
  {
    name: 'Kabir Rao',
    title: 'Cinematic Videographer',
    rating: 4.91,
    experience: '6 yrs exp',
    price: '₹92,000',
    image: creator2,
    theme: 'teal' as const,
    alt: 'Kabir Rao, cinematic videographer',
  },
  {
    name: 'Noor Fatima',
    title: 'Drone & Aerial Specialist',
    rating: 4.87,
    experience: '4 yrs exp',
    price: '₹38,000',
    image: creator3,
    theme: 'dark' as const,
    alt: 'Noor Fatima, drone specialist',
  },
  {
    name: 'Ishaan Verma',
    title: 'Fashion & Portrait Studio',
    rating: 4.95,
    experience: '11 yrs exp',
    price: '₹54,000',
    image: creator4,
    theme: 'orange' as const,
    alt: 'Ishaan Verma, fashion portrait photographer',
  },
] as const;

export function FeaturedCreators() {
  return (
    <Section id="creators" padding="lg" className="bg-[#fbfaff]">
      <Container size="wide" padding="tight">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.div variants={fadeInUp} className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-primary-600">
              <Star className="h-3.5 w-3.5 fill-primary-500 text-primary-500" />
              Handpicked Talent
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="mt-4 text-[44px] font-extrabold leading-tight tracking-tight text-ink sm:text-[52px] md:text-[58px]"
          >
            Featured{' '}
            <span className="text-primary-500">Creators</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-muted md:text-base"
          >
            Verified professionals ranked by real client outcomes — not just portfolios.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6"
        >
          {creators.map((creator) => (
            <motion.div key={creator.name} variants={fadeInUp}>
              <FeaturedCreatorCard {...creator} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <Button
            variant="secondary"
            size="lg"
            pill
            className="border-primary-200 bg-white px-8 text-primary-600 hover:border-primary-300 hover:bg-primary-50"
            rightIcon={<ArrowRight className="h-4 w-4 text-primary-500" strokeWidth={2.5} />}
          >
            View All Creators
          </Button>
          <p className="flex items-center gap-1.5 text-sm text-ink-muted">
            <ShieldCheck className="h-4 w-4" strokeWidth={2} />
            All creators are verified and background checked
          </p>
        </motion.div>
      </Container>
    </Section>
  );
}
