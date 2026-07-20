import { motion } from 'framer-motion';
import { CheckCircle2, Heart, MessageCircle, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { feedbackBenefits } from './data';

const icons = [Heart, Sparkles, MessageCircle, Zap];

export function FeedbackSidebar({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn('space-y-4', compact && 'space-y-3')}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn(
          'overflow-hidden rounded-[24px] border border-[#EEF0F4] bg-gradient-to-br from-[#F3EEFF] via-white to-[#E8F4FD] p-6 shadow-[0_8px_32px_-8px_rgba(108,59,255,0.12)]',
          compact && 'border-none bg-transparent p-0 shadow-none',
        )}
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4 flex h-28 w-28 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#6C3BFF]/10 blur-xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-lg">
              <span className="text-4xl">💬</span>
            </div>
            <span className="absolute -right-1 top-0 text-2xl">⭐</span>
            <span className="absolute -left-2 bottom-2 text-xl">😊</span>
          </div>
          <p className="text-sm font-medium text-[#636E72]">Your voice shapes ShootHub</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={cn(
          'rounded-[24px] border border-[#EEF0F4] bg-white p-5 shadow-sm',
          compact && 'rounded-none border-none bg-transparent p-0 shadow-none',
        )}
      >
        <h3 className="text-sm font-bold text-[#111827]">Your Feedback Matters</h3>
        <ul className="mt-4 space-y-3">
          {feedbackBenefits.map(({ title, desc }, i) => {
            const Icon = icons[i];
            return (
              <li key={title} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F3EEFF]">
                  <Icon className="h-4 w-4 text-[#6C3BFF]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{title}</p>
                  <p className="text-xs text-[#636E72]">{desc}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-[#EADFFF] bg-[#F7F3FF] p-4"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#6C3BFF]" />
          <h3 className="text-sm font-bold text-[#111827]">What happens next?</h3>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-[#636E72]">
          Our team reviews every submission within 48 hours. If you leave your email,
          we&apos;ll follow up when your feedback is addressed or a fix ships.
        </p>
      </motion.div>
    </div>
  );
}
