import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  pill?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-500 text-white shadow-button hover:bg-primary-600 active:bg-primary-700',
  secondary:
    'bg-white text-ink border border-border hover:border-primary-200 hover:bg-gray-50 active:bg-gray-100',
  ghost: 'bg-transparent text-ink-muted hover:text-ink hover:bg-transparent',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-10 px-5 text-sm gap-2 rounded-full',
  md: 'h-11 px-6 text-sm gap-2 rounded-xl',
  lg: 'h-[52px] px-8 text-[15px] gap-2.5 rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  pill = false,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        pill && 'rounded-full',
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
