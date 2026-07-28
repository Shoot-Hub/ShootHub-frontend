import type {
  ActiveEventDetails,
  CustomerBooking,
  CustomerReview,
  PhotoCategory,
  Photographer,
  PopularPackage,
  QuickAction,
  ShootLocation,
  TrendingReel,
  WhyShootHubItem,
} from '../types/dashboard.types';

/**
 * Demo switch: set to `true` to preview the Event Dashboard with an active booking.
 * Production logic: derive from `customerBookings.length > 0`.
 */
export const DEMO_FORCE_ACTIVE_BOOKING = false;

export const customerBookings: CustomerBooking[] = DEMO_FORCE_ACTIVE_BOOKING
  ? [
      {
        id: 'BK-2048',
        title: 'Riya & Kunal Wedding',
        type: 'Destination Wedding',
        status: 'upcoming',
        eventDate: '2026-12-12',
        eventTime: '10:30 AM',
        venue: 'Jaipur Palace',
        city: 'Jaipur',
        coverImage:
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&h=800&fit=crop',
        photographerId: 'ph-01',
      },
    ]
  : [];

export const recommendedCreators: Photographer[] = [
  {
    id: 'ph-01',
    name: 'Amit Verma',
    studio: 'Verma Visuals',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    coverImage:
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=900&h=560&fit=crop',
    rating: 4.9,
    reviewCount: 214,
    verified: true,
    location: 'Indore, MP',
    startingPrice: 45000,
    categories: ['Wedding', 'Candid', 'Drone'],
  },
  {
    id: 'ph-02',
    name: 'Neha Kapoor',
    studio: 'Neha Photography',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    coverImage:
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&h=560&fit=crop',
    rating: 4.8,
    reviewCount: 168,
    verified: true,
    location: 'Ujjain, MP',
    startingPrice: 38000,
    categories: ['Pre-Wedding', 'Fashion'],
  },
  {
    id: 'ph-03',
    name: 'Arjun Mehta',
    studio: 'LensCraft Studio',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    coverImage:
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&h=560&fit=crop',
    rating: 4.9,
    reviewCount: 301,
    verified: true,
    location: 'Bhopal, MP',
    startingPrice: 52000,
    categories: ['Wedding', 'Traditional', 'Cinema'],
  },
  {
    id: 'ph-04',
    name: 'Priya Shah',
    studio: 'Studio Memories',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    coverImage:
      'https://images.unsplash.com/photo-1511285560929-80b456fe3b6f?w=900&h=560&fit=crop',
    rating: 4.7,
    reviewCount: 142,
    verified: true,
    location: 'Indore, MP',
    startingPrice: 32000,
    categories: ['Baby Shoot', 'Birthday', 'Family'],
  },
];

export const trendingReels: TrendingReel[] = [
  {
    id: 'reel-1',
    title: 'Royal baraat at sunset',
    thumbnail:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=700&h=1100&fit=crop',
    views: 128400,
    likes: 18400,
    creator: 'Verma Visuals',
    creatorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    duration: '0:42',
  },
  {
    id: 'reel-2',
    title: 'First look in the courtyard',
    thumbnail:
      'https://images.unsplash.com/photo-1511285560929-80b456fe3b6f?w=700&h=1100&fit=crop',
    views: 96200,
    likes: 14200,
    creator: 'Neha Photography',
    creatorAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    duration: '0:28',
  },
  {
    id: 'reel-3',
    title: 'Haldi colour & chaos',
    thumbnail:
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=700&h=1100&fit=crop',
    views: 210500,
    likes: 27600,
    creator: 'LensCraft Studio',
    creatorAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    duration: '0:51',
  },
  {
    id: 'reel-4',
    title: 'Sangeet night energy',
    thumbnail:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=700&h=1100&fit=crop',
    views: 87400,
    likes: 11900,
    creator: 'Studio Memories',
    creatorAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    duration: '0:35',
  },
];

export const topLocations: ShootLocation[] = [
  {
    id: 'loc-1',
    name: 'City Palace',
    type: 'Palaces',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop',
    city: 'Udaipur',
    shoots: 420,
  },
  {
    id: 'loc-2',
    name: 'Lake Pichola Resorts',
    type: 'Resorts',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    city: 'Udaipur',
    shoots: 310,
  },
  {
    id: 'loc-3',
    name: 'Botanical Gardens',
    type: 'Gardens',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=600&fit=crop',
    city: 'Indore',
    shoots: 265,
  },
  {
    id: 'loc-4',
    name: 'Upper Lake',
    type: 'Lakes',
    image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop',
    city: 'Bhopal',
    shoots: 198,
  },
  {
    id: 'loc-5',
    name: 'Pachmarhi Hills',
    type: 'Mountains',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
    city: 'MP',
    shoots: 156,
  },
  {
    id: 'loc-6',
    name: 'Grand Banquet Halls',
    type: 'Banquets',
    image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c2d0?w=800&h=600&fit=crop',
    city: 'Indore',
    shoots: 540,
  },
  {
    id: 'loc-7',
    name: 'Goa Coastline',
    type: 'Beach',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    city: 'Goa',
    shoots: 380,
  },
  {
    id: 'loc-8',
    name: 'Rajasthan Royale',
    type: 'Destination Wedding',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop',
    city: 'Jaipur',
    shoots: 290,
  },
];

