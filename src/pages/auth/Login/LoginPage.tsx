import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  AuthLayout,
  AuthCard,
  AuthInput,
  PasswordInput,
  RememberMe,
  SocialLogin,
  Divider,
  AuthSubmitButton,
} from '@/components/auth';
import { loginSchema, type LoginFormData } from '@/schemas/auth';
import { AUTH_ROUTES } from '@/constants/auth';
import { userService } from '@/services/user';
import { setAuth } from '@/store';

export function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await userService.login(data.email, data.password);

      if (response.data?.user) {
        const user = response.data.user;
        setAuth(user);

        // Redirect based on role
        if (user.role === 'photographer') {
          navigate('/creator');
        } else {
          navigate('/');
        }
        toast.success('Welcome back!');
      } else {
        toast.success(`Welcome back! (${data.email})`);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Login failed. Please try again.';
      toast.error(message);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast(`Continue with ${provider} — connect your OAuth provider`);
  };

  return (
    <AuthLayout variant="login">
      <AuthCard
        eyebrow="Welcome back! 👋"
        title="Log in to your account"
        description="Continue to ShootHub and manage your bookings, galleries and more."
        footer={
          <p className="text-center text-sm text-ink-muted">
            Don't have an account?{' '}
            <Link
              to={AUTH_ROUTES.SIGNUP}
              className="font-semibold text-auth-primary transition-colors hover:text-auth-accent"
            >
              Sign up
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-[18px]" noValidate>
          <AuthInput
            label="Email address"
            icon={Mail}
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          <Controller
            name="rememberMe"
            control={control}
            render={({ field: { value, ...field } }) => (
              <RememberMe {...field} checked={!!value} />
            )}
          />

          <AuthSubmitButton loading={isSubmitting} loadingText="Logging in...">
            Log in
          </AuthSubmitButton>
        </form>

        <Divider label="or continue with" />
        <SocialLogin onSocialLogin={handleSocialLogin} />
      </AuthCard>
    </AuthLayout>
  );
}