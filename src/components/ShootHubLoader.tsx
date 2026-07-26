import { cn } from '@/lib/utils';
import shoothubLogo from '@/assets/landing/shoothub-loader-logo.png';

type ShootHubLoaderProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Optional visible label. Prefer leaving empty for branding-only loaders. */
  label?: string;
  className?: string;
  /** Full-screen centered overlay */
  fullScreen?: boolean;
};

const sizeMap = {
  sm: { wrap: 'h-12 w-12', icon: 'h-7 w-7', ring: 'h-12 w-12', glow: 'h-14 w-14' },
  md: { wrap: 'h-16 w-16', icon: 'h-10 w-10', ring: 'h-16 w-16', glow: 'h-[4.5rem] w-[4.5rem]' },
  lg: { wrap: 'h-20 w-20', icon: 'h-12 w-12', ring: 'h-20 w-20', glow: 'h-24 w-24' },
  xl: { wrap: 'h-28 w-28', icon: 'h-[4.5rem] w-[4.5rem]', ring: 'h-28 w-28', glow: 'h-32 w-32' },
};

export function ShootHubLoader({
  size = 'md',
  label,
  className,
  fullScreen = false,
}: ShootHubLoaderProps) {
  const s = sizeMap[size];

  const content = (
    <div
      className={cn('flex flex-col items-center gap-4', className)}
      role="status"
      aria-live="polite"
      aria-label={label || 'Loading'}
    >
      <div className={cn('relative flex items-center justify-center overflow-visible', s.wrap)}>
        <div
          className={cn(
            'absolute rounded-full bg-[#6B46FE]/25 blur-xl animate-shoothub-pulse',
            s.glow,
          )}
        />

        <div
          className={cn(
            'absolute rounded-full border-2 border-dashed border-[#6B46FE]/35 animate-shoothub-spin-slow',
            s.ring,
          )}
        />

        <div
          className={cn(
            'absolute rounded-full border-[2.5px] border-transparent border-t-[#8A60FF] border-r-[#47bfff]/55 animate-shoothub-spin',
            s.ring,
          )}
        />

        {/* Brand S mark — spins with the loader */}
        <div
          className={cn(
            'relative z-10 flex items-center justify-center overflow-visible animate-shoothub-spin drop-shadow-[0_8px_24px_rgba(107,70,254,0.45)]',
            s.icon,
          )}
        >
          <img
            src={shoothubLogo}
            alt="ShootHub"
            draggable={false}
            className="h-full w-full max-w-none select-none object-contain p-0.5"
          />
        </div>
      </div>

      {label ? (
        <p className="animate-pulse text-sm font-medium tracking-wide text-[#636E72]">{label}</p>
      ) : null}

      {!label ? <span className="sr-only">Loading</span> : null}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F8F9FB]/95 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}
