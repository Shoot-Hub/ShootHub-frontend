import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { SocialProvider } from '@/constants/auth';

type SocialButtonProps = {
  provider: SocialProvider;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
};

export function SocialButton({ label, icon, onClick }: SocialButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        'flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-white',
        'text-sm font-semibold text-ink transition-colors duration-200',
        'hover:border-auth-primary/30 hover:bg-gray-50 hover:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-primary/30',
      )}
    >
      {icon}
      {label}
    </motion.button>
  );
}
