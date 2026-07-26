import { useRef, useState, type MouseEvent } from 'react';
import { Bookmark, Eye, Heart, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ReelCardProps = {
  category: string;
  title: string;
  viewsLabel: string;
  likesLabel: string;
  video: string;
  poster?: string;
  duration: string;
  avatars: string[];
  photographerName?: string;
  saved?: boolean;
  onOpen?: () => void;
  onToggleSave?: () => void;
};

export function ReelCard({
  category,
  title,
  viewsLabel,
  likesLabel,
  video,
  poster,
  duration,
  avatars,
  photographerName,
  saved = false,
  onOpen,
  onToggleSave,
}: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const el = videoRef.current;
    if (!el) return;
    void el.play();
    setPlaying(true);
  };

  const pause = (reset = false) => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    if (reset) el.currentTime = 0;
    setPlaying(false);
  };

  const toggle = (e: MouseEvent) => {
    e.stopPropagation();
    if (playing) pause();
    else play();
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen?.();
        }
      }}
      onMouseEnter={play}
      onMouseLeave={() => pause(true)}
      className="group relative aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-[22px] bg-ink shadow-[0_12px_40px_-12px_rgba(15,23,42,0.35)] ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-16px_rgba(99,102,241,0.45)]"
      aria-label={`Open ${title} reel`}
    >
      <video
        ref={videoRef}
        src={video}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10"
        aria-hidden="true"
      />

      <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white backdrop-blur-sm">
        {duration}
      </span>

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary-600 shadow-md transition-transform hover:scale-105"
      >
        {playing ? (
          <Pause className="h-3.5 w-3.5 fill-primary-600" strokeWidth={0} />
        ) : (
          <Play className="ml-0.5 h-3.5 w-3.5 fill-primary-600" strokeWidth={0} />
        )}
      </button>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-3.5 sm:p-4">
        <span className="w-fit rounded-md bg-primary-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          {category}
        </span>

        <h3 className="line-clamp-2 text-[15px] font-extrabold leading-tight text-white sm:text-base">
          {title}
        </h3>

        {photographerName ? (
          <span className="truncate text-[11px] font-medium text-white/75">
            by {photographerName}
          </span>
        ) : null}

        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/85">
          <Eye className="h-3 w-3" strokeWidth={2} />
          {viewsLabel} views
        </span>

        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {avatars.slice(0, 4).map((src, i) => (
                <img
                  key={`${title}-avatar-${i}`}
                  src={src}
                  alt=""
                  className="h-6 w-6 rounded-full border-2 border-black/40 object-cover"
                />
              ))}
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-white">
              <Heart className="h-3 w-3 fill-rose-400 text-rose-400" strokeWidth={0} />
              {likesLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave?.();
            }}
            aria-label={saved ? `Unsave ${title}` : `Save ${title}`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Bookmark
              className={cn('h-4 w-4', saved && 'fill-white')}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
    </article>
  );
}
