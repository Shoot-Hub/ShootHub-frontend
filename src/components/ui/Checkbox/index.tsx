import { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: React.ReactNode;
  error?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, error, className, id, ...props },
  ref,
) {
  const checkboxId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={checkboxId}
        className={cn('group inline-flex cursor-pointer items-start gap-3', className)}
      >
        <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className="sr-only"
            aria-invalid={!!error}
            {...props}
          />
          <span
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-md border border-border bg-white',
              'transition-all duration-200 group-has-[:checked]:border-auth-accent group-has-[:checked]:bg-auth-accent',
              'group-has-[:focus-visible]:ring-2 group-has-[:focus-visible]:ring-auth-accent/30',
              error && 'border-red-400',
            )}
            aria-hidden="true"
          >
            <Check className="h-3.5 w-3.5 text-white opacity-0 transition-opacity group-has-[:checked]:opacity-100" />
          </span>
        </span>
        {label && <span className="text-sm leading-relaxed text-ink-muted">{label}</span>}
      </label>
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
