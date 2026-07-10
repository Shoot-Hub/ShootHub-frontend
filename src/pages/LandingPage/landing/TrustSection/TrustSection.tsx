import { motion } from 'framer-motion';
import { Headphones, Lock, ShieldCheck, CircleCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { fadeInUp, staggerContainer } from '@/lib/motion';

const trustItems = [
  { icon: ShieldCheck, label: 'Verified Creators' },
  { icon: Headphones, label: '24/7 Support' },
  { icon: Lock, label: 'Secure Payments' },
  { icon: CircleCheck, label: 'Easy Cancellation' },
] as const;

export function TrustSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="border-t border-border/40 bg-gray-50/80 py-6 md:py-7"
      aria-label="Trust indicators"
    >
      <Container size="wide" padding="tight">
        <div className="flex flex-wrap items-center justify-between gap-6 md:gap-4">
          {trustItems.map((item) => (
            <motion.div
              key={item.label}
              variants={fadeInUp}
              className="flex min-w-[140px] flex-1 items-center justify-center gap-3 md:justify-start"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-200 bg-white">
                <item.icon className="h-[18px] w-[18px] text-primary-500" strokeWidth={2} />
              </div>
              <span className="text-sm font-semibold text-ink-muted">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.section>
  );
}
