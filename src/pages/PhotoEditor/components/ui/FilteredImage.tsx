import { useLayoutEffect, useRef, type ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  cssFilter?: string;
  vignette?: number;
  showVignette?: boolean;
};

/** Applies dynamic filter/vignette via CSS variables — no decorative inline styles in parents. */
export function FilteredImage({
  cssFilter = 'none',
  vignette = 0,
  showVignette = true,
  className,
  ...rest
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.setProperty('--pe-img-filter', cssFilter || 'none');
    el.style.setProperty('--pe-vignette', String(Math.min(Math.max(vignette, 0), 0.85)));
  }, [cssFilter, vignette]);

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <img className="pe-filtered-img max-h-full max-w-full" {...rest} />
      {showVignette && vignette > 0 ? <div className="pe-vignette-overlay" /> : null}
    </div>
  );
}
