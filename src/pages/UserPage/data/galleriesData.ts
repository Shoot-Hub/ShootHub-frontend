export type GalleryCategory =
  | 'all'
  | 'wedding'
  | 'pre-wedding'
  | 'engagement'
  | 'birthday'
  | 'corporate'
  | 'other';

export interface UserGallery {
  id: string;
  title: string;
  date: string;
  photographer: string;
  photoCount: number;
  locked: boolean;
  category: GalleryCategory;
  coverImage: string;
}

export const galleryCategories: { id: GalleryCategory; label: string }[] = [
  { id: 'all', label: 'All Galleries' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'pre-wedding', label: 'Pre-Wedding' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'birthday', label: 'Birthday' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'other', label: 'Other' },
];

export const userGalleries: UserGallery[] = [
  {
    id: 'g1',
    title: 'Riya & Kunal Wedding',
    date: '12 Dec 2026',
    photographer: 'Harsh Sharma',
    photoCount: 128,
    locked: true,
    category: 'wedding',
    coverImage:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=560&fit=crop',
  },
  {
    id: 'g2',
    title: 'Engagement Ceremony',
    date: '18 Oct 2026',
    photographer: 'Aditi Films',
    photoCount: 86,
    locked: false,
    category: 'engagement',
    coverImage:
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=560&fit=crop',
  },
  {
    id: 'g3',
    title: 'Pre-Wedding Shoot',
    date: '02 Sep 2026',
    photographer: 'Sneha Patel',
    photoCount: 64,
    locked: false,
    category: 'pre-wedding',
    coverImage:
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&h=560&fit=crop',
  },
  {
    id: 'g4',
    title: 'Anniversary Celebration',
    date: '22 Aug 2026',
    photographer: 'Rahul Mehta',
    photoCount: 42,
    locked: true,
    category: 'other',
    coverImage:
      'https://images.unsplash.com/photo-1519225421980-715cb0215a07?w=800&h=560&fit=crop',
  },
  {
    id: 'g5',
    title: 'Baby Shower Session',
    date: '14 Jul 2026',
    photographer: 'Priya Kapoor',
    photoCount: 55,
    locked: false,
    category: 'birthday',
    coverImage:
      'https://images.unsplash.com/photo-1511285560929-80b456fe3b6f?w=800&h=560&fit=crop',
  },
  {
    id: 'g6',
    title: 'Corporate Headshots',
    date: '05 Nov 2026',
    photographer: 'Arjun Desai',
    photoCount: 36,
    locked: false,
    category: 'corporate',
    coverImage:
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=560&fit=crop',
  },
  {
    id: 'g7',
    title: 'Mehul Birthday Party',
    date: '28 Jun 2026',
    photographer: 'Vikram Singh',
    photoCount: 78,
    locked: true,
    category: 'birthday',
    coverImage:
      'https://images.unsplash.com/photo-1537633552985-df8429e804cb?w=800&h=560&fit=crop',
  },
  {
    id: 'g8',
    title: 'Destination Wedding Highlights',
    date: '10 May 2026',
    photographer: 'Meera Joshi',
    photoCount: 210,
    locked: false,
    category: 'wedding',
    coverImage:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=560&fit=crop',
  },
];