export const photographyCategories: PhotoCategory[] = [
  {
    id: 'cat-1',
    name: 'Wedding',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=500&fit=crop',
    count: 2400,
  },
  {
    id: 'cat-2',
    name: 'Pre Wedding',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=500&h=500&fit=crop',
    count: 1800,
  },
  {
    id: 'cat-3',
    name: 'Birthday',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&h=500&fit=crop',
    count: 960,
  },
  {
    id: 'cat-4',
    name: 'Baby Shoot',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop',
    count: 720,
  },
  {
    id: 'cat-5',
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=500&fit=crop',
    count: 540,
  },
  {
    id: 'cat-6',
    name: 'Corporate',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&h=500&fit=crop',
    count: 410,
  },
  {
    id: 'cat-7',
    name: 'Travel',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=500&fit=crop',
    count: 680,
  },
  {
    id: 'cat-8',
    name: 'Drone',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&h=500&fit=crop',
    count: 390,
  },
  {
    id: 'cat-9',
    name: 'Food',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=500&fit=crop',
    count: 280,
  },
  {
    id: 'cat-10',
    name: 'Product',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    count: 350,
  },
];

export const popularPackages: PopularPackage[] = [
  {
    id: 'pkg-1',
    name: 'Essential Day',
    tier: 'Basic',
    description: 'One photographer, highlight edits, and a shared online gallery.',
    startingPrice: 25000,
    features: ['6–8 hours coverage', '200+ edited photos', 'Online gallery'],
  },
  {
    id: 'pkg-2',
    name: 'Signature Wedding',
    tier: 'Premium',
    description: 'Candid + traditional duo with cinematic highlights and albums.',
    startingPrice: 65000,
    features: ['2 photographers', 'Teaser reel', 'Premium album'],
    highlight: true,
  },
  {
    id: 'pkg-3',
    name: 'Royal Coverage',
    tier: 'Luxury',
    description: 'Full wedding week coverage with drone, cinema, and same-day edits.',
    startingPrice: 150000,
    features: ['Full team', 'Drone + cinema', 'Same-day selects'],
  },
  {
    id: 'pkg-4',
    name: 'Destination Escape',
    tier: 'Destination',
    description: 'Travel-ready crew for palace, beach, and mountain weddings.',
    startingPrice: 220000,
    features: ['Travel included', 'Multi-day', 'Luxury album set'],
  },
];

export const customerReviews: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Ananya & Rohan',
    photo: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=400&fit=crop',
    rating: 5,
    review:
      'ShootHub made booking effortless. Our photographer captured every quiet glance and loud celebration.',
    event: 'Destination Wedding',
  },
  {
    id: 'rev-2',
    name: 'Meera Joshi',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    rating: 5,
    review:
      'The portfolio quality is unreal. We compared packages in minutes and booked with total confidence.',
    event: 'Pre-Wedding',
  },
  {
    id: 'rev-3',
    name: 'Kabir Singh',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    rating: 4.9,
    review:
      'Secure gallery delivery was fast, and AI face search helped relatives find their photos instantly.',
    event: 'Wedding',
  },
];

export const whyShootHub: WhyShootHubItem[] = [
  {
    id: 'why-1',
    title: 'Verified Creators',
    description: 'Every photographer is reviewed for quality, reliability, and portfolio depth.',
    icon: 'verified',
  },
  {
    id: 'why-2',
    title: 'AI Face Search',
    description: 'Find yourself across thousands of wedding photos in seconds.',
    icon: 'ai',
  },
  {
    id: 'why-3',
    title: 'Secure Gallery',
    description: 'Private, encrypted galleries shared only with the people you invite.',
    icon: 'gallery',
  },
  {
    id: 'why-4',
    title: 'Fast Delivery',
    description: 'Teasers, highlights, and full galleries delivered on clear timelines.',
    icon: 'delivery',
  },
  {
    id: 'why-5',
    title: 'Easy Booking',
    description: 'Compare packages, chat with creators, and book without the chaos.',
    icon: 'booking',
  },
];

