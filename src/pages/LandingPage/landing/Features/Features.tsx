import { motion } from 'framer-motion';
import { MessageSquare, Search, Shield, Zap } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { fadeInUp, staggerContainer } from '@/lib/motion';

const features = [
  {
    icon: Search,
    title: 'Discover Creators',
    description: 'Browse verified photographers, videographers, and studios by category, location, and budget.',
  },
  {
    icon: MessageSquare,
    title: 'Chat & Compare',
    description: 'Message creators directly, compare portfolios, and get quotes before you book.',
  },
  {
    icon: Zap,
    title: 'Book in Minutes',
    description: 'Secure your creator in just three simple steps with instant confirmation.',
  },
  {
    icon: Shield,
    title: 'Book with Confidence',
    description: 'Verified profiles, secure payments, and easy cancellation for peace of mind.',
  },
] as const;

export function Features() {
  return (
    <Section id="features" padding="lg" className="bg-gray-50/50">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.p variants={fadeInUp} className="text-sm font-semibold uppercase tracking-wider text-primary-500">
            Why ShootHub
          </motion.p>
          <motion.h2 variants={fadeInUp} className="mt-3 text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
            Everything you need to book creators
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-4 max-w-2xl text-ink-muted">
            From discovery to booking, ShootHub makes it effortless to find and hire the perfect creative professional.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              className="rounded-2xl bg-white p-6 shadow-card transition-shadow hover:shadow-card-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                <feature.icon className="h-6 w-6 text-primary-500" strokeWidth={2} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
