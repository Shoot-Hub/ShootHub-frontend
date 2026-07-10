import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type SectionProps = HTMLAttributes<HTMLElement> & {
  as?: 'section' | 'div';
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

const paddingClasses = {
  none: '',
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
};

export function Section({
  as: Component = 'section',
  padding = 'md',
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Component className={cn(paddingClasses[padding], className)} {...props}>
      {children}
    </Component>
  );
}
