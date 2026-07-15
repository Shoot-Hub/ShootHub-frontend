import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Music2, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReelActions } from './ReelActions';
import type { ReelItem } from './data';

type InstaReelProps = {
  reel: ReelItem;
  isActive: boolean;
  globalMuted: boolean;
  onToggleMute: () => void;
};

export function InstaReel({ reel, isActive, globalMuted, onToggleMute }: InstaReelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const lastTap = useRef(0);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = globalMuted;
    if (isActive) {
      void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      el.currentTime = 0;
      setPlaying(false);
    }
  }, [isActive, globalMuted]);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const handleDoubleTapLike = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setLiked(true);
      setShowHeart(true);
      window.setTimeout(() => setShowHeart(false), 700);
    } else {
      togglePlay();
    }
    lastTap.current = now;
  };

  return (
    <article className="relative h-full w-full snap-start snap-always bg-black">
      <video
        ref={videoRef}
        src={reel.video}
        loop
        playsInline
        muted={globalMuted}
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        onClick={handleDoubleTapLike}
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25"
        aria-hidden="true"
      />

      {showHeart && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-24 w-24 animate-ping fill-rose-500">
            <path d="M12 21s-7.5-4.6-9.8-9.2C.7 8.5 2.2 5 5.5 5c1.9 0 3.3 1.1 4 2.2C10.2 6.1 11.6 5 13.5 5c3.3 0 4.8 3.5 3.3 6.8C19.5 16.4 12 21 12 21z" />
          </svg>
        </div>
      )}

      {!playing && isActive && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
          aria-label="Play"
        >
          <Play className="ml-1 h-7 w-7 fill-white" strokeWidth={0} />
        </button>
      )}

      <button
        type="button"
        onClick={togglePlay}
        className="absolute left-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm sm:left-4"
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? (
          <Pause className="h-4 w-4 fill-white" strokeWidth={0} />
        ) : (
          <Play className="ml-0.5 h-4 w-4 fill-white" strokeWidth={0} />
        )}
      </button>

      <ReelActions
        likes={liked ? bumpCount(reel.likes) : reel.likes}
        comments={reel.comments}
        shares={reel.shares}
        liked={liked}
        saved={saved}
        muted={globalMuted}
        onLike={() => setLiked((v) => !v)}
        onSave={() => setSaved((v) => !v)}
        onMute={onToggleMute}
      />

      <div className="absolute inset-x-0 bottom-0 z-20 p-4 pb-6 sm:p-5 sm:pb-8">
        <div className="flex max-w-[78%] items-center gap-3">
          <img
            src={reel.creator.avatar}
            alt={reel.creator.name}
            className="h-11 w-11 rounded-full object-cover ring-2 ring-white"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{reel.creator.name}</p>
            <p className="truncate text-xs text-white/70">{reel.creator.handle}</p>
          </div>
          <Link
            to="/signup"
            className="shrink-0 rounded-full border border-white/80 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-white hover:text-ink"
          >
            Follow
          </Link>
        </div>

        <p className="mt-3 max-w-[78%] text-sm leading-snug text-white/95">{reel.caption}</p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-primary-200">
          {reel.category}
        </p>

        <div className="mt-3 flex max-w-[78%] items-center gap-2 text-xs text-white/80">
          <Music2 className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
          <span className={cn('truncate', isActive && 'animate-pulse')}>{reel.music}</span>
        </div>
      </div>
    </article>
  );
}

function bumpCount(value: string) {
  if (value.includes('K')) {
    const n = parseFloat(value);
    return `${(n + 0.1).toFixed(1)}K`;
  }
  return String(Number(value) + 1);
}
