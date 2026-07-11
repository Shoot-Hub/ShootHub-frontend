import { motion } from 'framer-motion';
import {
  BarChart3,
  Lock,
  MessageSquare,
  ShieldCheck,
  Star,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { FeatureCard } from './FeatureCard';

const features = [
  {
    title: 'Secure Gallery',
    description:
      'Client galleries protected with expiring links, watermarks and download controls — your work, your terms.',
    icon: Lock,
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-500',
  },
  {
    title: 'Verified Creators',
    description:
      'Every profile is manually reviewed for identity, portfolio quality and past client outcomes before going live.',
    icon: ShieldCheck,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
  },
  {
    title: 'Fast Delivery',
    description:
      'Bulk upload, auto-compress and one-click share — galleries that used to take days now go out in minutes.',
    icon: Zap,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  {
    title: 'AI Ready',
    description:
      'Smart culling, auto-tagging and reply suggestions handle the busywork so you can focus on shooting.',
    icon: BarChart3,
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-500',
  },
  {
    title: 'Business Dashboard',
    description:
      'Track bookings, revenue and client satisfaction in one clean view — no spreadsheets required.',
    icon: TrendingUp,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-500',
  },
  {
    title: 'Built-in Chat',
    description:
      'Discuss shot lists, share references and confirm details with clients — no switching between apps.',
    icon: MessageSquare,
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-500',
  },
] as const;

export function Features() {
  return (
    <Section id="features" padding="lg" className="bg-[#f9f9fb]">
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
              Why Photographers Love Us
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="mt-4 text-[44px] font-extrabold leading-tight tracking-tight text-ink sm:text-[52px] md:text-[58px]"
          >
            Why <span className="text-primary-500">ShootHub</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-muted md:text-base"
          >
            Everything a creative business needs to book, deliver and grow — under one roof.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={fadeInUp}>
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-10 flex items-center justify-center gap-1.5 text-sm text-ink-muted"
        >
          <ShieldCheck className="h-4 w-4 text-primary-500" strokeWidth={2} />
          Trusted by{' '}
          <span className="font-bold text-primary-500">12,000+</span> creators across India
        </motion.p>
      </Container>
    </Section>
  );
}
