import { motion } from 'framer-motion';
import { Search, Star, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { fadeInUp, staggerContainer } from '@/lib/motion';

type CreatorsHeroProps = {
  search: string;
  onSearchChange: (value: string) => void;
  category?: string;
};

export function CreatorsHero({ search, onSearchChange, category }: CreatorsHeroProps) {
  return (
    <section className="relative overflow-hidden pb-4 pt-10 md:pt-14" aria-label="Creators hero">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[10%] top-[20%] h-[200px] w-[200px] rounded-full bg-primary-100/70 blur-3xl" />
        <div className="absolute bottom-[8%] right-[10%] h-[180px] w-[180px] rounded-full bg-purple-100/40 blur-3xl" />
      </div>

      <Container size="wide" padding="tight">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeInUp} className="flex justify-center">
            <Badge icon={<Users className="h-3.5 w-3.5 text-primary-500" />}>
              {category ? `${category} Creators` : 'Verified Creators'}
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="mt-5 text-[40px] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-[52px] md:text-[58px]"
          >
            {category ? (
              <>
                {category}{' '}
                <span className="text-primary-500">Creators</span>
              </>
            ) : (
              <>
                Find Your Perfect{' '}
                <span className="text-primary-500">Creator</span>
              </>
            )}
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-4 max-w-xl text-[15px] leading-[1.7] text-ink-muted md:text-base"
          >
            {category
              ? `Browse verified creators who specialise in ${category.toLowerCase()} shoots.`
              : 'Browse verified photographers and videographers ranked by real client outcomes.'}
          </motion.p>

          <motion.form
            variants={fadeInUp}
            className="mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-[20px] border border-border/40 bg-white/80 p-2 shadow-search backdrop-blur-md sm:flex-row sm:items-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-1 items-center gap-3 px-3">
              <Search className="h-5 w-5 shrink-0 text-primary-500" strokeWidth={2} />
              <input
                type="search"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by name, style, or specialty..."
                className="h-11 w-full bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink-light"
                aria-label="Search creators"
              />
            </div>
            <Button type="submit" size="md" pill className="shrink-0 sm:h-11">
              Search
            </Button>
          </motion.form>

          <motion.p
            variants={fadeInUp}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-muted"
          >
            <Star className="h-3.5 w-3.5 fill-star text-star" strokeWidth={0} />
            12,000+ creators · Avg rating 4.8
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
