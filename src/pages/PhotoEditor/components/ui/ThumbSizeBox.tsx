import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  size: number;
  className?: string;
  children?: ReactNode;
};

export function ThumbSizeBox({ size, className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--pe-thumb-size', `${size}px`);
  }, [size]);

  return (
    <div ref={ref} className={cn('pe-thumb-box', className)}>
      {children}
    </div>
  );
}
