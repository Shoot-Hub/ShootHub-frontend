import { motion } from 'framer-motion';
import { Target, Eye } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/marketing';
import { fadeInUp, staggerContainer, cardHover } from '@/lib/motion';
import { missionVision } from './data';

const icons = [Target, Eye];

export function MissionVision() {
  return (
    <Section padding="lg" className="bg-[#f9f9fb]">
      <Container size="wide" padding="tight">
        <SectionHeader
          eyebrow="Purpose"
          title={
            <>
              Mission & <span className="text-primary-500">Vision</span>
            </>
          }
          subtitle="Why we exist and where we’re headed."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="mt-10 grid gap-6 md:grid-cols-2"
        >
          {missionVision.map((item, i) => {
            const Icon = icons[i];
            return (
              <motion.article
                key={item.title}
                variants={fadeInUp}
                whileHover={cardHover}
                className="rounded-[24px] border border-border/50 bg-white/80 p-8 shadow-card backdrop-blur-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                  <Icon className="h-6 w-6 text-primary-500" strokeWidth={2} />
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
}
