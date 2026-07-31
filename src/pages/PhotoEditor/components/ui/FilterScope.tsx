import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  cssFilter?: string;
  vignette?: number;
  className?: string;
  children: ReactNode;
};

/** Sets filter/vignette CSS variables on a wrapper for child images. */
export function FilterScope({
  cssFilter = 'none',
  vignette = 0,
  className,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--pe-img-filter', cssFilter || 'none');
    el.style.setProperty('--pe-vignette', String(Math.min(Math.max(vignette, 0), 0.85)));
  }, [cssFilter, vignette]);

  return (
    <div ref={ref} className={cn('relative h-full w-full', className)}>
      {children}
      {vignette > 0 ? <div className="pe-vignette-overlay" /> : null}
    </div>
  );
}
