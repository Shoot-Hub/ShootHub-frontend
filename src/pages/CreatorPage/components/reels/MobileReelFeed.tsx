import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Eye,
  MessageSquare,
  Volume2,
  VolumeX,
  Play,
  Edit3,
  MoreVertical,
  Clock,
  Globe,
  Lock,
} from 'lucide-react';
import type { Reel } from '@/services/creator';
import { formatDuration, formatDate } from './helpers';

// ─── Single Reel Slide ────────────────────────────────────────
type ReelSlideProps = {
  reel: Reel;
  isActive: boolean;
  onLike: () => void;
  onEdit: () => void;
};

function ReelSlide({ reel, isActive, onLike, onEdit }: ReelSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  }, [isActive]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted((m) => !m);
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current || !videoRef.current.duration) return;
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
  };

  const handleProgressTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    videoRef.current.currentTime =
      ((e.clientX - rect.left) / rect.width) * videoRef.current.duration;
  };

  const handleLike = () => {
    setLiked((l) => !l);
    onLike();
  };

  return (
    <div className="relative w-full h-full flex-shrink-0 snap-start snap-always bg-black">
      {/* ── Video ── */}
      <video
        ref={videoRef}
        src={reel.video.url}
        poster={reel.thumbnail?.url}
        className="w-full h-full object-cover"
        playsInline
        loop
        muted={muted}
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
      />

      {/* ── Dark gradient overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

      {/* ── Play pause flash ── */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.3 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/20">
              <Play className="h-10 w-10 text-white ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-3 z-10">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10">
            <Clock className="h-3 w-3" />
            {formatDuration(reel.durationSeconds)}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md text-[11px] font-semibold border ${
              reel.isPublished
                ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
                : 'bg-amber-500/20 border-amber-400/30 text-amber-300'
            }`}
          >
            {reel.isPublished ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
            {reel.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>

        {/* Kebab */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((v) => !v);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute right-0 top-11 z-40 w-40 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl overflow-hidden py-1"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onEdit();
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <Edit3 className="h-4 w-4 text-blue-500" />
                    Edit Reel
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Right action bar ── */}
      <div className="absolute right-4 bottom-28 flex flex-col items-center gap-5 z-10">
        {/* Like */}
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <motion.div
            whileTap={{ scale: 1.4 }}
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              liked ? 'bg-red-500' : 'bg-black/40 backdrop-blur-md border border-white/10'
            } text-white transition-colors`}
          >
            <Heart className={`h-6 w-6 ${liked ? 'fill-white' : ''}`} />
          </motion.div>
          <span className="text-white text-[11px] font-bold drop-shadow-sm">
            {reel.likesCount + (liked ? 1 : 0)}
          </span>
        </button>

        {/* Views */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white">
            <Eye className="h-6 w-6" />
          </div>
          <span className="text-white text-[11px] font-bold drop-shadow-sm">{reel.views}</span>
        </div>

        {/* Comments */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white">
            <MessageSquare className="h-6 w-6" />
          </div>
          <span className="text-white text-[11px] font-bold drop-shadow-sm">
            {reel.commentsCount}
          </span>
        </div>

        {/* Mute */}
        <button
          onClick={toggleMute}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white"
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Bottom info ── */}
      <div className="absolute bottom-0 left-0 right-16 px-4 pb-6 z-10">
        {/* Title */}
        <h3 className="text-white font-bold text-base leading-snug drop-shadow-lg line-clamp-2">
          {reel.title}
        </h3>
        {reel.description && (
          <p className="text-white/70 text-sm mt-1 line-clamp-2 leading-snug">{reel.description}</p>
        )}

        {/* Tags */}
        {reel.tags && reel.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {reel.tags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-[11px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Date */}
        <p className="text-white/40 text-[11px] mt-2">{formatDate(reel.createdAt)}</p>

        {/* Progress bar */}
        <div
          className="mt-3 h-0.5 bg-white/20 rounded-full cursor-pointer"
          onClick={handleProgressTap}
        >
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Reel Feed ─────────────────────────────────────────
type MobileReelFeedProps = {
  reels: Reel[];
  onEdit: (reel: Reel) => void;
  onLike: (reelId: string) => void;
};

export function MobileReelFeed({ reels, onEdit, onLike }: MobileReelFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection observer to track which reel is active
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            if (!isNaN(idx)) setActiveIndex(idx);
          }
        });
      },
      { root: container, threshold: 0.6 },
    );

    const slides = container.querySelectorAll('[data-index]');
    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [reels]);

  if (reels.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollbarWidth: 'none' }}
    >
      {reels.map((reel, i) => (
        <div
          key={reel._id}
          data-index={i}
          className="w-full snap-start snap-always"
          style={{ height: '100%' }}
        >
          <ReelSlide
            reel={reel}
            isActive={i === activeIndex}
            onLike={() => onLike(reel._id)}
            onEdit={() => onEdit(reel)}
          />
        </div>
      ))}

      {/* Dots indicator */}
      <div className="fixed right-2 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5 pointer-events-none">
        {reels.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? 'h-6 w-1.5 bg-white'
                : 'h-1.5 w-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
