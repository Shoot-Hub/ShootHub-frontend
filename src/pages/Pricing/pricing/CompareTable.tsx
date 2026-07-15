import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/marketing';
import { fadeInUp } from '@/lib/motion';
import { cn } from '@/lib/utils';
import {
  featureLabels,
  plans,
  type PlanFeatureKey,
} from './data';

const keys = Object.keys(featureLabels) as PlanFeatureKey[];

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="mx-auto h-4 w-4 text-primary-500" strokeWidth={2.5} />
    ) : (
      <X className="mx-auto h-4 w-4 text-ink-light" strokeWidth={2} />
    );
  }
  return <span className="text-sm font-semibold text-ink">{value}</span>;
}

export function CompareTable() {
  return (
    <Section padding="lg" className="bg-[#f9f9fb]">
      <Container size="wide" padding="tight">
        <SectionHeader
          eyebrow="Compare"
          title={
            <>
              Compare <span className="text-primary-500">Plans</span>
            </>
          }
          subtitle="See every feature side by side and pick what fits your workflow."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-10 overflow-x-auto rounded-[24px] border border-border/50 bg-white shadow-card"
        >
          <table className="min-w-[720px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border/60 bg-primary-50/50">
                <th className="px-5 py-4 text-sm font-extrabold text-ink">Feature</th>
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    className={cn(
                      'px-4 py-4 text-center text-sm font-extrabold text-ink',
                      plan.highlighted && 'bg-primary-50 text-primary-600',
                    )}
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keys.map((key, rowIndex) => (
                <tr
                  key={key}
                  className={cn(
                    'border-b border-border/40',
                    rowIndex % 2 === 1 && 'bg-gray-50/40',
                  )}
                >
                  <td className="px-5 py-3.5 text-sm font-medium text-ink-muted">
                    {featureLabels[key]}
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={`${plan.id}-${key}`}
                      className={cn(
                        'px-4 py-3.5 text-center',
                        plan.highlighted && 'bg-primary-50/40',
                      )}
                    >
                      <CellValue value={plan.features[key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </Container>
    </Section>
  );
}
