import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/marketing';
import { fadeInUp, staggerContainer, cardHover } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { coreFeatures } from './data';

export function CoreFeatures() {
  return (
    <Section padding="lg" className="bg-white">
      <Container size="wide" padding="tight">
        <SectionHeader
          eyebrow="Platform"
          title={
            <>
              Core <span className="text-primary-500">Features</span>
            </>
          }
          subtitle="The tools creators and clients rely on every day."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {coreFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                variants={fadeInUp}
                whileHover={cardHover}
                className="rounded-[24px] border border-border/50 bg-white p-6 shadow-card"
              >
                <div
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-xl',
                    feature.iconBg,
                  )}
                >
                  <Icon className={cn('h-5 w-5', feature.iconColor)} strokeWidth={2} />
                </div>
                <h3 className="mt-5 text-lg font-extrabold text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
}
