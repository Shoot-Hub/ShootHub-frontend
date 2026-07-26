import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { TimelineEvent } from '../types';
import { EventStatsRow } from './EventStatsRow';
import { PhotoGridPreview } from './PhotoGridPreview';
import { TimelineIcon } from './TimelineIcon';
import { VideoReelPreview } from './VideoReelPreview';

type Props = {
  event: TimelineEvent;
  index: number;
  isLast: boolean;
  onViewAll: (event: TimelineEvent) => void;
  onPhotoClick: (photoId: string) => void;
  onPlayReel: (event: TimelineEvent) => void;
};

export function TimelineEventCard({
  event,
  index,
  isLast,
  onViewAll,
  onPhotoClick,
  onPlayReel,
}: Props) {
  const remaining = Math.max(0, event.stats.photos - event.previewPhotos.length);

  return (
    <motion.article
      id={`story-section-${event.id}`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.04, 0.2), ease: [0.22, 1, 0.36, 1] }}
      className="relative scroll-mt-28 pl-0 sm:pl-10"
    >
      {/* Desktop connector */}
      <div className="absolute left-0 top-2 hidden sm:block" aria-hidden="true">
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
            event.completed
              ? 'border-[#6C3BFF] bg-[#6C3BFF] text-white'
              : 'border-[#E0E7FF] bg-white'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        </span>
        {!isLast ? (
          <span className="absolute left-1/2 top-5 h-[calc(100%+2.5rem)] w-px -translate-x-1/2 bg-gradient-to-b from-[#6C3BFF]/50 to-[#6C3BFF]/10" />
        ) : null}
      </div>

      <div className="rounded-[28px] border border-[#EEF0F4] bg-white p-4 shadow-[var(--shadow-gallery-soft)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3EEFF] px-2.5 py-1 text-[11px] font-bold text-[#6C3BFF]">
                <TimelineIcon name={event.icon} className="h-3 w-3" />
                {event.timeLabel}
              </span>
              {!event.completed ? (
                <span className="rounded-full bg-[#F8F9FB] px-2 py-1 text-[10px] font-semibold text-[#A0A4B0]">
                  Coming soon
                </span>
              ) : null}
            </div>

            <h2 className="mt-2.5 min-w-0 break-words text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl">
              {event.title}
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#636E72]">
              {event.description}
            </p>

            <div className="mt-3">
              <EventStatsRow stats={event.stats} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => onViewAll(event)}
            disabled={event.photos.length === 0}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#EEF0F4] bg-[#F8F9FB] px-3.5 py-2 text-sm font-semibold text-[#6C3BFF] transition hover:border-[#6C3BFF]/30 hover:bg-[#F3EEFF] disabled:opacity-40"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Media layout */}
        <div className="mt-5 grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
          {event.videoPreview ? (
            <VideoReelPreview
              video={event.videoPreview}
              onPlay={() => onPlayReel(event)}
            />
          ) : (
            <div className="flex aspect-[16/10] items-center justify-center rounded-[22px] border border-dashed border-[#EEF0F4] bg-[#F8F9FB] text-sm text-[#A0A4B0]">
              Reel preview soon
            </div>
          )}

          <PhotoGridPreview
            photos={event.previewPhotos}
            remainingCount={remaining}
            onPhotoClick={onPhotoClick}
            onViewAll={() => onViewAll(event)}
            showFaceBadge={index === 0}
          />
        </div>

        {/* Horizontal gallery strip */}
        {event.photos.length > 4 ? (
          <div className="mt-4 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {event.photos.slice(0, 12).map((photo) => (
              <button
                key={`strip-${photo.id}`}
                type="button"
                onClick={() => onPhotoClick(photo.id)}
                className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl"
              >
                <img
                  src={photo.thumbnailUrl || photo.url}
                  alt=""
                  className="h-full w-full object-cover transition hover:scale-105"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}
