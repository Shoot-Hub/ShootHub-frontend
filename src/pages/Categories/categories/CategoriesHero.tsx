import { motion } from 'framer-motion';
import { Camera, Search, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { fadeInUp, staggerContainer } from '@/lib/motion';

type CategoriesHeroProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function CategoriesHero({ search, onSearchChange }: CategoriesHeroProps) {
  return (
    <section className="relative overflow-hidden pb-4 pt-10 md:pt-14 lg:pt-16" aria-label="Categories hero">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[10%] top-[20%] h-[220px] w-[220px] rounded-full bg-primary-100/70 blur-3xl" />
        <div className="absolute bottom-[10%] right-[8%] h-[200px] w-[200px] rounded-full bg-purple-100/50 blur-3xl" />
      </div>

      <Container size="wide" padding="tight">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeInUp} className="flex justify-center">
            <Badge icon={<Camera className="h-3.5 w-3.5 fill-primary-500 text-primary-500" />}>
              Explore Photography Categories
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="mt-5 text-[40px] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-[52px] md:text-[60px]"
          >
            Explore Photography{' '}
            <span className="text-primary-500">Categories</span>
            <Sparkles
              className="ml-2 inline h-6 w-6 fill-primary-300 text-primary-300 sm:h-7 sm:w-7"
              aria-hidden="true"
            />
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-4 max-w-xl text-[15px] leading-[1.7] text-ink-muted md:text-base"
          >
            Discover photographers for every occasion.
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
                placeholder="Search categories..."
                className="h-11 w-full bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink-light"
                aria-label="Search categories"
              />
            </div>
            <Button type="submit" size="md" pill className="shrink-0 sm:h-11">
              Search
            </Button>
          </motion.form>
        </motion.div>
      </Container>
    </section>
  );
}
