import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Heart,
  MessageCircle,
  Music2,
  Pause,
  Play,
  Send,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { reelService, type Reel } from '@/services/creator';
import { useAuth } from '@/store';
function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

type FeedReelSlideProps = {
  reel: Reel;
  isActive: boolean;
  muted: boolean;
  onToggleMute: () => void;
  saved: boolean;
  onToggleSave: () => void;
  onOpenComments: () => void;
  onLikeUpdate: (reelId: string, likesCount: number) => void;
};

function ActionBtn({
  label,
  count,
  active,
  onClick,
  children,
}: {
  label: string;
  count?: string;
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex flex-col items-center gap-1 text-white"
    >
      <span
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-transform active:scale-90',
          active && 'bg-white/20',
        )}
      >
        {children}
      </span>
      {count != null ? (
        <span className="text-[11px] font-semibold drop-shadow-md">{count}</span>
      ) : null}
    </button>
  );
}

function FeedReelSlide({
  reel,
  isActive,
  muted,
  onToggleMute,
  saved,
  onToggleSave,
  onOpenComments,
  onLikeUpdate,
}: FeedReelSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTap = useRef(0);
  const { isAuthenticated } = useAuth();
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likesCount ?? 0);
  const [showHeart, setShowHeart] = useState(false);
  const [liking, setLiking] = useState(false);

  const videoSrc = reel.video?.playbackUrl || reel.video?.url || '';
  const poster = reel.thumbnail?.url || undefined;
  const photographerName =
    reel.photographer?.fullName || reel.photographer?.displayName || 'Creator';
  const photographerAvatar = reel.photographer?.avatar?.url;
  const handle =
    reel.photographer?.slug ? `@${reel.photographer.slug}` : undefined;

  useEffect(() => {
    setLikesCount(reel.likesCount ?? 0);
  }, [reel._id, reel.likesCount]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = muted;
    if (isActive) {
      void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      el.currentTime = 0;
      setPlaying(false);
    }
  }, [isActive, muted, videoSrc]);

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

  const handleLike = async () => {
    if (liking) return;
    if (!isAuthenticated) {
      toast.error('Login to like this reel');
      return;
    }
    setLiking(true);
    const prevLiked = liked;
    const prevCount = likesCount;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((c) => Math.max(0, c + (nextLiked ? 1 : -1)));
    if (nextLiked) {
      setShowHeart(true);
      window.setTimeout(() => setShowHeart(false), 700);
    }
    try {
      const res = await reelService.toggleLikeReel(reel._id);
      if (res.success && res.data) {
        setLiked(res.data.liked);
        setLikesCount(res.data.likesCount);
        onLikeUpdate(reel._id, res.data.likesCount);
      }
    } catch {
      setLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error('Could not update like');
    } finally {
      setLiking(false);
    }
  };

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!liked) void handleLike();
      else {
        setShowHeart(true);
        window.setTimeout(() => setShowHeart(false), 700);
      }
    } else {
      togglePlay();
    }
    lastTap.current = now;
  };

  const handleShare = async () => {
    const url = window.location.origin + `/reels?id=${reel._id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: reel.title,
          text: reel.description || reel.title,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied');
      }
    } catch {
      // user cancelled share
    }
  };

  return (
    <article className="relative h-full w-full snap-start snap-always bg-black">
      <video
        ref={videoRef}
        src={videoSrc}
        poster={poster}
        loop
        playsInline
        muted={muted}
        preload={isActive ? 'auto' : 'metadata'}
        className="absolute inset-0 h-full w-full object-cover"
        onClick={handleTap}
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30"
        aria-hidden="true"
      />

      {showHeart ? (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <Heart className="h-24 w-24 animate-ping fill-rose-500 text-rose-500" strokeWidth={0} />
        </div>
      ) : null}

      {!playing && isActive ? (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
          aria-label="Play"
        >
          <Play className="ml-1 h-7 w-7 fill-white" strokeWidth={0} />
        </button>
      ) : null}

      <div className="absolute left-3 top-3 z-20 flex items-center gap-2 sm:left-4 sm:top-4">
        <span className="rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white backdrop-blur-sm">
          {formatDuration(reel.durationSeconds ?? 0)}
        </span>
        {reel.category ? (
          <span className="rounded-md bg-primary-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            {reel.category}
          </span>
        ) : null}
      </div>

      {/* Right actions — Instagram style */}
      <div className="absolute bottom-28 right-3 z-20 flex flex-col items-center gap-4 sm:right-4">
        <ActionBtn
          label="Like"
          count={formatCount(likesCount)}
          active={liked}
          onClick={() => void handleLike()}
        >
          <Heart
            className={cn('h-6 w-6', liked ? 'fill-rose-500 text-rose-500' : 'text-white')}
            strokeWidth={liked ? 0 : 2}
          />
        </ActionBtn>

        <ActionBtn
          label="Comments"
          count={formatCount(reel.commentsCount ?? 0)}
          onClick={onOpenComments}
        >
          <MessageCircle className="h-6 w-6 text-white" strokeWidth={2} />
        </ActionBtn>

        <ActionBtn
          label="Share"
          count={formatCount(reel.sharesCount ?? 0)}
          onClick={() => void handleShare()}
        >
          <Send className="h-5 w-5 text-white" strokeWidth={2} />
        </ActionBtn>

        <ActionBtn label={saved ? 'Saved' : 'Save'} active={saved} onClick={onToggleSave}>
          <Bookmark
            className={cn('h-6 w-6', saved ? 'fill-white text-white' : 'text-white')}
            strokeWidth={2}
          />
        </ActionBtn>

        <ActionBtn label={muted ? 'Unmute' : 'Mute'} onClick={onToggleMute}>
          {muted ? (
            <VolumeX className="h-5 w-5 text-white" strokeWidth={2} />
          ) : (
            <Volume2 className="h-5 w-5 text-white" strokeWidth={2} />
          )}
        </ActionBtn>

        <ActionBtn label={playing ? 'Pause' : 'Play'} onClick={togglePlay}>
          {playing ? (
            <Pause className="h-5 w-5 fill-white text-white" strokeWidth={0} />
          ) : (
            <Play className="ml-0.5 h-5 w-5 fill-white text-white" strokeWidth={0} />
          )}
        </ActionBtn>
      </div>

      {/* Bottom info */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-4 pb-6 sm:p-5 sm:pb-8">
        <div className="flex max-w-[78%] items-center gap-3">
          {photographerAvatar ? (
            <img
              src={photographerAvatar}
              alt={photographerName}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-white"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white ring-2 ring-white">
              {photographerName.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{photographerName}</p>
            {handle ? <p className="truncate text-xs text-white/70">{handle}</p> : null}
          </div>
          <Link
            to="/signup"
            className="shrink-0 rounded-full border border-white/80 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-white hover:text-ink"
          >
            Follow
          </Link>
        </div>

        <p className="mt-3 max-w-[78%] text-sm font-semibold leading-snug text-white">
          {reel.title}
        </p>
        {reel.description ? (
          <p className="mt-1 max-w-[78%] line-clamp-2 text-sm leading-snug text-white/85">
            {reel.description}
          </p>
        ) : null}

        <div className="mt-3 flex max-w-[78%] items-center gap-2 text-xs text-white/80">
          <Music2 className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
          <span className={cn('truncate', isActive && 'animate-pulse')}>
            Original Audio · {photographerName}
          </span>
        </div>
      </div>
    </article>
  );
}

type Comment = {
  id: string;
  text: string;
  author: string;
  createdAt: number;
};

type ReelExpandModalProps = {
  open: boolean;
  reels: Reel[];
  initialReelId: string | null;
  savedIds: Set<string>;
  onClose: () => void;
  onToggleSave: (id: string) => void;
  onLikeUpdate?: (reelId: string, likesCount: number) => void;
};

export function ReelExpandModal({
  open,
  reels,
  initialReelId,
  savedIds,
  onClose,
  onToggleSave,
  onLikeUpdate,
}: ReelExpandModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsByReel, setCommentsByReel] = useState<Record<string, Comment[]>>({});
  const [draft, setDraft] = useState('');
  const { user, isAuthenticated } = useAuth();

  const startIndex = Math.max(
    0,
    reels.findIndex((r) => r._id === initialReelId || r.id === initialReelId),
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(startIndex >= 0 ? startIndex : 0);
    setCommentsOpen(false);
    setDraft('');
    setMuted(false);

    // scroll to starting reel after mount
    requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el) return;
      const idx = startIndex >= 0 ? startIndex : 0;
      el.scrollTop = idx * el.clientHeight;
    });
  }, [open, initialReelId, startIndex]);

  const updateActive = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const index = Math.round(el.scrollTop / el.clientHeight);
    setActiveIndex(Math.min(Math.max(index, 0), reels.length - 1));
  }, [reels.length]);

  const goTo = useCallback(
    (index: number) => {
      const el = containerRef.current;
      if (!el) return;
      const next = Math.min(Math.max(index, 0), reels.length - 1);
      el.scrollTo({ top: next * el.clientHeight, behavior: 'smooth' });
    },
    [reels.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (commentsOpen) setCommentsOpen(false);
        else onClose();
      }
      if (e.key === 'ArrowDown') goTo(activeIndex + 1);
      if (e.key === 'ArrowUp') goTo(activeIndex - 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, commentsOpen, activeIndex, goTo]);

  useEffect(() => {
    const el = containerRef.current;
    if (!open || !el) return;
    el.addEventListener('scroll', updateActive, { passive: true });
    return () => el.removeEventListener('scroll', updateActive);
  }, [open, updateActive]);

  const activeReel = reels[activeIndex];
  const activeComments = activeReel ? commentsByReel[activeReel._id] || [] : [];

  const submitComment = () => {
    if (!activeReel) return;
    const text = draft.trim();
    if (!text) return;
    if (!isAuthenticated) {
      toast.error('Login to comment');
      return;
    }
    const author = user?.fullName || user?.firstName || 'You';
    const comment: Comment = {
      id: `${Date.now()}`,
      text,
      author,
      createdAt: Date.now(),
    };
    setCommentsByReel((prev) => ({
      ...prev,
      [activeReel._id]: [...(prev[activeReel._id] || []), comment],
    }));
    setDraft('');
    toast.success('Comment added');
  };

  if (!open || reels.length === 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Reels viewer"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95"
    >
      <div className="relative h-[100dvh] w-full max-w-[430px] overflow-hidden bg-black sm:h-[min(96dvh,860px)] sm:rounded-[28px] sm:ring-1 sm:ring-white/10">
        {/* Top bar */}
        <div className="absolute left-0 right-0 top-0 z-40 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-4 pb-10 pt-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-white">Reels</span>
            <span className="text-[11px] font-semibold text-white/60">
              {activeIndex + 1} / {reels.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/65"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        {/* Vertical snap feed */}
        <div
          ref={containerRef}
          className="h-full w-full snap-y snap-mandatory overflow-y-scroll overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reels.map((reel, index) => {
            const id = reel._id || reel.id;
            return (
              <div key={id} className="h-full w-full shrink-0">
                <FeedReelSlide
                  reel={reel}
                  isActive={index === activeIndex}
                  muted={muted}
                  onToggleMute={() => setMuted((m) => !m)}
                  saved={savedIds.has(id)}
                  onToggleSave={() => onToggleSave(id)}
                  onOpenComments={() => setCommentsOpen(true)}
                  onLikeUpdate={(reelId, likesCount) => onLikeUpdate?.(reelId, likesCount)}
                />
              </div>
            );
          })}
        </div>

        {/* Scroll hint */}
        {activeIndex < reels.length - 1 ? (
          <p className="pointer-events-none absolute bottom-2 left-1/2 z-30 -translate-x-1/2 text-[10px] font-medium uppercase tracking-wider text-white/40">
            Swipe up for next
          </p>
        ) : null}

        {/* Comments sheet */}
        {commentsOpen && activeReel ? (
          <div className="absolute inset-x-0 bottom-0 z-50 flex max-h-[55%] flex-col rounded-t-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h3 className="text-sm font-bold text-ink">
                Comments ({activeComments.length + (activeReel.commentsCount ?? 0)})
              </h3>
              <button
                type="button"
                onClick={() => setCommentsOpen(false)}
                className="text-sm font-semibold text-ink-muted"
              >
                Close
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {activeComments.length === 0 ? (
                <p className="py-8 text-center text-sm text-ink-muted">
                  No comments yet — be the first.
                </p>
              ) : (
                activeComments.map((c) => (
                  <div key={c.id} className="flex gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600">
                      {c.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink">{c.author}</p>
                      <p className="text-sm text-ink/80">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2 border-t border-slate-100 p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitComment();
                }}
                placeholder={isAuthenticated ? 'Add a comment…' : 'Login to comment…'}
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-primary-300"
              />
              <button
                type="button"
                onClick={submitComment}
                className="rounded-full bg-primary-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-600"
              >
                Post
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
