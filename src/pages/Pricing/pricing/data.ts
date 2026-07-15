export type BillingPeriod = 'monthly' | 'yearly';

export type PlanFeatureKey =
  | 'storage'
  | 'bookings'
  | 'aiFaceSearch'
  | 'gallery'
  | 'portfolio'
  | 'reels'
  | 'analytics'
  | 'teamMembers'
  | 'prioritySupport'
  | 'customDomain';

export type Plan = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  highlighted?: boolean;
  founderDiscount?: boolean;
  cta: string;
  features: Record<PlanFeatureKey, string | boolean>;
};

export const featureLabels: Record<PlanFeatureKey, string> = {
  storage: 'Storage',
  bookings: 'Bookings',
  aiFaceSearch: 'AI Face Search',
  gallery: 'Client Galleries',
  portfolio: 'Portfolio',
  reels: 'Reels',
  analytics: 'Analytics',
  teamMembers: 'Team Members',
  prioritySupport: 'Priority Support',
  customDomain: 'Custom Domain',
};

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Start exploring and share a basic portfolio.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    cta: 'Get Started',
    features: {
      storage: '2 GB',
      bookings: '3 / month',
      aiFaceSearch: false,
      gallery: '1 gallery',
      portfolio: true,
      reels: '3 reels',
      analytics: false,
      teamMembers: '1',
      prioritySupport: false,
      customDomain: false,
    },
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'For solo creators booking regularly.',
    monthlyPrice: 499,
    yearlyPrice: 399,
    cta: 'Start Free Trial',
    features: {
      storage: '25 GB',
      bookings: '20 / month',
      aiFaceSearch: true,
      gallery: '10 galleries',
      portfolio: true,
      reels: '20 reels',
      analytics: 'Basic',
      teamMembers: '1',
      prioritySupport: false,
      customDomain: false,
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Grow your studio with AI and analytics.',
    monthlyPrice: 1499,
    yearlyPrice: 1199,
    highlighted: true,
    founderDiscount: true,
    cta: 'Go Professional',
    features: {
      storage: '200 GB',
      bookings: 'Unlimited',
      aiFaceSearch: true,
      gallery: 'Unlimited',
      portfolio: true,
      reels: 'Unlimited',
      analytics: 'Advanced',
      teamMembers: '5',
      prioritySupport: true,
      customDomain: true,
    },
  },
  {
    id: 'studio',
    name: 'Studio',
    description: 'For multi-creator studios and agencies.',
    monthlyPrice: 3999,
    yearlyPrice: 3199,
    cta: 'Scale Studio',
    features: {
      storage: '1 TB',
      bookings: 'Unlimited',
      aiFaceSearch: true,
      gallery: 'Unlimited',
      portfolio: true,
      reels: 'Unlimited',
      analytics: 'Advanced + Export',
      teamMembers: '15',
      prioritySupport: true,
      customDomain: true,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom infrastructure for large teams.',
    monthlyPrice: -1,
    yearlyPrice: -1,
    cta: 'Contact Sales',
    features: {
      storage: 'Custom',
      bookings: 'Unlimited',
      aiFaceSearch: true,
      gallery: 'Unlimited',
      portfolio: true,
      reels: 'Unlimited',
      analytics: 'Custom',
      teamMembers: 'Unlimited',
      prioritySupport: true,
      customDomain: true,
    },
  },
];

export const pricingFAQ = [
  {
    question: 'Can I switch plans later?',
    answer:
      'Yes. Upgrade or downgrade anytime. Changes apply on your next billing cycle, and unused credit rolls over when you upgrade.',
  },
  {
    question: 'What is the Founder Discount?',
    answer:
      'Early creators on Professional (yearly) get 20% off for life. It’s applied automatically on the yearly toggle.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Starter and Professional include a 14-day free trial. No card required for Free. Enterprise is quoted by our team.',
  },
  {
    question: 'Do prices include GST?',
    answer:
      'Listed prices are exclusive of applicable taxes. GST is calculated at checkout based on your billing address.',
  },
] as const;

export function formatPlanPrice(price: number) {
  if (price < 0) return 'Custom';
  if (price === 0) return '₹0';
  return `₹${price.toLocaleString('en-IN')}`;
}
