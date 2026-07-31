import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export function ImageSkeleton({ className }: Props) {
  return (
    <div className={cn('pe-skeleton relative overflow-hidden rounded-[var(--pe-radius)]', className)} />
  );
}
