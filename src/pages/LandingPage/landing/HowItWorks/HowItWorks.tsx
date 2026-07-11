import { motion } from 'framer-motion';
import { Calendar, Camera, CloudDownload, Rocket, Search } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { StepCard } from './StepCard';

const steps = [
  {
    step: '01',
    title: 'Search',
    description: 'Filter by city, category, budget and date to shortlist the right creators.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Book',
    description: 'Send a request, agree on details in chat, and confirm with secure payment.',
    icon: Calendar,
  },
  {
    step: '03',
    title: 'Shoot',
    description: 'Your creator arrives on time and captures the moments while you focus on what matters.',
    icon: Camera,
  },
  {
    step: '04',
    title: 'Receive Gallery',
    description: 'Get your edited, downloadable gallery delivered straight to your account.',
    icon: CloudDownload,
  },
] as const;

export function HowItWorks() {
  return (
    <Section id="how-it-works" padding="lg" className="bg-[#f9f9fb]">
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
              <Rocket className="h-3.5 w-3.5 text-primary-500" strokeWidth={2.5} />
              Simple & Easy Process
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="mt-4 text-[44px] font-extrabold leading-tight tracking-tight text-ink sm:text-[52px] md:text-[58px]"
          >
            How It <span className="text-primary-500">Works</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-2 max-w-xl text-[15px] leading-relaxed text-ink-muted md:text-base"
          >
            From discovery to delivery in four simple steps.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="relative mt-12"
        >
          <div
            className="absolute left-[12%] right-[12%] top-6 hidden border-t-2 border-dashed border-primary-200 lg:block"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((step) => (
              <motion.div key={step.step} variants={fadeInUp}>
                <StepCard {...step} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
