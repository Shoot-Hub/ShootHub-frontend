import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Eye,
  MessageSquare,
  Clock,
  X,
  Globe,
  Lock,
} from 'lucide-react';
import type { Reel } from '@/services/creator';
import { formatDuration, formatDate } from './helpers';

type Props = {
  open: boolean;
  onClose: () => void;
  reel: Reel;
  onLike?: () => void;
};

export function ReelPlayerModal({ open, onClose, reel, onLike }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (open && videoRef.current) {
      videoRef.current.currentTime = 0;
      setPlaying(false);
      setMuted(false);
      setProgress(0);
    }
  }, [open, reel._id]);

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
    if (!videoRef.current) return;
    const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(pct);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * videoRef.current.duration;
  };

  const currentTimeLabel = videoRef.current
    ? `${Math.floor(videoRef.current.currentTime / 60)}:${String(
        Math.floor(videoRef.current.currentTime) % 60,
      ).padStart(2, '0')}`
    : '0:00';

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 sm:max-w-4xl w-full flex flex-col sm:flex-row rounded-3xl overflow-hidden bg-black shadow-2xl max-h-[90vh]"
          >
            {/* ── Video Side ── */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[50vh] sm:min-h-[80vh]">
              <video
                ref={videoRef}
                src={reel.video.url}
                poster={reel.thumbnail?.url}
                className="w-full h-full object-contain"
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setPlaying(false)}
                onClick={togglePlay}
              />

              {/* Play overlay */}
              <AnimatePresence>
                {!playing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={togglePlay}
                  >
                    <div className="flex h-18 w-18 h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 shadow-2xl">
                      <Play className="h-8 w-8 ml-1" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 pt-14">
                {/* Progress bar */}
                <div
                  className="h-1 bg-white/20 rounded-full cursor-pointer mb-3 group hover:h-1.5 transition-all"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full bg-white rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={togglePlay} className="text-white/90 hover:text-white transition-colors">
                      {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>
                    <button onClick={toggleMute} className="text-white/90 hover:text-white transition-colors">
                      {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/60 font-mono">
                    <span>{currentTimeLabel}</span>
                    <span>/</span>
                    <span>{formatDuration(reel.durationSeconds)}</span>
                  </div>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/70 transition-colors border border-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ── Details Sidebar ── */}
            <div className="w-full sm:w-80 bg-white flex flex-col">
              {/* Title + description */}
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base leading-snug">{reel.title}</h3>
                {reel.description && (
                  <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{reel.description}</p>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Stats */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={onLike}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-rose-500 transition-colors group/like"
                  >
                    <Heart className={`h-4 w-4 group-hover/like:scale-125 transition-transform ${reel.likesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span className="font-semibold">{reel.likesCount}</span>
                  </button>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Eye className="h-4 w-4" />
                    <span className="font-semibold">{reel.views}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <MessageSquare className="h-4 w-4" />
                    <span className="font-semibold">{reel.commentsCount}</span>
                  </div>
                </div>

                {/* Category */}
                {reel.category && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Category</p>
                    <span className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100 capitalize">
                      {reel.category}
                    </span>
                  </div>
                )}

                {/* Tags */}
                {reel.tags && reel.tags.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {reel.tags.map((tag, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Photographer */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Photographer</p>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-bold overflow-hidden shadow-md">
                      {reel.photographer?.avatar?.url ? (
                        <img src={reel.photographer.avatar.url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        reel.photographer?.fullName?.charAt(0) || '?'
                      )}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {reel.photographer?.fullName || 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Date + Status */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDate(reel.createdAt)}
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${reel.isPublished ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {reel.isPublished ? (
                      <><Globe className="h-3.5 w-3.5" />Published</>
                    ) : (
                      <><Lock className="h-3.5 w-3.5" />Unpublished</>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
