import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/utils';
import { fadeInUp, staggerContainer } from '@/lib/motion';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: '/month',
    description: 'Perfect for exploring creators',
    features: ['Browse all creators', 'Basic search filters', 'Save favorites', 'Email support'],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '₹999',
    period: '/month',
    description: 'For frequent bookers',
    features: [
      'Priority booking',
      'Advanced filters',
      'Direct chat with creators',
      '24/7 priority support',
      'Exclusive deals',
    ],
    highlighted: true,
  },
  {
    name: 'Business',
    price: '₹2,499',
    period: '/month',
    description: 'For agencies & teams',
    features: [
      'Everything in Pro',
      'Team accounts',
      'Bulk bookings',
      'Dedicated account manager',
      'Custom contracts',
    ],
    highlighted: false,
  },
] as const;

export function Pricing() {
  return (
    <Section id="pricing" padding="lg" className="bg-gray-50/50">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.p variants={fadeInUp} className="text-sm font-semibold uppercase tracking-wider text-primary-500">
            Pricing
          </motion.p>
          <motion.h2 variants={fadeInUp} className="mt-3 text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
            Simple, transparent pricing
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mt-12 grid gap-6 lg:grid-cols-3"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeInUp}
              className={cn(
                'relative rounded-2xl bg-white p-8 shadow-card',
                plan.highlighted && 'ring-2 ring-primary-500 shadow-card-lg',
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-500 px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-bold text-ink">{plan.name}</h3>
              <p className="mt-1 text-sm text-ink-muted">{plan.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-ink">{plan.price}</span>
                <span className="text-sm text-ink-muted">{plan.period}</span>
              </div>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-ink-muted">
                    <Check className="h-4 w-4 shrink-0 text-primary-500" strokeWidth={2.5} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  fullWidth
                  className="mt-8"
                >
                  Get Started
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-10 flex justify-center"
        >
          <Link to="/pricing">
            <Button
              variant="secondary"
              size="lg"
              pill
              className="border-primary-200 bg-white px-8 text-primary-600 hover:border-primary-300 hover:bg-primary-50"
              rightIcon={<ArrowRight className="h-4 w-4 text-primary-500" strokeWidth={2.5} />}
            >
              View Full Pricing
            </Button>
          </Link>
        </motion.div>
      </Container>
    </Section>
  );
}
