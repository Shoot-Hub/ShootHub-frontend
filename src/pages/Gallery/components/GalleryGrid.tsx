import { useEffect, useRef } from 'react';
import { GalleryCard } from './GalleryCard';
import type { Photo } from '../types';
import type { GalleryView } from '../types';

type Props = {
  photos: Photo[];
  view: GalleryView;
  selected: Set<string>;
  onSelect: (id: string) => void;
  onFavorite: (id: string) => void;
  onDownload: (id: string) => void;
  onPreview: (id: string) => void;
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
};

function SkeletonGrid() {
  const heights = [280, 360, 240, 320, 400, 260];
  return (
    <div className="columns-2 gap-3 sm:columns-3 lg:columns-3 xl:columns-4">
      {heights.map((h, i) => (
        <div
          key={i}
          className="mb-3 animate-pulse rounded-[24px] bg-gradient-to-br from-[#F3EEFF] to-[#E8F4FD]"
          style={{ height: h }}
        />
      ))}
    </div>
  );
}

export function GalleryGrid({
  photos, view, selected, onSelect, onFavorite, onDownload, onPreview,
  isLoading, hasNextPage, isFetchingNextPage, onLoadMore,
}: Props) {
  if (isLoading) return <SkeletonGrid />;

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-semibold text-[#111827]">No photos found</p>
        <p className="mt-1 text-sm text-[#636E72]">Try adjusting your filters or search</p>
      </div>
    );
  }

  if (view === 'list') {
    return (
      <div className="space-y-2">
        {photos.map((photo, i) => (
          <GalleryCard
            key={photo.id}
            photo={photo}
            isSelected={selected.has(photo.id)}
            view="list"
            index={i}
            onSelect={() => onSelect(photo.id)}
            onFavorite={() => onFavorite(photo.id)}
            onDownload={() => onDownload(photo.id)}
            onPreview={() => onPreview(photo.id)}
          />
        ))}
        <LoadMoreSentinel isFetching={isFetchingNextPage} hasNext={hasNextPage} onVisible={onLoadMore} />
      </div>
    );
  }

  return (
    <>
      <div className="columns-2 gap-3 sm:columns-3 lg:columns-2 xl:columns-3">
        {photos.map((photo, i) => (
          <GalleryCard
            key={photo.id}
            photo={photo}
            isSelected={selected.has(photo.id)}
            view="grid"
            index={i}
            onSelect={() => onSelect(photo.id)}
            onFavorite={() => onFavorite(photo.id)}
            onDownload={() => onDownload(photo.id)}
            onPreview={() => onPreview(photo.id)}
          />
        ))}
      </div>
      <LoadMoreSentinel isFetching={isFetchingNextPage} hasNext={hasNextPage} onVisible={onLoadMore} />
    </>
  );
}

function LoadMoreSentinel({
  isFetching, hasNext, onVisible,
}: { isFetching: boolean; hasNext: boolean; onVisible: () => void }) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNext) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting && !isFetching) onVisible(); },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNext, isFetching, onVisible]);

  if (!hasNext && !isFetching) return null;
  return (
    <div ref={sentinelRef} className="flex justify-center py-8">
      {isFetching && (
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#6C3BFF] border-t-transparent" />
      )}
    </div>
  );
}
