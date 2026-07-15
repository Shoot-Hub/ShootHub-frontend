import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { fadeInUp, staggerContainer, scaleIn } from '@/lib/motion';
import { stats } from './data';

export function AboutStats() {
  return (
    <Section padding="md" className="bg-[#fbfaff]">
      <Container size="wide" padding="tight">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={scaleIn}
              className="rounded-[20px] border border-border/40 bg-white/80 px-4 py-6 text-center shadow-card backdrop-blur-md"
            >
              <motion.p
                variants={fadeInUp}
                className="text-2xl font-extrabold text-primary-500 sm:text-3xl md:text-4xl"
              >
                {stat.value}
              </motion.p>
              <p className="mt-1 text-sm font-semibold text-ink-muted">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
