import type {
  AlbumType,
  AlbumSize,
  AlbumOrientation,
  CoverType,
  AlbumFilterKey,
  AlbumSortKey,
} from '../types';

export const ALBUM_TYPES: { value: AlbumType; label: string }[] = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'pre_wedding', label: 'Pre Wedding' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'baby_shoot', label: 'Baby Shoot' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'travel', label: 'Travel' },
  { value: 'custom', label: 'Custom' },
];

export const ALBUM_SIZES: { value: AlbumSize; label: string }[] = [
  { value: '8x12', label: '8×12' },
  { value: '10x10', label: '10×10' },
  { value: '12x18', label: '12×18' },
  { value: '14x14', label: '14×14' },
  { value: 'custom', label: 'Custom' },
];

export const ORIENTATIONS: { value: AlbumOrientation; label: string }[] = [
  { value: 'landscape', label: 'Landscape' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'square', label: 'Square' },
];

export const COVER_TYPES: { value: CoverType; label: string }[] = [
  { value: 'glossy', label: 'Glossy' },
  { value: 'matte', label: 'Matte' },
  { value: 'premium', label: 'Premium' },
];

export const MOCK_CLIENTS = [
  'Rohit Sharma & Priya Sharma',
  'Ananya Gupta',
  'Rahul Mehta',
  'Sneha Kapoor',
  'Aarav Patel',
  'TechCorp HR',
];

export const MOCK_BOOKINGS = [
  { id: 'bk-1', label: 'Wedding — Udaipur Palace (May 20)' },
  { id: 'bk-2', label: 'Birthday — Mumbai Studio (Apr 12)' },
  { id: 'bk-3', label: 'Portraits — Family Session (Mar 8)' },
  { id: 'bk-4', label: 'Corporate — TechCorp Headshots (Feb 15)' },
  { id: 'bk-5', label: 'Baby Shower — Delhi (Jan 22)' },
];

export const MOCK_EVENTS = [
  'Ceremony',
  'Reception',
  'Haldi',
  'Mehendi',
  'Engagement Party',
  'Birthday Bash',
  'Corporate Event',
  'Destination Shoot',
  'Studio Session',
];

export const FILTER_OPTIONS: { value: AlbumFilterKey; label: string }[] = [
  { value: 'all', label: 'All Albums' },
  { value: 'draft', label: 'Drafts' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export const SORT_OPTIONS: { value: AlbumSortKey; label: string }[] = [
  { value: 'updated', label: 'Last Updated' },
  { value: 'created', label: 'Date Created' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'status', label: 'Status' },
];

export const DEFAULT_PAGE_COUNT = 12;
export const MIN_PAGE_COUNT = 4;
export const MAX_PAGE_COUNT = 80;

export const FONT_FAMILIES = [
  'Plus Jakarta Sans',
  'Georgia',
  'Playfair Display',
  'Cormorant Garamond',
  'Montserrat',
  'Lora',
  'Caveat',
];

export const STORAGE_KEY = 'shoothub.album-designer.albums.v1';
