import { useQuery } from '@tanstack/react-query';
import { MOCK_GALLERIES } from '../data/mockGalleries';
import type { Gallery } from '../types';

const UNLOCK_KEY = (slug: string) => `shoothub-gallery-unlock-${slug}`;

function safeSessionGet(key: string) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSessionSet(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Ignore storage failures (private mode / blocked storage).
  }
}

export function isGalleryUnlocked(slug: string) {
  return safeSessionGet(UNLOCK_KEY(slug)) === 'true';
}

export function unlockGallery(slug: string) {
  safeSessionSet(UNLOCK_KEY(slug), 'true');
}

export function useGallery(slug: string | undefined) {
  return useQuery({
    queryKey: ['gallery', slug],
    queryFn: async (): Promise<Gallery | null> => {
      await new Promise((r) => setTimeout(r, 400));
      if (!slug) return null;
      return MOCK_GALLERIES[slug] ?? null;
    },
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });
}

export function verifyGalleryPassword(gallery: Gallery, password: string) {
  return gallery.password === password;
}
