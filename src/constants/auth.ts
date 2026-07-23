import type { LucideIcon } from 'lucide-react';
import { BadgeCheck, Camera, MessageSquareQuote, ShieldCheck, User, Zap } from 'lucide-react';

export const AUTH_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
} as const;

export const SOCIAL_PROVIDERS = ['google', 'apple', 'facebook'] as const;

export type SocialProvider = (typeof SOCIAL_PROVIDERS)[number];

export type AuthFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const LOGIN_FEATURES: AuthFeature[] = [
  {
    icon: ShieldCheck,
    title: 'Secure Gallery',
    description: 'Your data is always protected...',
  },
  {
    icon: BadgeCheck,
    title: 'Verified Creators',
    description: 'Quality creators, trusted by clients...',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    description: 'Quick sharing, beautiful results...',
  },
];

export const SIGNUP_BENEFITS: AuthFeature[] = [
  {
    icon: User,
    title: 'For Clients',
    description: 'Find verified photographers and book with confidence.',
  },
  {
    icon: Camera,
    title: 'For Creators',
    description: 'Showcase your work and grow your business.',
  },
  {
    icon: MessageSquareQuote,
    title: 'Everything in One Place',
    description: 'Chat, book, shoot and deliver—all in one hub.',
  },
];

export const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳', country: 'IN', label: 'India (+91)' },
  { code: '+1', flag: '🇺🇸', country: 'US', label: 'United States (+1)' },
  { code: '+44', flag: '🇬🇧', country: 'GB', label: 'United Kingdom (+44)' },
  { code: '+61', flag: '🇦🇺', country: 'AU', label: 'Australia (+61)' },
  { code: '+971', flag: '🇦🇪', country: 'AE', label: 'UAE (+971)' },
  { code: '+65', flag: '🇸🇬', country: 'SG', label: 'Singapore (+65)' },
] as const;

export const USER_ROLES = [
  {
    value: 'user',
    label: "I'm a User",
    description: 'I want to book photographers',
  },
  {
    value: 'photographer',
    label: "I'm a Photographer",
    description: 'I want to showcase my work',
  },
] as const;

export type UserRole = (typeof USER_ROLES)[number]['value'];

export const PASSWORD_RULES = {
  minLength: 8,
  patterns: {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[^A-Za-z0-9]/,
  },
} as const;
