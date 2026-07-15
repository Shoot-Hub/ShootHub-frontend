import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from './SectionHeader';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

export type FAQItem = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  items: readonly FAQItem[];
  className?: string;
};

function FAQAccordion({ items }: { items: readonly FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={staggerContainer}
      className="mx-auto mt-10 max-w-3xl space-y-3"
    >
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <motion.div
            key={item.question}
            variants={fadeInUp}
            className="overflow-hidden rounded-[20px] border border-border/60 bg-white shadow-card"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span className="text-[15px] font-bold text-ink">{item.question}</span>
              <ChevronDown
                className={cn(
                  'h-5 w-5 shrink-0 text-primary-500 transition-transform duration-300',
                  isOpen && 'rotate-180',
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="border-t border-border/50 px-6 pb-5 pt-4 text-sm leading-relaxed text-ink-muted">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function FAQSection({ items, className }: FAQSectionProps) {
  return (
    <Section padding="lg" className={cn('bg-[#f9f9fb]', className)}>
      <Container size="wide" padding="tight">
        <SectionHeader
          eyebrow="FAQ"
          eyebrowIcon={<HelpCircle className="h-3.5 w-3.5 text-primary-500" strokeWidth={2.5} />}
          title={
            <>
              Frequently Asked <span className="text-primary-500">Questions</span>
            </>
          }
          subtitle="Everything you need to know before you get started."
        />
        <FAQAccordion items={items} />
      </Container>
    </Section>
  );
}
