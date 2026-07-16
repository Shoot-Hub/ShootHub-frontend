import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Play, Clock, Heart, Eye, Edit3, MoreVertical, Globe, Lock } from 'lucide-react';
import type { Reel } from '@/services/creator';
import { formatDuration } from './helpers';

type Props = {
  reel: Reel;
  onPlay: () => void;
  onEdit: () => void;
  onLike: () => void;
};

export function ReelCard({ reel, onPlay, onEdit, onLike }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group relative rounded-2xl overflow-hidden bg-white border border-slate-100/80 shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1.5 transition-all duration-350 cursor-pointer"
    >
      {/* ── Thumbnail ──────────────────────────────── */}
      <div
        className="relative aspect-[9/16] overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800"
        onClick={onPlay}
      >
        {reel.thumbnail?.url ? (
          <img
            src={reel.thumbnail.url}
            alt={reel.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video className="h-12 w-12 text-slate-600" />
          </div>
        )}

        {/* Dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40" />

        {/* Hover play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white shadow-xl border border-white/30"
          >
            <Play className="h-6 w-6 ml-0.5" />
          </motion.div>
        </div>

        {/* ── Top bar ── */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between">
          {/* Duration badge */}
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide border border-white/10">
            <Clock className="h-2.5 w-2.5" />
            {formatDuration(reel.durationSeconds)}
          </span>

          {/* Published status + menu */}
          <div className="flex items-center gap-1.5">
            {/* Status dot */}
            <span
              className={`inline-flex h-5 w-5 items-center justify-center rounded-full backdrop-blur-md border ${
                reel.isPublished
                  ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
                  : 'bg-amber-500/20 border-amber-400/30 text-amber-300'
              }`}
              title={reel.isPublished ? 'Published' : 'Unpublished'}
            >
              {reel.isPublished ? (
                <Globe className="h-3 w-3" />
              ) : (
                <Lock className="h-3 w-3" />
              )}
            </span>

            {/* Kebab menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors border border-white/10"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.94 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-9 z-50 w-44 rounded-xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-xl py-1.5 overflow-hidden"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(false);
                          onEdit();
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 className="h-4 w-4 text-blue-500" />
                        Edit Reel
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        {reel.isPublished ? (
                          <>
                            <Lock className="h-4 w-4 text-amber-500" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Globe className="h-4 w-4 text-emerald-500" />
                            Publish
                          </>
                        )}
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Bottom info ── */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-bold text-white line-clamp-2 drop-shadow-sm leading-snug">
            {reel.title}
          </h3>
          {reel.description && (
            <p className="text-[11px] text-white/60 mt-0.5 line-clamp-1">{reel.description}</p>
          )}
        </div>
      </div>

      {/* ── Footer stats ── */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-500 transition-colors group/like"
          >
            <Heart className="h-3.5 w-3.5 group-hover/like:scale-125 transition-transform" />
            <span>{reel.likesCount}</span>
          </button>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Eye className="h-3.5 w-3.5" />
            <span>{reel.views}</span>
          </div>
        </div>
        {reel.category && (
          <span className="px-2 py-0.5 rounded-lg bg-slate-50 text-[10px] font-semibold text-slate-500 capitalize border border-slate-100">
            {reel.category}
          </span>
        )}
      </div>
    </motion.div>
  );
}
