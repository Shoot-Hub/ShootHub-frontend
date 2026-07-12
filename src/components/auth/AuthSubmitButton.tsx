import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type AuthSubmitButtonProps = {
  children: ReactNode;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
};

export function AuthSubmitButton({
  children,
  loading = false,
  loadingText,
  disabled,
  className,
}: AuthSubmitButtonProps) {
  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <button
        type="submit"
        disabled={disabled || loading}
        className={cn(
          'flex h-12 w-full items-center justify-between rounded-xl bg-auth-accent px-5 text-[15px] font-semibold text-white',
          'shadow-[0_4px_16px_-2px_rgba(79,70,229,0.45)] transition-colors hover:bg-indigo-700',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent/40 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
      >
        <span>{loading && loadingText ? loadingText : children}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </span>
      </button>
    </motion.div>
  );
}
