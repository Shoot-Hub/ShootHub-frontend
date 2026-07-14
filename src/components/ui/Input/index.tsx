import { forwardRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
  containerClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    leftIcon,
    rightElement,
    className,
    containerClassName,
    id,
    ...props
  },
  ref,
) {
  const inputId = id ?? props.name;

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-light">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-ink',
            'placeholder:text-ink-light transition-all duration-200',
            'focus:border-auth-primary focus:outline-none focus:ring-2 focus:ring-auth-primary/15',
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60',
            leftIcon && 'pl-11',
            rightElement && 'pr-12',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400/15',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
