import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/marketing';
import { fadeInUp, staggerContainer, cardHover } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { roadmap, values } from './data';

export function RoadmapSection() {
  return (
    <Section padding="lg" className="bg-white">
      <Container size="wide" padding="tight">
        <SectionHeader
          eyebrow="Roadmap"
          title={
            <>
              What&apos;s <span className="text-primary-500">Next</span>
            </>
          }
          subtitle="A peek at features on our timeline."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {roadmap.map((item) => (
            <motion.article
              key={item.title}
              variants={fadeInUp}
              whileHover={cardHover}
              className="rounded-[20px] border border-border/50 bg-white p-5 shadow-card"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-primary-500">
                {item.quarter}
              </p>
              <h3 className="mt-2 text-base font-extrabold text-ink">{item.title}</h3>
              <span className="mt-3 inline-block rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-bold text-primary-600">
                {item.status}
              </span>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}

export function ValuesSection() {
  return (
    <Section padding="lg" className="bg-[#fbfaff]">
      <Container size="wide" padding="tight">
        <SectionHeader
          eyebrow="Culture"
          title={
            <>
              Our <span className="text-primary-500">Values</span>
            </>
          }
          subtitle="The principles that guide every product decision."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <motion.article
                key={value.title}
                variants={fadeInUp}
                whileHover={cardHover}
                className={cn(
                  'rounded-[24px] border border-border/50 bg-white/80 p-5 text-center shadow-card backdrop-blur-md',
                )}
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <Icon className="h-5 w-5 text-primary-500" strokeWidth={2} />
                </div>
                <h3 className="mt-4 text-base font-extrabold text-ink">{value.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{value.description}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
}
