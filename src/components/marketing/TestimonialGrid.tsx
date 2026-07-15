import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { StarRating } from '@/pages/LandingPage/landing/StarRating';
import { SectionHeader } from './SectionHeader';
import { fadeInUp, staggerContainer, cardHover } from '@/lib/motion';

import avatar1 from '@/assets/landing/avatar-1.jpg';
import avatar2 from '@/assets/landing/avatar-2.jpg';
import avatar3 from '@/assets/landing/avatar-3.jpg';

export const defaultTestimonials = [
  {
    name: 'Priya Sharma',
    role: 'Wedding Client',
    avatar: avatar1,
    quote:
      'Found our wedding photographer in under an hour. The booking process was seamless and stress-free.',
    rating: 5,
  },
  {
    name: 'Rahul Mehta',
    role: 'Brand Manager',
    avatar: avatar2,
    quote:
      'ShootHub helped us hire a videographer for our product launch. Professional quality, great communication.',
    rating: 5,
  },
  {
    name: 'Ananya Patel',
    role: 'Event Organizer',
    avatar: avatar3,
    quote:
      'The verified creator badges gave us confidence. We booked a studio for our corporate event with ease.',
    rating: 4.8,
  },
] as const;

type Testimonial = {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
};

type TestimonialGridProps = {
  items?: readonly Testimonial[];
  className?: string;
};

export function TestimonialGrid({
  items = defaultTestimonials,
  className,
}: TestimonialGridProps) {
  return (
    <Section id="reviews" padding="lg" className={className}>
      <Container size="wide" padding="tight">
        <SectionHeader
          eyebrow="Reviews"
          title={
            <>
              Loved by <span className="text-primary-500">Thousands</span>
            </>
          }
          subtitle="Real stories from clients and creators across India."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {items.map((item) => (
            <motion.blockquote
              key={item.name}
              variants={fadeInUp}
              whileHover={cardHover}
              className="rounded-[24px] border border-border/50 bg-white p-6 shadow-card"
            >
              <StarRating rating={item.rating} size="sm" />
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-6 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  loading="lazy"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                />
                <div>
                  <cite className="not-italic text-sm font-bold text-ink">{item.name}</cite>
                  <p className="text-xs text-ink-muted">{item.role}</p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
