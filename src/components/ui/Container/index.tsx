import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: 'default' | 'wide' | 'full' | 'fluid';
  padding?: 'default' | 'tight' | 'none';
};

const sizeClasses = {
  default: 'max-w-[1280px]',
  wide: 'max-w-[1520px]',
  full: 'max-w-full',
  fluid: 'max-w-[min(100%,1560px)]',
};

const paddingClasses = {
  default: 'px-5 sm:px-6 lg:px-8',
  tight: 'px-4 sm:px-5 lg:px-6',
  none: 'px-0',
};

export function Container({
  size = 'default',
  padding = 'default',
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        sizeClasses[size],
        paddingClasses[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
