export type UserProfile = {
  id: string;
  _id?: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  avatar?: { public_id: string | null; url: string | null };
  coverPhoto?: { public_id: string | null; url: string | null };
  featuredPortfolioImage?: { public_id: string | null; url: string | null };
  isProfileComplete?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isKycVerified?: boolean;
  isVerified?: boolean;
  isFeatured?: boolean;
  isOnline?: boolean;
  profileCompletionPercent?: number;
  profileViews?: number;
  portfolioImages?: Array<{ public_id?: string; url?: string }>;
  portfolioVideos?: Array<{ public_id?: string; url?: string }>;
  packages?: Array<Record<string, unknown>>;
  availability?: Array<{ day: string; isAvailable: boolean; startTime?: string; endTime?: string }>;
  isNegotiable?: boolean;
  willingToTravel?: boolean;
  travelRadiusKm?: number;
  travelChargePerKm?: number;
  location?: {
    city?: string | null;
    state?: string | null;
    country?: string;
    address?: string | null;
    landmark?: string | null;
    district?: string | null;
    pincode?: string | null;
  };
  about?: string | null;
  socialLinks?: {
    instagram?: string | null;
    facebook?: string | null;
    youtube?: string | null;
    twitter?: string | null;
    linkedin?: string | null;
    website?: string | null;
    behance?: string | null;
  };
  specializations?: string[];
  skills?: string[];
  editingStyles?: string[];
  startingPrice?: number;
  currency?: string;
  experienceYears?: number;
  rating?: {
    average: number;
    totalReviews: number;
    totalBookings: number;
    breakdown?: {
      five: number;
      four: number;
      three: number;
      two: number;
      one: number;
    };
  };
  currentSubscription?: {
    plan: string;
    status: string;
    features?: {
      maxPortfolioImages?: number;
      maxPackages?: number;
      featuredListing?: boolean;
      prioritySupport?: boolean;
      analyticsAccess?: boolean;
      watermarkRemoval?: boolean;
      videoPortfolio?: boolean;
    };
  };
  languages?: string[];
  gender?: string | null;
  dateOfBirth?: string | null;
  slug?: string;
  displayName?: string | null;
} | null;

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponseData = {
  user: NonNullable<UserProfile>;
  accessToken: string;
  refreshToken: string;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type AuthState = {
  user: UserProfile;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
};
