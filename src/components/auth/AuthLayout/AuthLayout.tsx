import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Logo } from '@/pages/LandingPage/landing/Logo';
import { AUTH_ROUTES } from '@/constants/auth';
import { AuthBanner } from '@/components/auth/AuthBanner';
import type { AuthBannerVariant } from '@/types/auth';

type AuthLayoutProps = {
  variant: AuthBannerVariant;
  children: React.ReactNode;
};

export function AuthLayout({ variant, children }: AuthLayoutProps) {
  const isSignup = variant === 'signup';

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-auth-bg">
      <div className="mx-auto flex h-full w-full max-w-[1480px] flex-col justify-center px-2 py-3 sm:px-3 sm:py-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-2 shrink-0 lg:hidden"
        >
          <Link to={AUTH_ROUTES.LOGIN} aria-label="ShootHub home">
            <Logo className="h-28 w-auto sm:h-32" />
          </Link>
        </motion.div>

        <div
          className={cn(
            'flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[20px] bg-white shadow-auth-shell lg:flex-row',
            isSignup ? 'lg:max-h-[700px]' : 'lg:max-h-[720px]',
          )}
        >
          <aside className="hidden min-h-0 lg:flex lg:w-[44%] xl:w-[42%]">
            <AuthBanner variant={variant} />
          </aside>

          <main
            className={cn(
              'flex min-h-0 flex-1 bg-white px-4 py-4 sm:px-5 lg:px-5 lg:py-5',
              isSignup
                ? 'items-start justify-center overflow-y-auto [&::-webkit-scrollbar]:hidden'
                : 'items-center justify-center overflow-y-auto lg:overflow-hidden [&::-webkit-scrollbar]:hidden',
            )}
          >
            <div className="mx-auto w-full max-w-[440px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
