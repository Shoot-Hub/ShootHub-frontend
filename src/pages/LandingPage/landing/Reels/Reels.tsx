import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Play, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { ReelCard } from './ReelCard';

const reels = [
  {
    category: 'Wedding Film',
    title: 'Golden Hour Vows',
    bookings: '12.4K',
    video: '/reels/reel-1.mp4',
  },
  {
    category: 'Cinematic Film',
    title: 'Coastal Cinemount',
    bookings: '8.7K',
    video: '/reels/reel-2.mp4',
  },
  {
    category: 'Fashion Editorial',
    title: 'Studio Noir',
    bookings: '6.2K',
    video: '/reels/reel-3.mp4',
  },
  {
    category: 'Travel Shoot',
    title: 'Fiery Trails',
    bookings: '9.1K',
    video: '/reels/reel-4.mp4',
  },
  {
    category: 'Corporate Film',
    title: 'Brand Story',
    bookings: '3.4K',
    video: '/reels/reel-5.mp4',
  },
] as const;

export function Reels() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollNext = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.6, behavior: 'smooth' });
  };

  return (
    <Section id="reels" padding="lg" className="bg-white">
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
              <TrendingUp className="h-3.5 w-3.5 text-primary-500" strokeWidth={2.5} />
              Trending Now
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="mt-4 text-[44px] font-extrabold leading-tight tracking-tight text-ink sm:text-[52px] md:text-[58px]"
          >
            Cinematic <span className="text-primary-500">Reels</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-muted md:text-base"
          >
            Scroll through the styles clients are booking this week — tap any reel to book that exact look.
          </motion.p>
        </motion.div>

        <div className="relative mt-9">
          <motion.div
            ref={scrollRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5"
          >
            {reels.map((reel) => (
              <motion.div key={reel.title} variants={fadeInUp}>
                <ReelCard {...reel} />
              </motion.div>
            ))}
          </motion.div>

          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next reels"
            className="absolute -right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary-200 bg-white text-primary-600 shadow-card transition-colors hover:bg-primary-50 xl:flex"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <Button
            variant="secondary"
            size="lg"
            pill
            className="border-primary-200 bg-white px-8 text-primary-600 hover:border-primary-300 hover:bg-primary-50"
            leftIcon={
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100">
                <Play className="ml-0.5 h-3 w-3 fill-primary-600" strokeWidth={0} />
              </span>
            }
            rightIcon={<ChevronRight className="h-4 w-4 text-primary-500" strokeWidth={2.5} />}
          >
            View All Reels
          </Button>

          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="h-1.5 w-6 rounded-full bg-primary-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary-200" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary-200" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary-200" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary-200" />
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
