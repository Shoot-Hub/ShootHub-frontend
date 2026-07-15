import type { CreatorTheme } from '@/pages/LandingPage/landing/FeaturedCreators/FeaturedCreatorCard';

import creator1 from '@/assets/landing/featured-creator-1.jpg';
import creator2 from '@/assets/landing/featured-creator-2.jpg';
import creator3 from '@/assets/landing/featured-creator-3.jpg';
import creator4 from '@/assets/landing/featured-creator-4.jpg';
import heroPhoto from '@/assets/landing/hero-photographer.png';
import heroWedding from '@/assets/landing/hero-wedding.png';
import heroDrone from '@/assets/landing/hero-drone.png';
import avatar1 from '@/assets/landing/creator-avatar-1.jpg';

export type CreatorProfile = {
  id: string;
  name: string;
  title: string;
  rating: number;
  experience: string;
  price: string;
  priceValue: number;
  image: string;
  theme: CreatorTheme;
  alt: string;
  city: string;
  category: string;
  verified: boolean;
  topRated?: boolean;
};

/** Normalize for matching "Pre Wedding" ↔ "Pre-Wedding" */
export function normalizeCategory(value: string) {
  return value.toLowerCase().replace(/[-_\s]+/g, '');
}

export const creatorCategories = [
  'All Categories',
  'Wedding',
  'Pre Wedding',
  'Birthday',
  'Maternity',
  'Fashion',
  'Corporate',
  'Product',
  'Food',
  'Travel',
  'Drone',
  'Real Estate',
  'Event',
  'Wildlife',
  'Sports',
] as const;

export const creatorCities = [
  'All Cities',
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Goa',
  'Chennai',
] as const;

function c(
  partial: Omit<CreatorProfile, 'verified'> & { verified?: boolean },
): CreatorProfile {
  return { verified: true, ...partial };
}

