import { cn } from '@/lib/utils';

type ShootHubLoaderProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  className?: string;
  /** Full-screen centered overlay */
  fullScreen?: boolean;
};

const sizeMap = {
  sm: { wrap: 'h-10 w-10', icon: 'h-6 w-6', ring: 'h-10 w-10', glow: 'h-12 w-12' },
  md: { wrap: 'h-14 w-14', icon: 'h-8 w-8', ring: 'h-14 w-14', glow: 'h-16 w-16' },
  lg: { wrap: 'h-[4.5rem] w-[4.5rem]', icon: 'h-11 w-11', ring: 'h-[4.5rem] w-[4.5rem]', glow: 'h-20 w-20' },
  xl: { wrap: 'h-24 w-24', icon: 'h-14 w-14', ring: 'h-24 w-24', glow: 'h-28 w-28' },
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
      <div className={cn('relative flex items-center justify-center', s.wrap)}>
        {/* Soft glow pulse */}
        <div
          className={cn(
            'absolute rounded-full bg-[#6B46FE]/30 blur-xl animate-shoothub-pulse',
            s.glow,
          )}
        />

        {/* Outer dashed orbit (slow reverse) */}
        <div
          className={cn(
            'absolute rounded-full border-2 border-dashed border-[#6B46FE]/40 animate-shoothub-spin-slow',
            s.ring,
          )}
        />

        {/* Accent arc */}
        <div
          className={cn(
            'absolute rounded-full border-[2.5px] border-transparent border-t-[#8A60FF] border-r-[#47bfff]/55 animate-shoothub-spin',
            s.ring,
          )}
        />

        {/* Spinning ShootHub brand icon */}
        <div
          className={cn(
            'relative z-10 animate-shoothub-spin drop-shadow-[0_8px_24px_rgba(107,70,254,0.45)]',
            s.icon,
          )}
        >
          <img
            src="/favicon.svg"
            alt=""
            draggable={false}
            className="h-full w-full select-none object-contain"
            style={{ height: '100%', maxWidth: 'none' }}
          />
        </div>
      </div>

      {label ? (
        <p className="text-sm font-medium tracking-wide text-[#636E72] animate-pulse">{label}</p>
      ) : null}
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
