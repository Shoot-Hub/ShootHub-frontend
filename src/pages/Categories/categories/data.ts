import {
  Baby,
  Briefcase,
  Camera,
  Crop,
  Drone,
  Gift,
  Heart,
  Home,
  Mountain,
  PartyPopper,
  Shirt,
  Trophy,
  TreePine,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';

import weddingImg from '@/assets/landing/categories/wedding.jpg';
import preWeddingImg from '@/assets/landing/hero-wedding.png';
import birthdayImg from '@/assets/landing/categories/birthday.jpg';
import corporateImg from '@/assets/landing/categories/corporate.jpg';
import fashionImg from '@/assets/landing/categories/fashion.jpg';
import droneImg from '@/assets/landing/categories/drone.jpg';
import foodImg from '@/assets/landing/categories/food.jpg';
import travelImg from '@/assets/landing/categories/travel.jpg';
import babyShootImg from '@/assets/landing/categories/baby-shoot.jpg';
import portraitImg from '@/assets/landing/categories/portrait.jpg';
import heroPhotographer from '@/assets/landing/hero-photographer.png';
import featured1 from '@/assets/landing/featured-creator-1.jpg';
import featured2 from '@/assets/landing/featured-creator-2.jpg';
import featured3 from '@/assets/landing/featured-creator-3.jpg';

export type CategoryItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
  alt: string;
  startingPrice: number;
  creators: number;
  rating: number;
  city: string;
  popular?: boolean;
  trending?: boolean;
  featured?: boolean;
  recentlyAdded?: boolean;
};

export const categoriesData: CategoryItem[] = [
  {
    id: 'wedding',
    title: 'Wedding',
    description: 'Magical ceremonies captured with heart and detail.',
    image: weddingImg,
    icon: Heart,
    alt: 'Indian wedding couple',
    startingPrice: 25000,
    creators: 1840,
    rating: 4.9,
    city: 'All India',
    popular: true,
    featured: true,
  },
  {
    id: 'pre-wedding',
    title: 'Pre Wedding',
    description: 'Cinematic love stories before the big day.',
    image: preWeddingImg,
    icon: Crop,
    alt: 'Pre-wedding couple shoot',
    startingPrice: 12000,
    creators: 1320,
    rating: 4.8,
    city: 'All India',
    trending: true,
    featured: true,
  },
  {
    id: 'birthday',
    title: 'Birthday',
    description: 'Celebrate every milestone with joyful frames.',
    image: birthdayImg,
    icon: Gift,
    alt: 'Birthday celebration',
    startingPrice: 5000,
    creators: 980,
    rating: 4.7,
    city: 'All India',
    popular: true,
  },
  {
    id: 'maternity',
    title: 'Maternity',
    description: 'Soft, intimate portraits of motherhood.',
    image: babyShootImg,
    icon: Baby,
    alt: 'Maternity photoshoot',
    startingPrice: 8000,
    creators: 640,
    rating: 4.9,
    city: 'All India',
    trending: true,
    recentlyAdded: true,
  },
  {
    id: 'fashion',
    title: 'Fashion',
    description: 'Editorial looks with attitude and style.',
    image: fashionImg,
    icon: Shirt,
    alt: 'Fashion portrait',
    startingPrice: 15000,
    creators: 720,
    rating: 4.8,
    city: 'All India',
    featured: true,
  },
  {
    id: 'corporate',
    title: 'Corporate',
    description: 'Professional portraits and brand storytelling.',
    image: corporateImg,
    icon: Briefcase,
    alt: 'Corporate photography',
    startingPrice: 10000,
    creators: 890,
    rating: 4.7,
    city: 'All India',
    popular: true,
  },
  {
    id: 'product',
    title: 'Product',
    description: 'Clean product shots that convert browsers to buyers.',
    image: portraitImg,
    icon: Camera,
    alt: 'Product photography',
    startingPrice: 6000,
    creators: 540,
    rating: 4.8,
    city: 'All India',
    recentlyAdded: true,
  },
  {
    id: 'food',
    title: 'Food',
    description: 'Mouth-watering frames for menus and brands.',
    image: foodImg,
    icon: UtensilsCrossed,
    alt: 'Food photography',
    startingPrice: 7000,
    creators: 410,
    rating: 4.6,
    city: 'All India',
  },
  {
    id: 'travel',
    title: 'Travel',
    description: 'Destination stories worth remembering forever.',
    image: travelImg,
    icon: Mountain,
    alt: 'Travel landscape',
    startingPrice: 18000,
    creators: 560,
    rating: 4.8,
    city: 'All India',
    trending: true,
  },
  {
    id: 'drone',
    title: 'Drone',
    description: 'Aerial perspectives that leave an impact.',
    image: droneImg,
    icon: Drone,
    alt: 'Drone aerial shot',
    startingPrice: 9000,
    creators: 380,
    rating: 4.7,
    city: 'All India',
    popular: true,
  },
  {
    id: 'real-estate',
    title: 'Real Estate',
    description: 'Spaces sold through light, angles, and polish.',
    image: featured1,
    icon: Home,
    alt: 'Real estate interior',
    startingPrice: 8000,
    creators: 320,
    rating: 4.6,
    city: 'All India',
    recentlyAdded: true,
  },
  {
    id: 'event',
    title: 'Event',
    description: 'Conferences, launches, and gatherings covered live.',
    image: featured2,
    icon: PartyPopper,
    alt: 'Event photography',
    startingPrice: 12000,
    creators: 750,
    rating: 4.7,
    city: 'All India',
    featured: true,
  },
  {
    id: 'wildlife',
    title: 'Wildlife',
    description: 'Nature captured with patience and precision.',
    image: featured3,
    icon: TreePine,
    alt: 'Wildlife photography',
    startingPrice: 20000,
    creators: 180,
    rating: 4.9,
    city: 'All India',
    trending: true,
  },
  {
    id: 'sports',
    title: 'Sports',
    description: 'Peak action frozen in crystal-clear frames.',
    image: heroPhotographer,
    icon: Trophy,
    alt: 'Sports photography',
    startingPrice: 15000,
    creators: 290,
    rating: 4.7,
    city: 'All India',
    recentlyAdded: true,
  },
];
