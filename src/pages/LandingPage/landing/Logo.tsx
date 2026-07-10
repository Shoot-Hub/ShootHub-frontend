import { Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  showText?: boolean;
};

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 shadow-button">
        <Camera className="h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
      {showText && (
        <span className="text-[22px] font-bold tracking-tight text-ink">ShootHub</span>
      )}
    </div>
  );
}
