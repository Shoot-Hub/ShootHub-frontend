import { cn } from '@/lib/utils';

type AuthBrandMarkProps = {
  className?: string;
  /** `dark` = white wordmark for photo banners; `light` = dark wordmark for light panels */
  tone?: 'dark' | 'light';
  showTagline?: boolean;
};

export function AuthBrandMark({
  className,
  tone = 'dark',
  showTagline = true,
}: AuthBrandMarkProps) {
  const isDark = tone === 'dark';

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#8b5cf6] via-[#7c3aed] to-[#4f46e5] shadow-[0_8px_20px_-6px_rgba(124,58,237,0.65)]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none">
          <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="5.1" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="12" cy="12" r="2.1" fill="currentColor" />
          <path
            d="M12 3.75v2.1M12 18.15v2.1M3.75 12h2.1M18.15 12h2.1"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </span>

      <div className="min-w-0 leading-none">
        <p
          className={cn(
            'text-[1.35rem] font-bold tracking-tight',
            isDark ? 'text-white' : 'text-ink',
          )}
        >
          ShootHub
        </p>
        {showTagline && (
          <p
            className={cn(
              'mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em]',
              isDark ? 'text-white/70' : 'text-ink-muted',
            )}
          >
            Capture · Connect · Deliver.
          </p>
        )}
      </div>
    </div>
  );
}
