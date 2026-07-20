import { useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  GalleryHeader, GalleryGrid, GallerySidebar, DownloadToolbar,
  PhotoModal, FaceSearchResult, MobileGalleryBar, GalleryFooter,
} from '../components';
import { useGalleryPhotos, useUploadSelfie, useFaceSearch } from '../hooks';
import { getGalleryShareUrl } from '../data/mockGalleries';
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

  const handleDownload = useCallback((id?: string) => {
    toast.success(id ? 'Downloading photo...' : `Downloading ${selectedCount} photos...`);
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
              view={view}
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

      <PhotoModal
        photos={photos}
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
