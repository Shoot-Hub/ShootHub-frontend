import type { Gallery, Photo } from '@/pages/Gallery/types';
import { STORY_QUOTE, TIMELINE_SECTIONS } from '../constants';
import type { TimelineEvent, TimelineSectionId, WeddingStory } from '../types';
import {
  buildCoupleLine,
  deriveCommentCount,
  deriveDownloadCount,
  deriveVideoCount,
  formatDurationFromIndex,
  pickPreviewPhotos,
} from '../utils';

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function matchAlbumId(
  sectionId: TimelineSectionId,
  albums: Gallery['albums'],
): string | undefined {
  const meta = TIMELINE_SECTIONS.find((s) => s.id === sectionId);
  if (!meta) return undefined;

  for (const album of albums) {
    const name = normalize(album.name);
    if (meta.matchKeywords.some((kw) => name.includes(normalize(kw)))) {
      return album.id;
    }
  }
  return undefined;
}

/**
 * Distribute photos across timeline sections when albumIds are missing.
 * Pure client-side — does not touch APIs or upload flow.
 */
function distributePhotos(photos: Photo[], sectionCount: number): Photo[][] {
  const buckets: Photo[][] = Array.from({ length: sectionCount }, () => []);
  if (photos.length === 0) return buckets;

  const sorted = [...photos].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  sorted.forEach((photo, i) => {
    buckets[i % sectionCount].push(photo);
  });
  return buckets;
}

function buildEvent(
  sectionIndex: number,
  photos: Photo[],
  albumId: string | undefined,
): TimelineEvent {
  const meta = TIMELINE_SECTIONS[sectionIndex];
  const favorites = photos.filter((p) => p.isFavorite).length;
  const videos = photos.length > 0 ? deriveVideoCount(photos.length) : 0;
  const coverPhoto = photos[0] ?? null;
  const previewPhotos = pickPreviewPhotos(photos, 4);
  const videoThumb = photos[Math.min(1, photos.length - 1)] ?? coverPhoto;

  return {
    id: meta.id,
    title: meta.title,
    description: meta.description,
    timeLabel: meta.defaultTime,
    icon: meta.icon,
    albumId,
    completed: photos.length > 0,
    stats: {
      photos: photos.length,
      videos,
      favorites,
      downloads: deriveDownloadCount(photos.length, favorites),
      comments: deriveCommentCount(photos.length),
    },
    coverPhoto,
    photos,
    previewPhotos,
    videoPreview:
      videoThumb && photos.length > 0
        ? {
            id: `${meta.id}-reel`,
            title: `${meta.title} Highlights`,
            thumbnailUrl: videoThumb.thumbnailUrl || videoThumb.url,
            durationLabel: formatDurationFromIndex(sectionIndex),
          }
        : null,
  };
}

/**
 * Build a WeddingStory from existing gallery + photo data.
 * Prefer albumId matching; fall back to chronological distribution.
 */
export function buildWeddingStory(gallery: Gallery, photos: Photo[]): WeddingStory {
  const albumMatched = TIMELINE_SECTIONS.map((section) => {
    const albumId = matchAlbumId(section.id, gallery.albums);
    const matched = albumId
      ? photos.filter((p) => p.albumId === albumId)
      : [];
    return { section, albumId, photos: matched };
  });

  const hasAnyAlbumMatch = albumMatched.some((b) => b.photos.length > 0);
  const distributed = hasAnyAlbumMatch
    ? null
    : distributePhotos(photos, TIMELINE_SECTIONS.length);

  const events: TimelineEvent[] = TIMELINE_SECTIONS.map((_section, index) => {
    if (hasAnyAlbumMatch) {
      const bucket = albumMatched[index];
      // If section has album match with 0 photos, try soft redistribute leftovers
      if (bucket.photos.length > 0 || bucket.albumId) {
        return buildEvent(index, bucket.photos, bucket.albumId);
      }
    }
    const fallback = distributed?.[index] ?? [];
    return buildEvent(index, fallback, albumMatched[index]?.albumId);
  });

  // Hide empty sections that never matched — keep completed ones + a few empty for journey feel
  // Show all sections that have photos; for empty ones keep primary journey markers
  const primaryIds = new Set([
    'getting-ready',
    'haldi',
    'mehendi',
    'sangeet',
    'baraat',
    'wedding-ceremony',
    'reception',
    'couple-portrait',
    'behind-the-scenes',
  ]);

  const visibleEvents = events.filter(
    (e) => e.photos.length > 0 || primaryIds.has(e.id),
  );

  const completedCount = visibleEvents.filter((e) => e.completed).length;
  const progressPercent =
    visibleEvents.length === 0
      ? 0
      : Math.round((completedCount / visibleEvents.length) * 100);

  const favorites = photos.filter((p) => p.isFavorite).length;
  const totalVideos = visibleEvents.reduce((sum, e) => sum + e.stats.videos, 0);

  return {
    galleryId: gallery.id,
    slug: gallery.slug,
    hero: {
      title: gallery.name.replace(/\s+Wedding$/i, ''),
      coupleLine: buildCoupleLine(gallery.name),
      quote: gallery.description?.split('.')[0]
        ? `${gallery.description.split('.')[0].trim()}.`
        : STORY_QUOTE,
      date: gallery.eventDate,
      location: gallery.location,
      coverImage: gallery.coverImage,
      photographerName: gallery.photographer.name,
      photographerAvatar: gallery.photographer.avatar,
    },
    totals: {
      photos: gallery.photoCount || photos.length,
      videos: totalVideos || deriveVideoCount(photos.length),
      favorites,
      downloads: deriveDownloadCount(gallery.photoCount || photos.length, favorites),
    },
    events: visibleEvents,
    progressPercent,
    completedCount,
  };
}
