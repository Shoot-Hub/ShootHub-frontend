import weddingImg from '@/assets/landing/categories/wedding.jpg';
import birthdayImg from '@/assets/landing/categories/birthday.jpg';
import portraitImg from '@/assets/landing/categories/portrait.jpg';
import corporateImg from '@/assets/landing/categories/corporate.jpg';
import fashionImg from '@/assets/landing/categories/fashion.jpg';
import travelImg from '@/assets/landing/categories/travel.jpg';
import babyShootImg from '@/assets/landing/categories/baby-shoot.jpg';
import preWeddingImg from '@/assets/landing/categories/pre-wedding.jpg';
import featured1 from '@/assets/landing/featured-creator-1.jpg';
import featured2 from '@/assets/landing/featured-creator-2.jpg';
import featured3 from '@/assets/landing/featured-creator-3.jpg';
import featured4 from '@/assets/landing/featured-creator-4.jpg';
import heroWedding from '@/assets/landing/hero-wedding.png';
import heroPhoto from '@/assets/landing/hero-photographer.png';
import type { AlbumPhoto } from '../types';

/**
 * Local photo catalog for Album Designer.
 * Mirrors uploaded gallery imagery without calling or mutating gallery APIs.
 */
const SOURCES = [
  weddingImg,
  birthdayImg,
  portraitImg,
  corporateImg,
  fashionImg,
  travelImg,
  babyShootImg,
  preWeddingImg,
  featured1,
  featured2,
  featured3,
  featured4,
  heroWedding,
  heroPhoto,
];

const ASPECTS = [
  { w: 1600, h: 1067 },
  { w: 1200, h: 1600 },
  { w: 1600, h: 1600 },
  { w: 1600, h: 900 },
];

export function getAlbumPhotoCatalog(count = 48): AlbumPhoto[] {
  return Array.from({ length: count }, (_, i) => {
    const aspect = ASPECTS[i % ASPECTS.length];
    const src = SOURCES[i % SOURCES.length];
    return {
      id: `album-photo-${i + 1}`,
      url: src,
      thumbnailUrl: src,
      filename: `IMG_${String(i + 1).padStart(4, '0')}.jpg`,
      width: aspect.w,
      height: aspect.h,
      isFavorite: i % 7 === 0,
      rating: (i % 5) + 1,
      createdAt: new Date(2024, 4, 20 - (i % 40)).toISOString(),
      galleryId: 'local-uploads',
      tags: i % 3 === 0 ? ['face'] : undefined,
    };
  });
}
