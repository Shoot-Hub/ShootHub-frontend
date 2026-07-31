import type { Photographer } from '../types/dashboard.types';

export type ProfessionalCategoryId =
  | 'all'
  | 'wedding'
  | 'pre-wedding'
  | 'event'
  | 'portrait'
  | 'fashion'
  | 'product'
  | 'video';

export const professionalCategories: {
  id: ProfessionalCategoryId;
  label: string;
}[] = [
  { id: 'all', label: 'All Photographers' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'pre-wedding', label: 'Pre-Wedding' },
  { id: 'event', label: 'Event' },
  { id: 'portrait', label: 'Portrait' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'product', label: 'Product' },
  { id: 'video', label: 'Video' },
];

export const professionalLocations = [
  'All Locations',
  'Jaipur, Rajasthan',
  'Delhi, NCR',
  'Mumbai, Maharashtra',
  'Bangalore, Karnataka',
  'Indore, MP',
  'Udaipur, Rajasthan',
];

export interface ProfessionalListing extends Photographer {
  specialty: string;
  categoryIds: ProfessionalCategoryId[];
}

export const professionals: ProfessionalListing[] = [
  {
    id: 'ph-01',
    name: 'Harsh Sharma',
    studio: 'Harsh Visuals',
    specialty: 'Wedding Photographer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    coverImage:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&h=560&fit=crop',
    rating: 4.9,
    reviewCount: 256,
    verified: true,
    location: 'Jaipur, Rajasthan',
    startingPrice: 25000,
    categories: ['Wedding', 'Candid'],
    categoryIds: ['wedding', 'pre-wedding'],
  },
  {
    id: 'ph-02',
    name: 'Aditi Films',
    studio: 'Aditi Films',
    specialty: 'Cinematic Photographer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    coverImage:
      'https://images.unsplash.com/photo-1511285560929-80b456fe3b6f?w=900&h=560&fit=crop',
    rating: 4.8,
    reviewCount: 189,
    verified: true,
    location: 'Delhi, NCR',
    startingPrice: 35000,
    categories: ['Wedding', 'Cinema'],
    categoryIds: ['wedding', 'video'],
  },
  {
    id: 'ph-03',
    name: 'Rahul Mehta',
    studio: 'Frame & Focus',
    specialty: 'Portrait Specialist',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    coverImage:
      'https://images.unsplash.com/photo-1537633552985-df8429e804cb?w=900&h=560&fit=crop',
    rating: 4.7,
    reviewCount: 142,
    verified: true,
    location: 'Mumbai, Maharashtra',
    startingPrice: 18000,
    categories: ['Portrait', 'Fashion'],
    categoryIds: ['portrait', 'fashion'],
  },
  {
    id: 'ph-04',
    name: 'Priya Kapoor',
    studio: 'Priya Studios',
    specialty: 'Fashion Photographer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    coverImage:
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&h=560&fit=crop',
    rating: 4.9,
    reviewCount: 312,
    verified: true,
    location: 'Bangalore, Karnataka',
    startingPrice: 28000,
    categories: ['Fashion', 'Editorial'],
    categoryIds: ['fashion', 'portrait'],
  },
  {
    id: 'ph-05',
    name: 'Vikram Singh',
    studio: 'Royal Frames',
    specialty: 'Event Photographer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    coverImage:
      'https://images.unsplash.com/photo-1519225421980-715cb0215a07?w=900&h=560&fit=crop',
    rating: 4.6,
    reviewCount: 98,
    verified: true,
    location: 'Udaipur, Rajasthan',
    startingPrice: 22000,
    categories: ['Event', 'Wedding'],
    categoryIds: ['event', 'wedding'],
  },
  {
    id: 'ph-06',
    name: 'Sneha Patel',
    studio: 'Sneha Captures',
    specialty: 'Pre-Wedding Expert',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    coverImage:
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&h=560&fit=crop',
    rating: 4.8,
    reviewCount: 167,
    verified: true,
    location: 'Indore, MP',
    startingPrice: 20000,
    categories: ['Pre-Wedding', 'Candid'],
    categoryIds: ['pre-wedding'],
  },
  {
    id: 'ph-07',
    name: 'Arjun Desai',
    studio: 'LensCraft Studio',
    specialty: 'Product Photographer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    coverImage:
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=900&h=560&fit=crop',
    rating: 4.5,
    reviewCount: 76,
    verified: true,
    location: 'Mumbai, Maharashtra',
    startingPrice: 15000,
    categories: ['Product', 'Commercial'],
    categoryIds: ['product'],
  },
  {
    id: 'ph-08',
    name: 'Meera Joshi',
    studio: 'Cinema Stories',
    specialty: 'Wedding Videographer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    coverImage:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&h=560&fit=crop',
    rating: 4.9,
    reviewCount: 203,
    verified: true,
    location: 'Delhi, NCR',
    startingPrice: 40000,
    categories: ['Video', 'Wedding'],
    categoryIds: ['video', 'wedding'],
  },
];

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
