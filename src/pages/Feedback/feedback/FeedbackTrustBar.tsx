import { motion } from 'framer-motion';
import { Gift, MessageSquareHeart, ShieldCheck, Zap } from 'lucide-react';
import { communityAvatars, trustItems } from './data';

export function FeedbackTrustBar() {
  const icons = [MessageSquareHeart, ShieldCheck, Zap, Gift];

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-[#EEF0F4] bg-white px-5 py-4"
      >
        <p className="text-xl font-bold text-[#111827]">Thank you to our amazing community!</p>
        <p className="mt-1 text-xs text-[#636E72]">Here&apos;s what our users are saying about ShootHub.</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex -space-x-2">
            {communityAvatars.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm"
              />
            ))}
          </div>
          <span className="text-xs text-[#636E72]">Join 10,000+ happy users</span>
        </div>
      </motion.div>

      <div className="grid gap-3 rounded-2xl border border-[#EEF0F4] bg-gradient-to-r from-[#F8F4FF] to-[#EFF7FF] p-4 sm:grid-cols-2 xl:grid-cols-4">
        {trustItems.map((item, i) => {
          const Icon = icons[i];
          return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-white/85 px-4 py-4"
          >
            <Icon className="h-4 w-4 text-[#6C3BFF]" />
            <p className="mt-2 text-sm font-bold text-[#111827]">{item.title}</p>
            <p className="mt-1 text-xs text-[#636E72]">{item.desc}</p>
          </motion.div>
          );
        })}
      </div>
    </div>
  );
}
