import { BadgeCheck } from 'lucide-react';

interface VerifiedBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function VerifiedBadge({ className = '', size = 'sm' }: VerifiedBadgeProps) {
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-[#6B46FE]/10 px-2 py-0.5 font-bold text-[#6B46FE] ${textSize} ${className}`}
    >
      <BadgeCheck className={iconSize} />
      Verified
    </span>
  );
}
