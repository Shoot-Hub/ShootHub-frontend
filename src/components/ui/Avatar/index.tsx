import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Image } from '@/components/ui/Image';

export type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  src: string;
  alt: string;
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
};

const sizeClasses = {
  xxs: 'h-6 w-6',
  xs: 'h-7 w-7',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

export function Avatar({ src, alt, size = 'md', className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-full ring-2 ring-white',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      <Image src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}

export type AvatarGroupProps = HTMLAttributes<HTMLDivElement> & {
  avatars: { src: string; alt: string }[];
  size?: AvatarProps['size'];
  max?: number;
};

export function AvatarGroup({
  avatars,
  size = 'sm',
  max = 4,
  className,
  ...props
}: AvatarGroupProps) {
  const visible = avatars.slice(0, max);

  return (
    <div className={cn('flex items-center', className)} {...props}>
      {visible.map((avatar, index) => (
        <Avatar
          key={avatar.src}
          src={avatar.src}
          alt={avatar.alt}
          size={size}
          className={cn(index > 0 && (size === 'xxs' ? '-ml-1.5' : '-ml-2.5'))}
          style={{ zIndex: visible.length - index }}
        />
      ))}
    </div>
  );
}
