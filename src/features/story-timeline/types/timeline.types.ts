import type { Photo } from '@/pages/Gallery/types';

/** Canonical wedding journey section ids — order is chronological. */
export type TimelineSectionId =
  | 'getting-ready'
  | 'bride-makeup'
  | 'groom-preparation'
  | 'haldi'
  | 'mehendi'
  | 'sangeet'
  | 'baraat'
  | 'wedding-ceremony'
  | 'varmala'
  | 'pheras'
  | 'sindoor'
  | 'vidaai'
  | 'reception'
  | 'couple-portrait'
  | 'family-portrait'
  | 'behind-the-scenes';

export type TimelineSectionMeta = {
  id: TimelineSectionId;
  title: string;
  description: string;
  defaultTime: string;
  icon: string;
  /** Keywords used to match gallery album names client-side */
  matchKeywords: string[];
};

export type EventStats = {
  photos: number;
  videos: number;
  favorites: number;
  downloads: number;
  comments: number;
};

export type TimelineVideoPreview = {
  id: string;
  title: string;
  thumbnailUrl: string;
  durationLabel: string;
  /** Optional future: real video URL from gallery assets */
  videoUrl?: string;
};

export type TimelineEvent = {
  id: TimelineSectionId;
  title: string;
  description: string;
  timeLabel: string;
  icon: string;
  stats: EventStats;
  coverPhoto: Photo | null;
  photos: Photo[];
  previewPhotos: Photo[];
  videoPreview: TimelineVideoPreview | null;
  albumId?: string;
  completed: boolean;
};

export type StoryHero = {
  title: string;
  coupleLine: string;
  quote: string;
  date: string;
  location: string;
  coverImage: string;
  photographerName: string;
  photographerAvatar: string;
};

export type StoryTotals = {
  photos: number;
  videos: number;
  favorites: number;
  downloads: number;
};

export type WeddingStory = {
  galleryId: string;
  slug: string;
  hero: StoryHero;
  totals: StoryTotals;
  events: TimelineEvent[];
  progressPercent: number;
  completedCount: number;
};

/** Future-ready hooks for AI / narration / sharing */
export type StoryFutureCapabilities = {
  aiStoryEnabled: boolean;
  voiceNarrationEnabled: boolean;
  autoAlbumEnabled: boolean;
  autoReelEnabled: boolean;
  clientCommentsEnabled: boolean;
  timelineSharingEnabled: boolean;
};
