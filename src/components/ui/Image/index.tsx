import { useState, type ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackClassName?: string;
};

export function Image({
  className,
  fallbackClassName,
  alt,
  loading = 'lazy',
  onLoad,
  onError,
  ...props
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={cn('bg-primary-50', fallbackClassName, className)}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    <img
      alt={alt}
      loading={loading}
      decoding="async"
      className={cn(
        'transition-opacity duration-300',
        loaded ? 'opacity-100' : 'opacity-0',
        className,
      )}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      onError={(e) => {
        setError(true);
        onError?.(e);
      }}
      {...props}
    />
  );
}
