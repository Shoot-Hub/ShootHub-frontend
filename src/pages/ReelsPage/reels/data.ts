import creator1 from '@/assets/landing/featured-creator-1.jpg';
import creator2 from '@/assets/landing/featured-creator-2.jpg';
import creator3 from '@/assets/landing/featured-creator-3.jpg';
import creator4 from '@/assets/landing/featured-creator-4.jpg';
import creatorAvatar from '@/assets/landing/creator-avatar-1.jpg';

export type ReelItem = {
  id: string;
  video: string;
  title: string;
  caption: string;
  category: string;
  creator: {
    name: string;
    avatar: string;
    handle: string;
  };
  likes: string;
  comments: string;
  shares: string;
  music: string;
};

export const reelsFeed: ReelItem[] = [
  {
    id: 'reel-1',
    video: '/reels/reel-1.mp4',
    title: 'Golden Hour Vows',
    caption: 'Golden hour vows • cinematic wedding film ✨ Book this look',
    category: 'Wedding Film',
    creator: { name: 'Aria Moore', avatar: creator1, handle: '@aria.shoots' },
    likes: '24.8K',
    comments: '312',
    shares: '1.2K',
    music: 'Original Audio · Aria Moore',
  },
  {
    id: 'reel-2',
    video: '/reels/reel-2.mp4',
    title: 'Coastal Cinemount',
    caption: 'Waves, wind, and endless frames 🌊 Coastal cinema',
    category: 'Cinematic Film',
    creator: { name: 'Kabir Rao', avatar: creator2, handle: '@kabir.films' },
    likes: '18.2K',
    comments: '198',
    shares: '870',
    music: 'Coastal Dreams · Kabir Rao',
  },
  {
    id: 'reel-3',
    video: '/reels/reel-3.mp4',
    title: 'Studio Noir',
    caption: 'Fashion editorial energy in studio noir 🖤',
    category: 'Fashion Editorial',
    creator: { name: 'Ishaan Verma', avatar: creator4, handle: '@ishaan.studio' },
    likes: '31.5K',
    comments: '421',
    shares: '2.1K',
    music: 'Noir Beat · Ishaan Verma',
  },
  {
    id: 'reel-4',
    video: '/reels/reel-4.mp4',
    title: 'Fiery Trails',
    caption: 'Travel stories worth booking 🔥 Destination shoot',
    category: 'Travel Shoot',
    creator: { name: 'Veer Malhotra', avatar: creatorAvatar, handle: '@veer.travels' },
    likes: '12.9K',
    comments: '156',
    shares: '640',
    music: 'Trail Mix · Veer Malhotra',
  },
  {
    id: 'reel-5',
    video: '/reels/reel-5.mp4',
    title: 'Brand Story',
    caption: 'Corporate stories that convert 💼 Book brand films',
    category: 'Corporate Film',
    creator: { name: 'Noor Fatima', avatar: creator3, handle: '@noor.aerial' },
    likes: '9.4K',
    comments: '88',
    shares: '312',
    music: 'Brand Pulse · Noor Fatima',
  },
];