export const quickActions: QuickAction[] = [
  {
    id: 'qa-1',
    label: 'Find Photographer',
    description: 'Browse verified creators',
    path: '/user/explore-creators',
    icon: 'search',
  },
  {
    id: 'qa-2',
    label: 'Browse Reels',
    description: 'Watch trending shoots',
    path: '/user/reels',
    icon: 'reels',
  },
  {
    id: 'qa-3',
    label: 'Explore Locations',
    description: 'Discover dream venues',
    path: '/user/top-locations',
    icon: 'map',
  },
  {
    id: 'qa-4',
    label: 'Favorites',
    description: 'Your saved shortlist',
    path: '/user/favorites',
    icon: 'heart',
  },
  {
    id: 'qa-5',
    label: 'Saved Creators',
    description: 'Creators you love',
    path: '/user/favorites',
    icon: 'users',
  },
  {
    id: 'qa-6',
    label: 'Messages',
    description: 'Chat with studios',
    path: '/user/notifications',
    icon: 'message',
  },
];

export const activeEventDetails: ActiveEventDetails = {
  booking: {
    id: 'BK-2048',
    title: 'Riya & Kunal Wedding',
    type: 'Destination Wedding',
    status: 'upcoming',
    eventDate: '2026-12-12',
    eventTime: '10:30 AM',
    venue: 'Jaipur Palace',
    city: 'Jaipur',
    coverImage:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&h=800&fit=crop',
    photographerId: 'ph-01',
  },
  photographer: recommendedCreators[0],
  timeline: [
    {
      id: 'tl-1',
      title: 'Booking confirmed',
      description: 'Deposit received and date locked with Verma Visuals.',
      date: '12 Mar 2026',
      status: 'done',
    },
    {
      id: 'tl-2',
      title: 'Moodboard shared',
      description: 'Colour palette, references, and shot list approved.',
      date: '28 Apr 2026',
      status: 'done',
    },
    {
      id: 'tl-3',
      title: 'Pre-wedding shoot',
      description: 'Location scout and outfit planning in progress.',
      date: '18 Sep 2026',
      status: 'current',
    },
    {
      id: 'tl-4',
      title: 'Wedding week coverage',
      description: 'Full team arrives for mehendi, sangeet, and pheras.',
      date: '10–12 Dec 2026',
      status: 'upcoming',
    },
    {
      id: 'tl-5',
      title: 'Gallery delivery',
      description: 'Highlights, full gallery, and album proofs.',
      date: 'Jan 2027',
      status: 'upcoming',
    },
  ],
  galleries: [
    {
      id: 'gal-1',
      title: 'Engagement Selects',
      coverImage:
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=700&h=500&fit=crop',
      photoCount: 86,
      updatedAt: '2 days ago',
    },
    {
      id: 'gal-2',
      title: 'Pre-Wedding Teaser',
      coverImage:
        'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=700&h=500&fit=crop',
      photoCount: 42,
      updatedAt: '1 week ago',
    },
    {
      id: 'gal-3',
      title: 'Family Portraits',
      coverImage:
        'https://images.unsplash.com/photo-1511285560929-80b456fe3b6f?w=700&h=500&fit=crop',
      photoCount: 28,
      updatedAt: '3 weeks ago',
    },
  ],
  albums: [
    {
      id: 'alb-1',
      title: 'Royal Wedding Album',
      coverImage:
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop',
      pages: 48,
      status: 'draft',
    },
    {
      id: 'alb-2',
      title: 'Parents Edition',
      coverImage:
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=800&fit=crop',
      pages: 24,
      status: 'ready',
    },
  ],
  payments: {
    total: 185000,
    paid: 95000,
    pending: 90000,
    currency: 'INR',
    nextDueDate: '15 Aug 2026',
    nextDueAmount: 45000,
  },
  notifications: [
    {
      id: 'n-1',
      title: 'New gallery shared',
      message: 'Engagement Selects is ready to view.',
      time: '2h ago',
      unread: true,
      type: 'gallery',
    },
    {
      id: 'n-2',
      title: 'Payment reminder',
      message: 'Next installment of ₹45,000 is due on 15 Aug.',
      time: '1d ago',
      unread: true,
      type: 'payment',
    },
    {
      id: 'n-3',
      title: 'Message from Amit',
      message: 'Please share final guest list for group photos.',
      time: '2d ago',
      unread: false,
      type: 'message',
    },
  ],
  memories: [
    {
      id: 'mem-1',
      title: 'The First Look',
      image:
        'https://images.unsplash.com/photo-1511285560929-80b456fe3b6f?w=700&h=900&fit=crop',
      caption: 'Quiet moments before the chaos.',
    },
    {
      id: 'mem-2',
      title: 'Haldi Glow',
      image:
        'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=700&h=900&fit=crop',
      caption: 'Colour, laughter, and family.',
    },
    {
      id: 'mem-3',
      title: 'Palace Lights',
      image:
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=700&h=900&fit=crop',
      caption: 'Your venue under golden hour.',
    },
  ],
  aiFaceSearchReady: true,
  facesIndexed: 186,
};

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompact(n: number): string {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

export function getActiveBookings(bookings: CustomerBooking[] = customerBookings) {
  return bookings.filter((b) => b.status === 'upcoming' || b.status === 'confirmed' || b.status === 'in_progress');
}
