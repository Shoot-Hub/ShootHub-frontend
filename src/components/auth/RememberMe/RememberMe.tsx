import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Checkbox, type CheckboxProps } from '@/components/ui/Checkbox';
import { AUTH_ROUTES } from '@/constants/auth';

type RememberMeProps = Omit<CheckboxProps, 'label' | 'type'> & {
  showForgotPassword?: boolean;
};

export const RememberMe = forwardRef<HTMLInputElement, RememberMeProps>(function RememberMe(
  { showForgotPassword = true, ...props },
  ref,
) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Checkbox ref={ref} label="Remember me" {...props} />
      {showForgotPassword && (
        <Link
          to={AUTH_ROUTES.FORGOT_PASSWORD}
          className="shrink-0 text-sm font-semibold text-auth-primary transition-colors hover:text-auth-accent"
        >
          Forgot password?
        </Link>
      )}
    </div>
  );
});
