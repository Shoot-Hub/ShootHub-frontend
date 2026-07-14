import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { InputProps } from './Input.types';

export type { InputProps } from './Input.types';
export type { InputStyleKey } from './Input.styles';
export { inputStyles } from './Input.styles';

export interface ExtendedInputProps extends InputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, ExtendedInputProps>(
  ({ className, type = 'text', label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full text-left">
        {label && (
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            ref={ref}
            className={cn(
              "flex h-[46px] w-full rounded-xl border border-border bg-white px-4 py-2.5 text-[15px] text-ink outline-none transition-all duration-200 placeholder:text-ink-light",
              "focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10",
              "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="mt-1.5 text-xs font-semibold text-red-500">
            {error}
          </p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-ink-muted">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

