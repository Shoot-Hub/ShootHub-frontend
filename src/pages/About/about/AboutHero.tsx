import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { Image } from '@/components/ui/Image';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { aboutHeroImage } from './data';

export function AboutHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pb-8 pt-10 md:pt-14 lg:pt-16"
      aria-label="About hero"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[8%] top-[10%] h-[240px] w-[240px] rounded-full bg-primary-100/70 blur-3xl" />
        <div className="absolute bottom-[5%] right-[5%] h-[220px] w-[220px] rounded-full bg-purple-100/50 blur-3xl" />
      </div>

      <Container size="wide" padding="tight">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp}>
              <Badge icon={<Sparkles className="h-3.5 w-3.5 fill-primary-500 text-primary-500" />}>
                Our Story
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mt-5 text-[40px] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-[52px] md:text-[58px]"
            >
              Building the Future of{' '}
              <span className="text-primary-500">Photography</span>
              <Heart
                className="ml-2 inline h-7 w-7 fill-primary-500 text-primary-500"
                aria-hidden="true"
              />
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-4 max-w-lg text-[15px] leading-[1.7] text-ink-muted md:text-base"
            >
              ShootHub connects clients with verified creators — and gives photographers the
              modern studio they deserve.
            </motion.p>
          </motion.div>

          <motion.div style={{ y, opacity }} className="relative">
            <div className="overflow-hidden rounded-[28px] bg-white p-3 shadow-card-lg">
              <Image
                src={aboutHeroImage}
                alt="Photographer capturing a special moment"
                className="aspect-[4/3] w-full rounded-[20px] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
