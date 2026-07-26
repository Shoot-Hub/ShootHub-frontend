import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Gallery, Photo } from '@/pages/Gallery/types';
import {
  CoupleSummaryCard,
  MobileBottomNav,
  MobileTimelineChips,
  StickyTimelineNav,
  StoryFeatureCards,
  StoryHeroBanner,
  StoryProgressCard,
  TimelineEventCard,
} from '../components';
import { useActiveTimelineSection, useWeddingStory } from '../hooks';
import type { TimelineEvent } from '../types';

type Props = {
  gallery: Gallery;
  photos: Photo[];
  onPhotoPreview: (photoId: string) => void;
  onShare: () => void;
  onDownload: () => void;
  onFaceSearch: () => void;
  onFavorites: () => void;
  onExitStory?: () => void;
};

export function StoryTimelinePage({
  gallery,
  photos,
  onPhotoPreview,
  onShare,
  onDownload,
  onFaceSearch,
  onFavorites,
  onExitStory,
}: Props) {
  const story = useWeddingStory(gallery, photos);
  const sectionIds = useMemo(() => story.events.map((e) => e.id), [story.events]);
  const { activeId, scrollToSection } = useActiveTimelineSection(sectionIds);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [favoriteStory, setFavoriteStory] = useState(false);

  const visibleEvents = showAllEvents ? story.events : story.events.slice(0, 6);
  const hasMore = story.events.length > 6;

  const handleViewAll = (event: TimelineEvent) => {
    if (event.photos[0]) {
      onPhotoPreview(event.photos[0].id);
      return;
    }
    toast('No photos in this chapter yet');
  };

  const handlePlayReel = (event: TimelineEvent) => {
    if (event.photos[0]) {
      onPhotoPreview(event.photos[0].id);
      toast.success(`${event.title} highlight reel`);
      return;
    }
    toast('Reel coming soon');
  };

  const handleCreateAlbum = () => {
    toast('Album designer — coming soon from Story Timeline');
  };

  const handleReels = () => {
    const firstWithReel = story.events.find((e) => e.videoPreview);
    if (firstWithReel) handlePlayReel(firstWithReel);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-24 lg:pb-10">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {onExitStory ? (
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6C3BFF]">
                ShootHub Gallery
              </p>
              <h2 className="text-lg font-extrabold text-[#111827]">Wedding Story Timeline</h2>
            </div>
            <button
              type="button"
              onClick={onExitStory}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#EEF0F4] bg-white px-3.5 py-2 text-sm font-semibold text-[#636E72] transition hover:bg-[#F3EEFF] hover:text-[#6C3BFF]"
            >
              <X className="h-4 w-4" />
              Grid view
            </button>
          </div>
        ) : null}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Sticky sidebar — desktop */}
          <aside className="hidden w-[280px] shrink-0 lg:block">
            <div className="sticky top-28 space-y-4">
              <StickyTimelineNav
                events={story.events}
                activeId={activeId}
                onSelect={scrollToSection}
              />
              <StoryProgressCard story={story} />
              <CoupleSummaryCard story={story} />
            </div>
          </aside>

          {/* Main column */}
          <div className="min-w-0 flex-1">
            <StoryHeroBanner
              hero={story.hero}
              totals={story.totals}
              onShare={onShare}
              onDownload={onDownload}
              onFavorite={() => setFavoriteStory((v) => !v)}
              favoriteActive={favoriteStory}
            />

            <MobileTimelineChips
              events={story.events}
              activeId={activeId}
              onSelect={scrollToSection}
            />

            {/* Journey progress — mobile */}
            <div className="mt-4 lg:hidden">
              <StoryProgressCard story={story} />
            </div>

            <div className="relative mt-8 space-y-8">
              <AnimatePresence initial={false}>
                {visibleEvents.map((event, index) => (
                  <TimelineEventCard
                    key={event.id}
                    event={event}
                    index={index}
                    isLast={index === visibleEvents.length - 1 && !hasMore}
                    onViewAll={handleViewAll}
                    onPhotoClick={onPhotoPreview}
                    onPlayReel={handlePlayReel}
                  />
                ))}
              </AnimatePresence>

              {hasMore ? (
                <div className="flex justify-center pt-2">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAllEvents((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#6C3BFF]/25 bg-white px-5 py-3 text-sm font-bold text-[#6C3BFF] shadow-[var(--shadow-gallery-soft)] transition hover:bg-[#F3EEFF]"
                  >
                    {showAllEvents
                      ? 'Show fewer events'
                      : `View Remaining Events (${story.events.length - 6})`}
                    <ChevronDown
                      className={`h-4 w-4 transition ${showAllEvents ? 'rotate-180' : ''}`}
                    />
                  </motion.button>
                </div>
              ) : null}
            </div>

            <div className="mt-10">
              <StoryFeatureCards
                onFaceSearch={onFaceSearch}
                onCreateAlbum={handleCreateAlbum}
                onFavorites={onFavorites}
                onReels={handleReels}
              />
            </div>

            <div className="mt-6 lg:hidden">
              <CoupleSummaryCard story={story} />
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav
        events={story.events}
        activeId={activeId}
        onSelect={scrollToSection}
      />
    </div>
  );
}
