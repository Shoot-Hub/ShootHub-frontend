import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAlbumPhotoCatalog } from '../services';
import type { AlbumPhoto } from '../types';

export type PhotoFilterMode = 'all' | 'favorites' | 'face' | 'rating' | 'date';

type Options = {
  search: string;
  filter: PhotoFilterMode;
  minRating?: number;
  dateFrom?: string;
  dateTo?: string;
};

export function useAlbumPhotoLibrary(options: Options) {
  const { search, filter, minRating = 4, dateFrom, dateTo } = options;
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const query = useQuery({
    queryKey: ['album-designer-photos'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return getAlbumPhotoCatalog(48);
    },
    staleTime: 60_000,
  });

  const photos = useMemo(() => {
    let list: AlbumPhoto[] = query.data ?? [];

    if (filter === 'favorites') list = list.filter((p) => p.isFavorite);
    if (filter === 'face') list = list.filter((p) => p.tags?.includes('face'));
    if (filter === 'rating') list = list.filter((p) => p.rating >= minRating);
    if (filter === 'date') {
      list = list.filter((p) => {
        const t = new Date(p.createdAt).getTime();
        if (dateFrom && t < new Date(dateFrom).getTime()) return false;
        if (dateTo && t > new Date(dateTo).getTime()) return false;
        return true;
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.filename.toLowerCase().includes(q));
    }

    return list;
  }, [query.data, filter, search, minRating, dateFrom, dateTo]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(photos.map((p) => p.id)));
  const clear = () => setSelected(new Set());

  return {
    photos,
    isLoading: query.isLoading,
    selected,
    selectedCount: selected.size,
    toggle,
    selectAll,
    clear,
    setSelected,
  };
}
