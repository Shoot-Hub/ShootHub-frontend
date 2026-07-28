import { ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

type LanguageSelectorProps = {
  className?: string;
  label?: string;
};

export function LanguageSelector({ className, label = 'English' }: LanguageSelectorProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5',
        'text-xs font-medium text-ink-muted transition-colors hover:border-auth-primary/30 hover:text-ink',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-primary/25',
        className,
      )}
      aria-label="Select language"
    >
      <Globe className="h-3.5 w-3.5" strokeWidth={2} />
      <span>{label}</span>
      <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
    </button>
  );
}
