import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { PlanCard } from './PlanCard';
import { plans, type BillingPeriod } from './data';

type PricingCardsProps = {
  period: BillingPeriod;
};

export function PricingCards({ period }: PricingCardsProps) {
  return (
    <Section padding="lg" className="pt-8 md:pt-10">
      <Container size="wide" padding="tight">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerContainer}
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5"
        >
          {plans.map((plan) => (
            <motion.div key={plan.id} variants={fadeInUp} className="h-full">
              <PlanCard plan={plan} period={period} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
