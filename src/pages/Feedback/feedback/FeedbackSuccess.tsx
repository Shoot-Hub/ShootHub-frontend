import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, X } from 'lucide-react';

type Props = {
  submitted: boolean;
  onClose: () => void;
};

export function FeedbackSuccess({ submitted, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative rounded-[24px] border border-[#EEF0F4] bg-white p-8 text-center shadow-[0_8px_40px_-12px_rgba(108,59,255,0.15)]"
    >
      <button type="button" onClick={onClose} className="absolute right-4 top-4 text-[#A0A4B0]">
        <X className="h-4 w-4" />
      </button>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F9EF]">
        <CheckCircle2 className="h-9 w-9 text-[#28C76F]" />
      </div>
      <h3 className="mt-4 text-xl font-bold text-[#111827]">Thank You!</h3>
      <p className="mt-2 text-sm text-[#636E72]">
        {submitted
          ? 'Your feedback has been submitted successfully. We really appreciate your time and valuable feedback.'
          : 'Share your feedback to help us improve ShootHub for creators and clients.'}
      </p>
      <Link
        to="/"
        onClick={onClose}
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#6C3BFF] py-3 text-sm font-semibold text-white shadow-[0_4px_16px_-2px_rgba(108,59,255,0.45)] transition hover:bg-[#5A2FE0]"
      >
        Back to Home
      </Link>
    </motion.div>
  );
}