export const creatorsData: CreatorProfile[] = [
  c({
    id: 'aria-moore',
    name: 'Aria Moore',
    title: 'Wedding & Editorial Photographer',
    rating: 4.98,
    experience: '9 yrs exp',
    price: '₹65,000',
    priceValue: 65000,
    image: creator1,
    theme: 'purple',
    alt: 'Aria Moore',
    city: 'Mumbai',
    category: 'Wedding',
    topRated: true,
  }),
  c({
    id: 'meher-das',
    name: 'Meher Das',
    title: 'Destination Wedding Specialist',
    rating: 4.94,
    experience: '8 yrs exp',
    price: '₹78,000',
    priceValue: 78000,
    image: heroWedding,
    theme: 'purple',
    alt: 'Meher Das',
    city: 'Goa',
    category: 'Wedding',
  }),
  c({
    id: 'kabir-rao',
    name: 'Kabir Rao',
    title: 'Pre-Wedding Cinematic Films',
    rating: 4.91,
    experience: '6 yrs exp',
    price: '₹42,000',
    priceValue: 42000,
    image: creator2,
    theme: 'teal',
    alt: 'Kabir Rao',
    city: 'Delhi',
    category: 'Pre Wedding',
    topRated: true,
  }),
  c({
    id: 'sana-ali',
    name: 'Sana Ali',
    title: 'Romantic Pre-Wedding Shoots',
    rating: 4.88,
    experience: '5 yrs exp',
    price: '₹35,000',
    priceValue: 35000,
    image: heroWedding,
    theme: 'teal',
    alt: 'Sana Ali',
    city: 'Mumbai',
    category: 'Pre Wedding',
  }),
  c({
    id: 'joy-fernandes',
    name: 'Joy Fernandes',
    title: 'Birthday & Celebration Coverage',
    rating: 4.82,
    experience: '4 yrs exp',
    price: '₹12,000',
    priceValue: 12000,
    image: creator4,
    theme: 'orange',
    alt: 'Joy Fernandes',
    city: 'Bangalore',
    category: 'Birthday',
  }),
  c({
    id: 'riya-sen',
    name: 'Riya Sen',
    title: 'Maternity & Baby Photographer',
    rating: 4.89,
    experience: '7 yrs exp',
    price: '₹28,000',
    priceValue: 28000,
    image: heroPhoto,
    theme: 'purple',
    alt: 'Riya Sen',
    city: 'Pune',
    category: 'Maternity',
  }),
  c({
    id: 'ishaan-verma',
    name: 'Ishaan Verma',
    title: 'Fashion & Portrait Studio',
    rating: 4.95,
    experience: '11 yrs exp',
    price: '₹54,000',
    priceValue: 54000,
    image: creator4,
    theme: 'orange',
    alt: 'Ishaan Verma',
    city: 'Mumbai',
    category: 'Fashion',
    topRated: true,
  }),
  c({
    id: 'anaya-khan',
    name: 'Anaya Khan',
    title: 'Corporate & Brand Photographer',
    rating: 4.76,
    experience: '8 yrs exp',
    price: '₹45,000',
    priceValue: 45000,
    image: creator2,
    theme: 'dark',
    alt: 'Anaya Khan',
    city: 'Delhi',
    category: 'Corporate',
  }),
  c({
    id: 'dev-nair',
    name: 'Dev Nair',
    title: 'Product & E-commerce Shoots',
    rating: 4.84,
    experience: '5 yrs exp',
    price: '₹22,000',
    priceValue: 22000,
    image: heroPhoto,
    theme: 'teal',
    alt: 'Dev Nair',
    city: 'Hyderabad',
    category: 'Product',
  }),
  c({
    id: 'chef-lens',
    name: 'Priya Menon',
    title: 'Food & Restaurant Photographer',
    rating: 4.79,
    experience: '6 yrs exp',
    price: '₹18,000',
    priceValue: 18000,
    image: avatar1,
    theme: 'orange',
    alt: 'Priya Menon',
    city: 'Chennai',
    category: 'Food',
  }),
  c({
    id: 'veer-malhotra',
    name: 'Veer Malhotra',
    title: 'Travel & Lifestyle Creator',
    rating: 4.92,
    experience: '6 yrs exp',
    price: '₹48,000',
    priceValue: 48000,
    image: avatar1,
    theme: 'orange',
    alt: 'Veer Malhotra',
    city: 'Goa',
    category: 'Travel',
    topRated: true,
  }),
  c({
    id: 'noor-fatima',
    name: 'Noor Fatima',
    title: 'Drone & Aerial Specialist',
    rating: 4.87,
    experience: '4 yrs exp',
    price: '₹38,000',
    priceValue: 38000,
    image: creator3,
    theme: 'dark',
    alt: 'Noor Fatima',
    city: 'Bangalore',
    category: 'Drone',
  }),
  c({
    id: 'arjun-estate',
    name: 'Arjun Shah',
    title: 'Real Estate & Interior Shoots',
    rating: 4.73,
    experience: '5 yrs exp',
    price: '₹25,000',
    priceValue: 25000,
    image: heroDrone,
    theme: 'teal',
    alt: 'Arjun Shah',
    city: 'Mumbai',
    category: 'Real Estate',
  }),
  c({
    id: 'event-nova',
    name: 'Neha Kapoor',
    title: 'Events & Launch Coverage',
    rating: 4.85,
    experience: '7 yrs exp',
    price: '₹40,000',
    priceValue: 40000,
    image: creator1,
    theme: 'purple',
    alt: 'Neha Kapoor',
    city: 'Delhi',
    category: 'Event',
  }),
  c({
    id: 'wild-lens',
    name: 'Rohan Bedi',
    title: 'Wildlife & Nature Photographer',
    rating: 4.9,
    experience: '10 yrs exp',
    price: '₹55,000',
    priceValue: 55000,
    image: creator3,
    theme: 'dark',
    alt: 'Rohan Bedi',
    city: 'Goa',
    category: 'Wildlife',
  }),
  c({
    id: 'sports-frame',
    name: 'Kabir Gill',
    title: 'Sports & Action Photographer',
    rating: 4.81,
    experience: '6 yrs exp',
    price: '₹32,000',
    priceValue: 32000,
    image: heroPhoto,
    theme: 'orange',
    alt: 'Kabir Gill',
    city: 'Bangalore',
    category: 'Sports',
  }),
];

export const creatorsFAQ = [
  {
    question: 'How do I book a creator?',
    answer:
      'Open a profile from your category, check packages, then send a booking request on ShootHub.',
  },
  {
    question: 'Are all creators verified?',
    answer:
      'Yes. Verified creators pass identity and portfolio review before going live.',
  },
  {
    question: 'Can I switch categories?',
    answer:
      'Use the Category filter anytime, or go back to Categories and open View Creators again.',
  },
] as const;
