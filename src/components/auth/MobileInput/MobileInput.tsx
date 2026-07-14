import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { COUNTRY_CODES } from '@/constants/auth';

type MobileInputProps = {
  label?: string;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  name?: string;
};

export const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(function MobileInput(
  { label = 'Mobile number', countryCode, onCountryCodeChange, value, onChange, error, name },
  ref,
) {
  const inputId = name ?? 'mobile';
  const selectedCountry = COUNTRY_CODES.find((item) => item.code === countryCode) ?? COUNTRY_CODES[0];

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink">
        {label}
      </label>
      <div
        className={cn(
          'flex h-12 overflow-hidden rounded-xl border border-border bg-white transition-all duration-200',
          'focus-within:border-auth-primary focus-within:ring-2 focus-within:ring-auth-primary/15',
          error && 'border-red-400 focus-within:border-red-400 focus-within:ring-red-400/15',
        )}
      >
        <div className="relative w-[108px] shrink-0">
          <select
            value={countryCode}
            onChange={(event) => onCountryCodeChange(event.target.value)}
            aria-label="Country code"
            className="h-12 w-full appearance-none bg-transparent py-0 pl-3 pr-7 text-sm font-medium text-ink focus:outline-none"
          >
            {COUNTRY_CODES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.flag} {item.code}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ink-light">
            ▾
          </span>
        </div>

        <div className="w-px shrink-0 bg-border" />

        <input
          ref={ref}
          id={inputId}
          name={name}
          type="tel"
          inputMode="numeric"
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder="Enter your mobile number"
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-ink placeholder:text-ink-light focus:outline-none"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
      </div>
      <span className="sr-only">
        Selected country: {selectedCountry.label}
      </span>
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
