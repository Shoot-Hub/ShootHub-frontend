import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Logo } from '@/pages/LandingPage/landing/Logo';
import { AUTH_ROUTES } from '@/constants/auth';
import { AuthBanner } from '@/components/auth/AuthBanner';
import { AuthFooterBanner } from '@/components/auth/AuthFooterBanner';
import { LanguageSelector } from '@/components/auth/LanguageSelector';
import type { AuthBannerVariant } from '@/types/auth';

type AuthLayoutProps = {
  variant: AuthBannerVariant;
  children: React.ReactNode;
};

export function AuthLayout({ variant, children }: AuthLayoutProps) {
  const isSignup = variant === 'signup';
  const showLoginChrome = variant === 'login';

  return (
    <div className="flex min-h-dvh flex-col overflow-y-auto bg-auth-bg lg:h-dvh lg:overflow-hidden">
      <div className="mx-auto flex w-full max-w-[1480px] flex-1 flex-col justify-center px-2 py-3 sm:px-3 sm:py-4 lg:h-full lg:min-h-0">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-3 shrink-0 lg:hidden"
        >
          <Link to={AUTH_ROUTES.LOGIN} aria-label="ShootHub home">
            <Logo className="h-10 w-auto sm:h-12" />
          </Link>
        </motion.div>

        <div
          className={cn(
            'flex min-h-0 w-full flex-1 flex-col rounded-[var(--radius-auth)] bg-white shadow-auth-shell lg:overflow-hidden lg:flex-row',
            isSignup ? 'lg:max-h-[860px]' : 'lg:max-h-[760px]',
          )}
        >
          <aside className="hidden min-h-0 lg:flex lg:w-[46%] xl:w-[48%]">
            <AuthBanner variant={variant} />
          </aside>

          <main
            className={cn(
              'relative flex min-h-0 flex-1 flex-col bg-white',
              isSignup
                ? 'overflow-y-auto px-4 py-5 sm:px-6 lg:px-7 lg:py-6'
                : 'overflow-y-auto lg:overflow-hidden',
            )}
          >
            {showLoginChrome && (
              <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-5">
                <LanguageSelector />
              </div>
            )}

            <div
              className={cn(
                'mx-auto flex w-full max-w-[440px] flex-1 flex-col',
                showLoginChrome
                  ? 'justify-center px-4 pb-4 pt-14 sm:px-6 sm:pb-5 sm:pt-16 lg:px-5'
                  : 'justify-start',
              )}
            >
              {children}
            </div>

            {showLoginChrome && (
              <div className="mt-auto shrink-0 px-4 pb-4 sm:px-5 sm:pb-5">
                <AuthFooterBanner />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
