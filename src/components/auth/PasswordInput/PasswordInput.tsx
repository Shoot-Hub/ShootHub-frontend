import { forwardRef, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPasswordStrength } from '@/lib/password';
import { Input, type InputProps } from '@/components/ui/Input';

export type PasswordInputProps = Omit<InputProps, 'type' | 'leftIcon' | 'rightElement'> & {
  showStrength?: boolean;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ showStrength = false, value, onChange, ...props }, ref) {
    const [visible, setVisible] = useState(false);
    const passwordValue = typeof value === 'string' ? value : '';
    const strength = getPasswordStrength(passwordValue);

    return (
      <div className="flex w-full min-w-0 flex-col gap-2">
        <Input
          ref={ref}
          type={visible ? 'text' : 'password'}
          leftIcon={<Lock className="h-[18px] w-[18px]" strokeWidth={2} />}
          rightElement={
            <button
              type="button"
              onClick={() => setVisible((prev) => !prev)}
              className="rounded-lg p-1.5 text-ink-light transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-primary/30"
              aria-label={visible ? 'Hide password' : 'Show password'}
            >
              {visible ? (
                <EyeOff className="h-[18px] w-[18px]" strokeWidth={2} />
              ) : (
                <Eye className="h-[18px] w-[18px]" strokeWidth={2} />
              )}
            </button>
          }
          value={value}
          onChange={onChange}
          {...props}
        />

        {showStrength && passwordValue && (
          <div className="space-y-1.5" aria-live="polite">
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  strength.color,
                  strength.width,
                )}
              />
            </div>
            <p className="text-xs text-ink-muted">
              Password strength:{' '}
              <span className="font-semibold text-ink">{strength.label}</span>
            </p>
          </div>
        )}
      </div>
    );
  },
);
