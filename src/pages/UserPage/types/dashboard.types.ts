export type BookingStatus = 'upcoming' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface CustomerBooking {
  id: string;
  title: string;
  type: string;
  status: BookingStatus;
  eventDate: string;
  eventTime: string;
  venue: string;
  city: string;
  coverImage: string;
  photographerId: string;
}

export interface Photographer {
  id: string;
  name: string;
  studio: string;
  avatar: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  location: string;
  startingPrice: number;
  categories: string[];
}

export interface TrendingReel {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  creator: string;
  creatorAvatar: string;
  duration: string;
}

export interface ShootLocation {
  id: string;
  name: string;
  type: string;
  image: string;
  city: string;
  shoots: number;
}

export interface PhotoCategory {
  id: string;
  name: string;
  image: string;
  count: number;
}

export interface PopularPackage {
  id: string;
  name: string;
  tier: 'Basic' | 'Premium' | 'Luxury' | 'Destination';
  description: string;
  startingPrice: number;
  features: string[];
  highlight?: boolean;
}

export interface CustomerReview {
  id: string;
  name: string;
  photo: string;
  rating: number;
  review: string;
  event: string;
}

export interface WhyShootHubItem {
  id: string;
  title: string;
  description: string;
  icon: 'verified' | 'ai' | 'gallery' | 'delivery' | 'booking';
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  path: string;
  icon: 'search' | 'reels' | 'map' | 'heart' | 'users' | 'message';
}

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'done' | 'current' | 'upcoming';
}

export interface SharedGallery {
  id: string;
  title: string;
  coverImage: string;
  photoCount: number;
  updatedAt: string;
}

export interface AlbumPreview {
  id: string;
  title: string;
  coverImage: string;
  pages: number;
  status: 'draft' | 'ready' | 'shared';
}

export interface PaymentSummary {
  total: number;
  paid: number;
  pending: number;
  currency: string;
  nextDueDate: string;
  nextDueAmount: number;
}

export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'payment' | 'gallery' | 'message' | 'event';
}

export interface MemoryHighlight {
  id: string;
  title: string;
  image: string;
  caption: string;
}

export interface ActiveEventDetails {
  booking: CustomerBooking;
  photographer: Photographer;
  timeline: TimelineStep[];
  galleries: SharedGallery[];
  albums: AlbumPreview[];
  payments: PaymentSummary;
  notifications: DashboardNotification[];
  memories: MemoryHighlight[];
  aiFaceSearchReady: boolean;
  facesIndexed: number;
}
