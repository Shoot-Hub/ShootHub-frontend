import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/marketing';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { storyTimeline } from './data';

export function StoryTimeline() {
  return (
    <Section padding="lg" className="bg-white">
      <Container size="wide" padding="tight">
        <SectionHeader
          eyebrow="Timeline"
          title={
            <>
              Our <span className="text-primary-500">Story</span>
            </>
          }
          subtitle="From a frustration with broken workflows to India’s creator marketplace."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="relative mx-auto mt-12 max-w-3xl"
        >
          <div
            className="absolute bottom-0 left-[19px] top-2 w-0.5 bg-gradient-to-b from-primary-200 via-primary-300 to-transparent md:left-1/2 md:-translate-x-px"
            aria-hidden="true"
          />

          <div className="space-y-8">
            {storyTimeline.map((item, index) => (
              <motion.div
                key={item.year}
                variants={fadeInUp}
                className={`relative flex gap-6 md:gap-0 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="hidden w-1/2 md:block" />
                <div className="absolute left-0 top-1 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-xs font-extrabold text-white shadow-button md:left-1/2 md:-translate-x-1/2">
                  {item.year.slice(2)}
                </div>
                <article className="ml-14 flex-1 rounded-[20px] border border-border/50 bg-white p-5 shadow-card md:ml-0 md:w-1/2 md:px-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary-500">
                    {item.year}
                  </p>
                  <h3 className="mt-1 text-lg font-extrabold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
                </article>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
