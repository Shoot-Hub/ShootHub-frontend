import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { MailCheck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { AuthLayout, AuthCard } from '@/components/auth';
import { AUTH_ROUTES } from '@/constants/auth';
import { userService } from '@/services/user';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') ?? 'your email';
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    setResending(true);
    try {
      await userService.forgotPassword(email);
      toast.success('Verification email resent!');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to resend verification email.';
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout variant="signup">
      <AuthCard
        eyebrow="Almost there!"
        title="Verify your email"
        description={`We've sent a verification link to ${email}. Click the link in the email to activate your account.`}
        footer={
          <p className="text-center text-sm text-ink-muted">
            Wrong email?{' '}
            <Link
              to={AUTH_ROUTES.SIGNUP}
              className="font-semibold text-auth-primary transition-colors hover:text-auth-accent"
            >
              Sign up again
            </Link>
          </p>
        }
      >
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-gray-50/80 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-auth-primary/10">
            <MailCheck className="h-8 w-8 text-auth-primary" strokeWidth={1.75} />
          </div>
          <p className="break-all text-sm font-medium text-ink">{email}</p>
          <p className="text-sm leading-relaxed text-ink-muted">
            Didn&apos;t receive the email? Check your spam folder or request a new verification
            link below.
          </p>
          <motion.div whileTap={{ scale: 0.98 }} className="w-full">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              fullWidth
              disabled={resending}
              aria-busy={resending}
              leftIcon={<RefreshCw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />}
              onClick={handleResend}
            >
              {resending ? 'Sending...' : 'Resend verification email'}
            </Button>
          </motion.div>
        </div>

        <Link to={AUTH_ROUTES.LOGIN} className="mt-2 block text-center">
          <Button variant="ghost" fullWidth>
            Continue to login
          </Button>
        </Link>
      </AuthCard>
    </AuthLayout>
  );
}
