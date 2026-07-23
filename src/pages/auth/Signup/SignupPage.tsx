import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  AuthLayout,
  AuthCard,
  AuthInput,
  PasswordInput,
  RoleSelector,
  Captcha,
  TermsCheckbox,
  AuthSubmitButton,
} from '@/components/auth';
import { MobileInput } from '@/components/auth/MobileInput';
import { signupSchema, type SignupFormData } from '@/schemas/auth';
import { AUTH_ROUTES } from '@/constants/auth';
import { userService } from '@/services/user';
import { setAuth } from '@/store';

export function SignupPage() {
  const navigate = useNavigate();
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const handleCaptchaVerify = useCallback((verified: boolean) => setCaptchaVerified(verified), []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      countryCode: '+91',
      role: 'user',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    if (!captchaVerified) {
      toast.error('Please complete the reCAPTCHA verification');
      return;
    }

    try {
      const nameParts = data.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const response = await userService.signup({
        firstName,
        lastName,
        email: data.email,
        password: data.password,
        role: data.role,
        phone: `${data.countryCode}${data.mobile}`,
      });

      if (response.data?.user) {
        const user = response.data.user;
        setAuth(user);

        // Redirect based on role
        if (user.role === 'photographer') {
          navigate('/creator');
        } else {
          navigate('/');
        }
        toast.success(`Account created for ${data.fullName}!`);
      } else {
        toast.success(`Account created for ${data.fullName}!`);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Signup failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <AuthLayout variant="signup">
      <AuthCard
        compact
        eyebrow="Create your account ✨"
        title="Sign up to get started"
        description="Join ShootHub and start your amazing journey today."
        footer={
          <p className="text-center text-sm text-ink-muted">
            Already have an account?{' '}
            <Link
              to={AUTH_ROUTES.LOGIN}
              className="font-semibold text-auth-accent transition-colors hover:text-indigo-700"
            >
              Log in
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-3" noValidate>
          <input type="hidden" {...register('countryCode')} />

          <AuthInput
            label="Full name"
            icon={User}
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <AuthInput
            label="Email address"
            icon={Mail}
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <Controller
            name="mobile"
            control={control}
            render={({ field }) => (
              <MobileInput
                countryCode={watch('countryCode')}
                onCountryCodeChange={(code) => setValue('countryCode', code)}
                value={field.value}
                onChange={field.onChange}
                error={errors.mobile?.message ?? errors.countryCode?.message}
              />
            )}
          />

          <PasswordInput
            label="Password"
            placeholder="Create a password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />

          <PasswordInput
            label="Confirm password"
            placeholder="Confirm your password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <RoleSelector
                value={field.value}
                onChange={field.onChange}
                error={errors.role?.message}
              />
            )}
          />

          <Controller
            name="acceptTerms"
            control={control}
            render={({ field: { value, ...field } }) => (
              <TermsCheckbox
                {...field}
                checked={!!value}
                error={errors.acceptTerms?.message}
              />
            )}
          />

          <Captcha onVerify={handleCaptchaVerify} />

          <AuthSubmitButton
            loading={isSubmitting}
            loadingText="Creating account..."
            disabled={!captchaVerified}
          >
            Create account
          </AuthSubmitButton>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}