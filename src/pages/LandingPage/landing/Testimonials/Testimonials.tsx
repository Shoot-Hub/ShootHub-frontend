import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { StarRating } from '../StarRating';
import { fadeInUp, staggerContainer } from '@/lib/motion';

import avatar1 from '@/assets/landing/avatar-1.jpg';
import avatar2 from '@/assets/landing/avatar-2.jpg';
import avatar3 from '@/assets/landing/avatar-3.jpg';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Wedding Client',
    avatar: avatar1,
    quote: 'Found our wedding photographer in under an hour. The booking process was seamless and stress-free.',
    rating: 5,
  },
  {
    name: 'Rahul Mehta',
    role: 'Brand Manager',
    avatar: avatar2,
    quote: 'ShootHub helped us hire a videographer for our product launch. Professional quality, great communication.',
    rating: 5,
  },
  {
    name: 'Ananya Patel',
    role: 'Event Organizer',
    avatar: avatar3,
    quote: 'The verified creator badges gave us confidence. We booked a studio for our corporate event with ease.',
    rating: 4.8,
  },
] as const;

export function Testimonials() {
  return (
    <Section id="testimonials" padding="lg">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.p variants={fadeInUp} className="text-sm font-semibold uppercase tracking-wider text-primary-500">
            Testimonials
          </motion.p>
          <motion.h2 variants={fadeInUp} className="mt-3 text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
            Loved by thousands of clients
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {testimonials.map((item) => (
            <motion.blockquote
              key={item.name}
              variants={fadeInUp}
              className="rounded-2xl bg-white p-6 shadow-card"
            >
              <StarRating rating={item.rating} size="sm" />
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">&ldquo;{item.quote}&rdquo;</p>
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
