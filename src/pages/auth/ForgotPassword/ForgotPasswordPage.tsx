import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { AuthLayout, AuthCard, AuthInput } from '@/components/auth';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas/auth';
import { AUTH_ROUTES } from '@/constants/auth';

export function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success(`Reset link sent to ${data.email}`);
  };

  return (
    <AuthLayout variant="login">
      <AuthCard
        eyebrow="Forgot password?"
        title="Reset your password"
        description="Enter the email associated with your account and we'll send you a reset link."
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
          <AuthInput
            label="Email address"
            icon={Mail}
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={isSubmitting}
              className="bg-auth-primary shadow-[0_4px_16px_-2px_rgba(37,99,235,0.45)] hover:bg-blue-700"
            >
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </Button>
          </motion.div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
