import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { AuthLayout, AuthCard, PasswordInput } from '@/components/auth';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/schemas/auth';
import { AUTH_ROUTES } from '@/constants/auth';
import { userService } from '@/services/user';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password');

  const onSubmit = async (_data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }

    try {
      await userService.resetPassword(token, _data.password);
      toast.success('Password updated successfully!');
      navigate(AUTH_ROUTES.LOGIN);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to reset password. Please try again.';
      toast.error(message);
    }
  };

  return (
    <AuthLayout variant="login">
      <AuthCard
        eyebrow="Reset password"
        title="Create a new password"
        description="Choose a strong password you haven't used before on this account."
        footer={
          <Link
            to={AUTH_ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-sm font-semibold text-auth-primary transition-colors hover:text-auth-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          <PasswordInput
            label="New password"
            placeholder="Enter new password"
            autoComplete="new-password"
            showStrength
            error={errors.password?.message}
            value={password}
            {...register('password')}
          />

          <PasswordInput
            label="Confirm new password"
            placeholder="Confirm new password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={isSubmitting}
              className="bg-auth-primary shadow-[0_4px_16px_-2px_rgba(37,99,235,0.45)] hover:bg-blue-700"
            >
              {isSubmitting ? 'Updating...' : 'Update password'}
            </Button>
          </motion.div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}