import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type AuthFooterBannerProps = {
  className?: string;
};

export function AuthFooterBanner({ className }: AuthFooterBannerProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl bg-auth-primary-soft px-4 py-3 sm:gap-4 sm:px-5',
        className,
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-auth-primary/15 text-auth-primary">
        <ShieldCheck className="h-5 w-5" strokeWidth={2} />
      </span>

      <p className="min-w-0 flex-1 text-[12px] leading-snug text-ink/80 sm:text-[13px]">
        <span className="font-semibold text-ink">Your journey. Our passion.</span>{' '}
        Let&apos;s create something beautiful together.
      </p>

      <span className="hidden shrink-0 text-auth-primary/55 sm:block" aria-hidden="true">
        <svg viewBox="0 0 88 56" className="h-12 w-[88px]" fill="none">
          <path
            d="M8 42c8-10 18-16 28-16s18 4 26 12"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M54 34c2.2-6.5 7.5-10.5 13.5-10.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <circle cx="70" cy="14" r="5" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M42 46v-8.5l4.5-3.5 3 2.5V46"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <circle cx="48.5" cy="31.5" r="3.2" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M46.2 34.8 42 38.5M50.8 34.8 55 38.2"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path d="M55 30.5h7.5l2 3.5H55.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M18 46h52" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}
