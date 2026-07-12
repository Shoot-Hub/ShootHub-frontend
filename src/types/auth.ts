import type { ReactNode } from 'react';

export type AuthBannerVariant = 'login' | 'signup';

export type AuthCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  compact?: boolean;
};

export type SocialLoginProps = {
  onSocialLogin?: (provider: 'google' | 'apple' | 'facebook') => void;
};

export type CaptchaProps = {
  onVerify: (verified: boolean) => void;
  className?: string;
};
