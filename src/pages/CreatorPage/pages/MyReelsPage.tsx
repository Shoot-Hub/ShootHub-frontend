import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Camera, AlertCircle, Sparkles, Film, Grid3x3, Play,
  Users, User, Search, SlidersHorizontal,
} from 'lucide-react';
import { reelService } from '@/services/creator';
import type { Reel } from '@/services/creator';
import { useAuth } from '@/store';
import {
  ReelCard,
  ReelsStatsBar,
  ReelsPagination,
  EditModal,
  ReelPlayerModal,
  MobileReelFeed,
} from '../components/reels';

// ─────────────────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────────────────
function EmptyState({ onUpload, mode }: { onUpload: () => void; mode: 'my' | 'all' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 px-4 text-center"
    >
      <div className="relative mb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 shadow-inner">
          <Film className="h-12 w-12 text-blue-400" />
        </div>
        <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
      </div>
      {mode === 'my' ? (
        <>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No reels yet</h3>
          <p className="text-sm text-slate-400 mb-8 max-w-xs leading-relaxed">
            Tap the camera button to upload your first reel and showcase your creative work
          </p>
          <button
            onClick={onUpload}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
          >
            <Camera className="h-4 w-4" />
            Upload Your First Reel
          </button>
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No reels found</h3>
          <p className="text-sm text-slate-400 mb-4 max-w-xs leading-relaxed">
            No reels available right now. Be the first to share yours!
          </p>
        </>
      )}
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-[3px] border-blue-100 border-t-blue-600 animate-spin" />
        <div className="absolute inset-2 rounded-full border-[2px] border-indigo-100 border-b-indigo-500 animate-spin [animation-direction:reverse] [animation-duration:0.9s]" />
      </div>
      <p className="text-sm font-medium text-slate-400 animate-pulse">Loading reels...</p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 gap-3"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 shadow-inner mb-1">
        <AlertCircle className="h-8 w-8 text-red-400" />
      </div>
      <p className="text-sm text-red-600 font-semibold">{message}</p>
      <button
        onClick={onRetry}
        className="mt-2 px-5 py-2 rounded-xl bg-slate-100 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
      >
        Try Again
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// My Reels Page
// ─────────────────────────────────────────────────────────
export function MyReelsPage() {
  useAuth();
  const navigate = useNavigate();

  // Tab: 'all' = all public reels | 'my' = my reels
  const [tab, setTab] = useState<'all' | 'my'>('all');
  const [reels, setReels] = useState<Reel[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'feed' | 'grid'>('feed');
  const [search, setSearch] = useState('');

  // Modal state
  const [editReel, setEditReel] = useState<Reel | null>(null);
  const [playReel, setPlayReel] = useState<Reel | null>(null);

  const fetchReels = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      let res;
      if (tab === 'my') {
        res = await reelService.getMyReels({ page, limit: 12 });
      } else {
        res = await reelService.getReels({ page, limit: 12, search: search || undefined });
      }
      if (res.success && res.data) {
        setReels(res.data.reels);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reels');
    } finally {
      setLoading(false);
    }
  }, [tab, search]);

  useEffect(() => {
    fetchReels(1);
  }, [fetchReels]);

  const handleLike = async (reelId: string) => {
    try {
      await reelService.toggleLikeReel(reelId);
      setReels((prev) =>
        prev.map((r) =>
          r._id === reelId
            ? { ...r, likesCount: r.likesCount > 0 ? r.likesCount - 1 : r.likesCount + 1 }
            : r,
        ),
      );
    } catch { /* silent */ }
  };

  // ── Shared tab + controls bar ──────────────────────────────
  const TabBar = ({ dark = false }: { dark?: boolean }) => (
    <div className={`flex items-center gap-2 ${dark ? '' : ''}`}>
      {/* All Reels tab */}
      <button
        onClick={() => setTab('all')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
          tab === 'all'
            ? dark
              ? 'bg-white text-blue-700 shadow-sm'
              : 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
            : dark
            ? 'text-white/70 hover:text-white hover:bg-white/10'
            : 'text-slate-500 hover:bg-slate-100'
        }`}
      >
        <Users className="h-3.5 w-3.5" />
        All Reels
      </button>

      {/* My Reels tab */}
      <button
        onClick={() => setTab('my')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
          tab === 'my'
            ? dark
              ? 'bg-white text-blue-700 shadow-sm'
              : 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
            : dark
            ? 'text-white/70 hover:text-white hover:bg-white/10'
            : 'text-slate-500 hover:bg-slate-100'
        }`}
      >
        <User className="h-3.5 w-3.5" />
        My Reels
      </button>
    </div>
  );

  return (
    <>
      {/* ════════ MOBILE VIEW ════════ */}
      <div className="lg:hidden">
        {loading ? (
          <div className="p-6"><LoadingState /></div>
        ) : error ? (
          <div className="p-6"><ErrorState message={error} onRetry={() => fetchReels()} /></div>
        ) : reels.length === 0 ? (
          <div className="p-6">
            <EmptyState onUpload={() => navigate('/creator/reels/upload')} mode={tab} />
          </div>
        ) : (
          <div className="fixed bg-black" style={{ top: '3.5rem', bottom: '5rem', left: 0, right: 0 }}>
            {/* Top controls overlay */}
            <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 pt-2.5 pb-2 bg-gradient-to-b from-black/60 to-transparent">
              {/* Tab switcher */}
              <TabBar dark />

              {/* Right: view toggle + camera */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 p-0.5">
                  <button
                    onClick={() => setViewMode('feed')}
                    className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                      viewMode === 'feed' ? 'bg-white text-black' : 'text-white'
                    }`}
                  >
                    <Play className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-black' : 'text-white'
                    }`}
                  >
                    <Grid3x3 className="h-3.5 w-3.5" />
                  </button>
                </div>
                {/* Camera icon */}
                <button
                  onClick={() => navigate('/creator/reels/upload')}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {viewMode === 'feed' ? (
                <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                  <MobileReelFeed reels={reels} onEdit={(r) => setEditReel(r)} onLike={handleLike} />
                </motion.div>
              ) : (
                <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full overflow-y-auto bg-[#F8FAFF] pt-14 px-3 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    {reels.map((reel, i) => (
                      <motion.div key={reel._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <ReelCard reel={reel} onPlay={() => setPlayReel(reel)} onEdit={() => setEditReel(reel)} onLike={() => handleLike(reel._id)} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ════════ DESKTOP VIEW ════════ */}
      <div className="hidden lg:block p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Reels</h1>
            <p className="text-slate-400 mt-1 text-sm">Discover and manage video creations</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Tab bar */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
              <TabBar />
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/creator/reels/upload')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold hover:shadow-xl hover:shadow-blue-500/30 transition-all shadow-md"
            >
              <Camera className="h-4 w-4" />
              Upload Reel
            </motion.button>
          </div>
        </div>

        {/* Search + filters (desktop, all reels mode) */}
        {tab === 'all' && (
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchReels(1)}
                placeholder="Search reels..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <SlidersHorizontal className="h-4 w-4" />
              Filter
            </button>
          </div>
        )}

        {/* Stats (my reels only) */}
        {tab === 'my' && !loading && !error && <ReelsStatsBar total={pagination.total} reels={reels} />}

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchReels()} />
        ) : reels.length === 0 ? (
          <EmptyState onUpload={() => navigate('/creator/reels/upload')} mode={tab} />
        ) : (
          <>
            <AnimatePresence>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {reels.map((reel, i) => (
                  <motion.div key={reel._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <ReelCard reel={reel} onPlay={() => setPlayReel(reel)} onEdit={() => setEditReel(reel)} onLike={() => handleLike(reel._id)} />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
            <ReelsPagination page={pagination.page} pages={pagination.pages} onPageChange={fetchReels} />
          </>
        )}
      </div>

      {/* ── Shared Modals ── */}
      {editReel && (
        <EditModal open={!!editReel} onClose={() => setEditReel(null)} onSuccess={() => fetchReels()} reel={editReel} />
      )}
      {playReel && (
        <ReelPlayerModal open={!!playReel} onClose={() => setPlayReel(null)} reel={playReel} onLike={() => handleLike(playReel._id)} />
      )}
    </>
  );
}