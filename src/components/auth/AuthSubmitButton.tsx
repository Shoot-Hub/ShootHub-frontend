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
        aria-busy={loading}
        className={cn(
          'relative flex h-12 w-full items-center justify-center rounded-xl bg-auth-primary px-5 text-[15px] font-semibold text-white',
          'shadow-auth-button transition-colors hover:bg-auth-accent',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-primary/40 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
      >
        <span>{loading && loadingText ? loadingText : children}</span>
        <span className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm">
          <ArrowRight className="h-4 w-4 text-auth-primary" strokeWidth={2.5} />
        </span>
      </button>
    </motion.div>
  );
}
