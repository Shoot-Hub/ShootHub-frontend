import { useState, useCallback, useRef, useMemo } from 'react';
import toast from 'react-hot-toast';
import { StoryTimelinePage } from '@/features/story-timeline';
import {
  GalleryHeader, GalleryGrid, GallerySidebar, DownloadToolbar,
  PhotoModal, FaceSearchResult, MobileGalleryBar, GalleryFooter,
} from '../components';
import { useGalleryPhotos, useUploadSelfie, useFaceSearch } from '../hooks';
import { generateMockPhotos, getGalleryShareUrl } from '../data/mockGalleries';
import type { Gallery, GalleryFilter, GallerySort, GalleryView } from '../types';

type Props = { gallery: Gallery };

export function GalleryViewerPage({ gallery }: Props) {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<GalleryView>('grid');
  const [sort, setSort] = useState<GallerySort>('newest');
  const [filter, setFilter] = useState<GalleryFilter>('all');
  const [modalPhotoId, setModalPhotoId] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const selfie = useUploadSelfie();
  const faceSearch = useFaceSearch(gallery.id);
  const matchedIds = faceSearch.result.status === 'complete' ? faceSearch.result.matchedPhotoIds : null;

  const {
    photos, selected, selectedCount, toggleSelect, selectAll, deselectAll,
    toggleFavorite, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage,
  } = useGalleryPhotos({
    galleryId: gallery.id,
    totalCount: gallery.photoCount,
    sort, filter, search, matchedIds,
  });

  const favoriteCount = photos.filter((p) => p.isFavorite).length;
  const shareUrl = getGalleryShareUrl(gallery.slug);

  /** Full photo set for story timeline (client-side mock — no API change) */
  const storyPhotos = useMemo(() => {
    const base = generateMockPhotos(gallery.id, Math.min(gallery.photoCount, 96));
    const favMap = new Map(photos.map((p) => [p.id, p.isFavorite]));
    return base.map((p) => ({
      ...p,
      isFavorite: favMap.get(p.id) ?? p.isFavorite,
    }));
  }, [gallery.id, gallery.photoCount, photos]);

  const handleDownload = useCallback((id?: string) => {
    toast.success(id ? 'Downloading photo...' : `Downloading ${selectedCount || 'gallery'} photos...`);
  }, [selectedCount]);

  const handleShare = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Gallery link copied!');
  };

  const handleSelfieUpload = async (file: File) => {
    const preview = await selfie.upload(file);
    await faceSearch.runSearch(preview);
  };

  const scrollToSelfie = () => sidebarRef.current?.scrollIntoView({ behavior: 'smooth' });

  const modalPhotos = view === 'story' ? storyPhotos : photos;

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-24 lg:pb-0">
      <GalleryHeader
        gallery={gallery}
        search={search}
        onSearchChange={setSearch}
        view={view}
        onViewChange={setView}
        sort={sort}
        onSortChange={setSort}
        filter={filter}
        onFilterChange={setFilter}
        onShare={handleShare}
        favoriteCount={favoriteCount}
      />

      {view === 'story' ? (
        <StoryTimelinePage
          gallery={gallery}
          photos={storyPhotos}
          onPhotoPreview={setModalPhotoId}
          onShare={handleShare}
          onDownload={() => handleDownload()}
          onFaceSearch={() => {
            setView('grid');
            window.setTimeout(() => scrollToSelfie(), 120);
          }}
          onFavorites={() => {
            setFilter('favorites');
            setView('grid');
          }}
          onExitStory={() => setView('grid')}
        />
      ) : (
        <>
          <DownloadToolbar
            selectedCount={selectedCount}
            totalVisible={photos.length}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
            onDownloadSelected={() => handleDownload()}
            onShare={handleShare}
            shareUrl={shareUrl}
          />

          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <FaceSearchResult
              result={faceSearch.result}
              onDownloadMatched={() => handleDownload()}
              onClear={() => { faceSearch.reset(); selfie.reset(); }}
            />

            <div className="flex gap-6">
              <div className="min-w-0 flex-1">
                <GalleryGrid
                  photos={photos}
                  view={view === 'list' ? 'list' : 'grid'}
                  selected={selected}
                  onSelect={toggleSelect}
                  onFavorite={toggleFavorite}
                  onDownload={(id) => handleDownload(id)}
                  onPreview={setModalPhotoId}
                  isLoading={isLoading}
                  hasNextPage={hasNextPage ?? false}
                  isFetchingNextPage={isFetchingNextPage}
                  onLoadMore={() => fetchNextPage()}
                />
              </div>

              <div ref={sidebarRef} className="hidden w-80 shrink-0 xl:block">
                <div className="sticky top-36">
                  <GallerySidebar
                    gallery={gallery}
                    uploadProps={{
                      progress: selfie.progress,
                      preview: selfie.preview,
                      status: selfie.status,
                      aiStatus: faceSearch.result.status,
                      onUpload: handleSelfieUpload,
                      onReset: () => { selfie.reset(); faceSearch.reset(); },
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 xl:hidden">
              <GallerySidebar
                gallery={gallery}
                uploadProps={{
                  progress: selfie.progress,
                  preview: selfie.preview,
                  status: selfie.status,
                  aiStatus: faceSearch.result.status,
                  onUpload: handleSelfieUpload,
                  onReset: () => { selfie.reset(); faceSearch.reset(); },
                }}
              />
            </div>
          </div>

          <GalleryFooter />

          <MobileGalleryBar
            selectedCount={selectedCount}
            onDownload={() => handleDownload()}
            onUploadSelfie={scrollToSelfie}
          />
        </>
      )}

      {/* Face search target when in story mode */}
      {view === 'story' ? (
        <div ref={sidebarRef} className="sr-only" aria-hidden="true" />
      ) : null}

      <PhotoModal
        photos={modalPhotos}
        currentId={modalPhotoId}
        isOpen={Boolean(modalPhotoId)}
        onClose={() => setModalPhotoId(null)}
        onNavigate={setModalPhotoId}
        onFavorite={toggleFavorite}
        onDownload={(id) => handleDownload(id)}
      />
    </div>
  );
}
