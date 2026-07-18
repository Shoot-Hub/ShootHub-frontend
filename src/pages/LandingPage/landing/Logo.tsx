import { cn } from '@/lib/utils';
import shoothubLogo from '@/assets/landing/shoothub-logo-mark.png';

type LogoProps = {
  className?: string;
  /** Kept for API compatibility; the brand image already includes wordmark. */
  showText?: boolean;
};

/** Tight-cropped ShootHub wordmark (transparent). */
export function Logo({ className }: LogoProps) {
  return (
    <img
      src={shoothubLogo}
      alt="ShootHub"
      className={cn('h-10 w-auto object-contain object-left sm:h-12', className)}
    />
  );
}
