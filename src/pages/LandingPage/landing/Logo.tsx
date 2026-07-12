import { cn } from '@/lib/utils';
import shoothubLogo from '@/assets/landing/shoothublogo.png';

type LogoProps = {
  className?: string;
  /** Kept for API compatibility; the brand image already includes wordmark. */
  showText?: boolean;
};

export function Logo({ className }: LogoProps) {
  return (
    <img
      src={shoothubLogo}
      alt="ShootHub"
      className={cn('h-40 w-auto object-contain sm:h-24', className)}
    />
  );
}
