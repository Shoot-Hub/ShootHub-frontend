import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Checkbox, type CheckboxProps } from '@/components/ui/Checkbox';

type TermsCheckboxProps = Omit<CheckboxProps, 'label' | 'type'>;

export const TermsCheckbox = forwardRef<HTMLInputElement, TermsCheckboxProps>(
  function TermsCheckbox({ error, ...props }, ref) {
    return (
      <Checkbox
        ref={ref}
        error={error}
        label={
          <>
            I agree to the{' '}
            <Link to="/terms" className="font-semibold text-auth-accent hover:text-indigo-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-semibold text-auth-accent hover:text-indigo-700">
              Privacy Policy
            </Link>
          </>
        }
        {...props}
      />
    );
  },
);
