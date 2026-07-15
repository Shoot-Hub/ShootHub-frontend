import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Camera } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { fadeInUp, staggerContainer } from '@/lib/motion';

type CTASectionProps = {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
};

export function CTASection({
  title = 'Join ShootHub Today',
  subtitle = 'Whether you book shoots or deliver them — ShootHub is built for you.',
  primaryLabel = 'Become a Creator',
  primaryTo = '/signup',
  secondaryLabel = 'Book Photographer',
  secondaryTo = '/categories',
}: CTASectionProps) {
  return (
    <Section padding="lg" className="bg-white">
      <Container size="wide" padding="tight">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative overflow-hidden rounded-[24px] border border-primary-100 bg-gradient-to-br from-primary-50 via-white to-primary-50 px-8 py-14 text-center shadow-card-lg sm:px-12 md:py-16"
        >
          <div
            className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary-100/60 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-20 -right-12 h-56 w-56 rounded-full bg-purple-100/50 blur-3xl"
            aria-hidden="true"
          />

          <motion.div variants={fadeInUp} className="relative flex justify-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500 shadow-button">
              <Camera className="h-6 w-6 text-white" strokeWidth={2} />
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="relative mt-6 text-[32px] font-extrabold tracking-tight text-ink sm:text-[40px] md:text-[48px]"
          >
            {title}
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="relative mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-ink-muted"
          >
            {subtitle}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="relative mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to={primaryTo}>
              <Button size="lg" pill rightIcon={<ArrowRight className="h-4 w-4" strokeWidth={2.5} />}>
                {primaryLabel}
              </Button>
            </Link>
            <Link to={secondaryTo}>
              <Button size="lg" variant="secondary" pill>
                {secondaryLabel}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
