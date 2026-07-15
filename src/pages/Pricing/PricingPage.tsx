import { useState } from 'react';
import {
  CTASection,
  FAQSection,
  PageShell,
  TestimonialGrid,
} from '@/components/marketing';
import { CompareTable } from './pricing/CompareTable';
import { PricingCards } from './pricing/PricingCards';
import { PricingHero } from './pricing/PricingHero';
import { pricingFAQ, type BillingPeriod } from './pricing/data';

export function PricingPage() {
  const [period, setPeriod] = useState<BillingPeriod>('monthly');

  return (
    <PageShell>
      <PricingHero period={period} onPeriodChange={setPeriod} />
      <PricingCards period={period} />
      <CompareTable />
      <TestimonialGrid className="bg-white" />
      <FAQSection items={pricingFAQ} className="bg-[#fbfaff]" />
      <CTASection
        title="Ready to grow your photography business?"
        subtitle="Start free, upgrade when you’re ready. Cancel anytime."
        primaryLabel="Start Free"
        secondaryLabel="Talk to Sales"
      />
    </PageShell>
  );
}
