import { useCallback, useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { generateMockPhotos } from '../data/mockGalleries';
import type { GalleryFilter, GallerySort } from '../types';
import type { Photo } from '../types';

const PAGE_SIZE = 24;

type UseGalleryPhotosOptions = {
  galleryId: string;
  totalCount: number;
  sort: GallerySort;
  filter: GalleryFilter;
  search: string;
  matchedIds?: string[] | null;
};

function filterPhotos(
  photos: Photo[],
  filter: GalleryFilter,
  search: string,
  selected: Set<string>,
  matchedIds: string[] | null | undefined,
) {
  let result = photos;

  if (matchedIds) {
    result = result.filter((p) => matchedIds.includes(p.id));
  }

  if (filter === 'favorites') {
    result = result.filter((p) => p.isFavorite);
  } else if (filter === 'selected') {
    result = result.filter((p) => selected.has(p.id));
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter((p) => p.filename.toLowerCase().includes(q));
  }

  return result;
}

function sortPhotos(photos: Photo[], sort: GallerySort) {
  const copy = [...photos];
  switch (sort) {
    case 'oldest':
      return copy.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case 'name':
      return copy.sort((a, b) => a.filename.localeCompare(b.filename));
    case 'favorite':
      return copy.sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite));
    default:
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

export function useGalleryPhotos({
  galleryId,
  totalCount,
  sort,
  filter,
  search,
  matchedIds,
}: UseGalleryPhotosOptions) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const allPhotosQuery = useInfiniteQuery({
    queryKey: ['gallery-photos', galleryId],
    queryFn: async ({ pageParam = 0 }) => {
      await new Promise((r) => setTimeout(r, 300));
      const all = generateMockPhotos(galleryId, Math.min(totalCount, 96));
      const start = pageParam * PAGE_SIZE;
      return all.slice(start, start + PAGE_SIZE);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.length < PAGE_SIZE ? undefined : lastPageParam + 1,
    enabled: Boolean(galleryId),
  });

  const photos = useMemo(() => {
    const flat = (allPhotosQuery.data?.pages.flat() ?? []).map((p) => ({
      ...p,
      isFavorite: favorites.has(p.id) || p.isFavorite,
    }));
    const filtered = filterPhotos(flat, filter, search, selected, matchedIds);
    return sortPhotos(filtered, sort);
  }, [allPhotosQuery.data, filter, search, selected, matchedIds, sort, favorites]);

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected(new Set(photos.map((p) => p.id)));
  }, [photos]);

  const deselectAll = useCallback(() => setSelected(new Set()), []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return {
    photos,
    selected,
    selectedCount: selected.size,
    toggleSelect,
    selectAll,
    deselectAll,
    toggleFavorite,
    isLoading: allPhotosQuery.isLoading,
    isFetchingNextPage: allPhotosQuery.isFetchingNextPage,
    hasNextPage: allPhotosQuery.hasNextPage,
    fetchNextPage: allPhotosQuery.fetchNextPage,
  };
}
