import { motion } from 'framer-motion';
import { MessageSquareHeart } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { fadeInUp } from '@/lib/motion';

export function FeedbackHero() {
  return (
    <section className="relative overflow-hidden pb-6 pt-8 md:pb-8 md:pt-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[10%] top-0 h-48 w-48 rounded-full bg-[#F3EEFF] blur-3xl" />
        <div className="absolute right-[8%] top-8 h-40 w-40 rounded-full bg-[#E8F4FD] blur-3xl" />
      </div>

      <Container size="wide" padding="tight">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F3EEFF] px-4 py-1.5 text-xs font-semibold text-[#6C3BFF]">
            <MessageSquareHeart className="h-3.5 w-3.5" />
            We&apos;d love to hear from you
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl md:text-[42px]">
            Feedback &amp; Reviews
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[#636E72] sm:text-base">
            We value your feedback! Help us improve and serve you better.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
