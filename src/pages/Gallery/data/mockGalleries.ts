import weddingImg from '@/assets/landing/categories/wedding.jpg';
import birthdayImg from '@/assets/landing/categories/birthday.jpg';
import portraitImg from '@/assets/landing/categories/portrait.jpg';
import corporateImg from '@/assets/landing/categories/corporate.jpg';
import fashionImg from '@/assets/landing/categories/fashion.jpg';
import travelImg from '@/assets/landing/categories/travel.jpg';
import avatar1 from '@/assets/landing/avatar-1.jpg';
import avatar2 from '@/assets/landing/avatar-2.jpg';
import type { Gallery } from '../types';

export const DEMO_GALLERY_LINKS = [
  {
    slug: 'rohit-priya-wedding',
    label: 'Rohit & Priya Wedding',
    type: 'Public Gallery',
    description: 'Full wedding experience with 1,245 photos — open access landing page.',
    href: '/gallery/rohit-priya-wedding',
  },
  {
    slug: 'aarav-birthday',
    label: 'Aarav 1st Birthday',
    type: 'Password Protected',
    description: 'Private celebration gallery — use password demo123 to unlock.',
    href: '/gallery/aarav-birthday',
    password: 'demo123',
  },
  {
    slug: 'mehta-portraits',
    label: 'Mehta Family Portraits',
    type: 'Public Gallery',
    description: 'Intimate portrait session with AI face search demo.',
    href: '/gallery/mehta-portraits',
  },
] as const;

export const MOCK_GALLERIES: Record<string, Gallery> = {
  'rohit-priya-wedding': {
    id: 'g1',
    slug: 'rohit-priya-wedding',
    name: 'Rohit & Priya Wedding',
    description:
      'A magical celebration of love in the heart of Udaipur. Every candid smile, every tear of joy, and every dance move captured forever.',
    coverImage: weddingImg,
    eventDate: 'May 20, 2024',
    location: 'Udaipur, Rajasthan',
    photoCount: 1245,
    albumCount: 8,
    createdDate: 'May 21, 2024',
    storageUsed: '12.5 GB',
    access: 'public',
    settings: {
      isPublic: true,
      isPasswordProtected: false,
      hasWatermark: false,
      downloadEnabled: true,
      expiryDate: 'Jun 20, 2025',
    },
    photographer: {
      id: 'p1',
      name: 'Arla Moore',
      avatar: avatar1,
      studio: 'Moore Studios',
    },
    albums: [
      { id: 'a1', name: 'Ceremony', photoCount: 320 },
      { id: 'a2', name: 'Reception', photoCount: 410 },
      { id: 'a3', name: 'Portraits', photoCount: 185 },
      { id: 'a4', name: 'Candid', photoCount: 330 },
    ],
  },
  'aarav-birthday': {
    id: 'g2',
    slug: 'aarav-birthday',
    name: 'Aarav 1st Birthday',
    description:
      'Sweet moments from Aarav\'s first birthday bash — cake smashes, balloon pops, and family hugs galore.',
    coverImage: birthdayImg,
    eventDate: 'Apr 12, 2024',
    location: 'Mumbai, Maharashtra',
    photoCount: 486,
    albumCount: 4,
    createdDate: 'Apr 13, 2024',
    storageUsed: '5.2 GB',
    access: 'password',
    password: 'demo123',
    settings: {
      isPublic: false,
      isPasswordProtected: true,
      hasWatermark: true,
      downloadEnabled: true,
      expiryDate: 'May 12, 2025',
    },
    photographer: {
      id: 'p2',
      name: 'Priya Sharma',
      avatar: avatar2,
      studio: 'Lens & Light',
    },
    albums: [
      { id: 'b1', name: 'Party', photoCount: 210 },
      { id: 'b2', name: 'Family', photoCount: 156 },
      { id: 'b3', name: 'Cake Smash', photoCount: 120 },
    ],
  },
  'mehta-portraits': {
    id: 'g3',
    slug: 'mehta-portraits',
    name: 'Mehta Family Portraits',
    description:
      'Timeless family portraits in natural light — perfect for testing AI face search with your selfie.',
    coverImage: portraitImg,
    eventDate: 'Mar 8, 2024',
    location: 'Mumbai',
    photoCount: 128,
    albumCount: 2,
    createdDate: 'Mar 9, 2024',
    storageUsed: '1.8 GB',
    access: 'public',
    settings: {
      isPublic: true,
      isPasswordProtected: false,
      hasWatermark: false,
      downloadEnabled: true,
      expiryDate: 'Apr 8, 2025',
    },
    photographer: {
      id: 'p1',
      name: 'Arla Moore',
      avatar: avatar1,
      studio: 'Moore Studios',
    },
    albums: [
      { id: 'c1', name: 'Studio', photoCount: 64 },
      { id: 'c2', name: 'Outdoor', photoCount: 64 },
    ],
  },
};

const PHOTO_SOURCES = [
  weddingImg,
  birthdayImg,
  portraitImg,
  corporateImg,
  fashionImg,
  travelImg,
];

const ASPECTS = [
  { w: 1600, h: 1200 },
  { w: 1200, h: 1600 },
  { w: 1600, h: 1067 },
  { w: 1067, h: 1600 },
  { w: 1600, h: 900 },
  { w: 900, h: 1600 },
];

export function generateMockPhotos(galleryId: string, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const aspect = ASPECTS[i % ASPECTS.length];
    const src = PHOTO_SOURCES[i % PHOTO_SOURCES.length];
    const id = `${galleryId}-photo-${i + 1}`;
    return {
      id,
      galleryId,
      url: src,
      thumbnailUrl: src,
      width: aspect.w,
      height: aspect.h,
      filename: `IMG_${String(i + 1).padStart(4, '0')}.jpg`,
      albumId: undefined,
      isFavorite: i % 11 === 0,
      createdAt: new Date(2024, 4, 20 - (i % 30)).toISOString(),
    };
  });
}

export function getGalleryShareUrl(slug: string) {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/gallery/${slug}`;
  }
  return `https://shoothub.com/gallery/${slug}`;
}
