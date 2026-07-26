import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Cake,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Mountain,
  Package,
  PartyPopper,
  Plane,
  Play,
  Shirt,
  SlidersHorizontal,
  Sparkles,
  UtensilsCrossed,
  UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ShootHubLoader } from '@/components/ShootHubLoader';
import { fadeInUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { reelService, type Reel } from '@/services/creator';
import avatar1 from '@/assets/landing/avatar-1.jpg';
import avatar2 from '@/assets/landing/avatar-2.jpg';
import avatar3 from '@/assets/landing/avatar-3.jpg';
import avatar4 from '@/assets/landing/avatar-4.jpg';
import { ReelCard, type ReelCardProps } from './ReelCard';
import { ReelExpandModal } from './ReelExpandModal';

const fallbackAvatars = [avatar1, avatar2, avatar3, avatar4];

const filters = [
  { id: 'all', label: 'All Styles', icon: Sparkles },
  { id: 'wedding', label: 'Wedding', icon: Heart },
  { id: 'pre-wedding', label: 'Pre Wedding', icon: Camera },
  { id: 'portrait', label: 'Portrait', icon: UserRound },
  { id: 'fashion', label: 'Fashion', icon: Shirt },
  { id: 'travel', label: 'Travel', icon: Mountain },
  { id: 'corporate', label: 'Corporate', icon: Briefcase },
  { id: 'product', label: 'Product', icon: Package },
  { id: 'food', label: 'Food', icon: UtensilsCrossed },
  { id: 'birthday', label: 'Birthday', icon: Cake },
  { id: 'drone', label: 'Drone', icon: Plane },
  { id: 'event', label: 'Event', icon: PartyPopper },
] as const;

type SortMode = 'popular' | 'latest';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

function toCardProps(reel: Reel, saved: boolean): ReelCardProps {
  const photographerAvatar = reel.photographer?.avatar?.url;
  const avatars = photographerAvatar
    ? [photographerAvatar, ...fallbackAvatars.slice(0, 3)]
    : fallbackAvatars;

  return {
    category: reel.category || 'Reel',
    title: reel.title,
    viewsLabel: formatCount(reel.views ?? 0),
    likesLabel: formatCount(reel.likesCount ?? 0),
    video: reel.video?.playbackUrl || reel.video?.url || '',
    poster: reel.thumbnail?.url || undefined,
    duration: formatDuration(reel.durationSeconds ?? 0),
    avatars,
    photographerName: reel.photographer?.fullName || reel.photographer?.displayName || undefined,
    saved,
  };
}

export function Reels() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]['id']>('all');
  const [sortMode, setSortMode] = useState<SortMode>('popular');
  const [sortOpen, setSortOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [activeReelId, setActiveReelId] = useState<string | null>(null);

  const fetchReels = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await reelService.getReels({
        page: 1,
        limit: 24,
        category: activeFilter === 'all' ? undefined : activeFilter,
      });
      if (res.success && res.data) {
        setReels(res.data.reels);
      } else {
        setReels([]);
        setError(res.message || 'Failed to load reels');
      }
    } catch (err) {
      setReels([]);
      setError(err instanceof Error ? err.message : 'Failed to load reels');
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    void fetchReels();
  }, [fetchReels]);

  const visibleReels = useMemo(() => {
    const sorted = [...reels];
    if (sortMode === 'popular') {
      sorted.sort((a, b) => (b.views ?? 0) - (a.views ?? 0) || (b.likesCount ?? 0) - (a.likesCount ?? 0));
    } else {
      sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
    return sorted;
  }, [reels, sortMode]);

  const scrollByCard = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.72, 320);
    el.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleLikeUpdate = (reelId: string, likesCount: number) => {
    setReels((prev) =>
      prev.map((r) => (r._id === reelId || r.id === reelId ? { ...r, likesCount } : r)),
    );
  };

  return (
    <Section id="reels" padding="lg" className="bg-white">
      <Container size="wide" padding="tight">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="min-w-0 break-words text-[28px] font-extrabold leading-tight tracking-tight text-ink sm:text-[44px] md:text-[58px]"
          >
            Cinematic <span className="text-primary-500">Reels</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-muted md:text-base"
          >
            Scroll through the styles clients are booking this week — tap any reel to book that exact look.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((filter) => {
              const Icon = filter.icon;
              const active = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors',
                    active
                      ? 'border-primary-500 bg-primary-500 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-ink hover:border-primary-200 hover:bg-primary-50',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="relative flex shrink-0 items-center gap-2 self-end lg:self-auto">
            <button
              type="button"
              onClick={() => setSortOpen((o) => !o)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-primary-200 hover:bg-primary-50"
            >
              {sortMode === 'popular' ? 'Popular' : 'Latest'}
              <ChevronDown className="h-3.5 w-3.5 text-ink-muted" strokeWidth={2.25} />
            </button>
            {sortOpen ? (
              <div className="absolute right-12 top-full z-20 mt-2 min-w-[140px] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                {(['popular', 'latest'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setSortMode(mode);
                      setSortOpen(false);
                    }}
                    className={cn(
                      'block w-full px-4 py-2 text-left text-sm font-medium capitalize transition-colors hover:bg-primary-50',
                      sortMode === mode ? 'text-primary-600' : 'text-ink',
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            ) : null}
            <button
              type="button"
              aria-label="Refresh reels"
              onClick={() => void fetchReels()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-ink transition-colors hover:border-primary-200 hover:bg-primary-50"
            >
              <SlidersHorizontal className="h-4 w-4" strokeWidth={2.25} />
            </button>
          </div>
        </motion.div>

        <div className="relative mt-8">
          <button
            type="button"
            aria-label="Previous reels"
            onClick={() => scrollByCard(-1)}
            className="absolute -left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-ink shadow-md transition-colors hover:border-primary-200 hover:bg-primary-50 md:flex lg:-left-4"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
          </button>

          <button
            type="button"
            aria-label="Next reels"
            onClick={() => scrollByCard(1)}
            className="absolute -right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-ink shadow-md transition-colors hover:border-primary-200 hover:bg-primary-50 md:flex lg:-right-4"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.25} />
          </button>

          <div
            ref={trackRef}
            className="-mx-1 flex gap-4 overflow-x-auto scroll-smooth px-1 pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {loading ? (
              <div className="flex w-full items-center justify-center py-20">
                <ShootHubLoader size="md" label="Loading reels…" />
              </div>
            ) : error ? (
              <div className="flex w-full flex-col items-center justify-center gap-3 py-16">
                <p className="text-sm font-medium text-red-600">{error}</p>
                <button
                  type="button"
                  onClick={() => void fetchReels()}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-primary-50"
                >
                  Try again
                </button>
              </div>
            ) : visibleReels.length === 0 ? (
              <p className="w-full py-16 text-center text-sm text-ink-muted">
                No reels in this style yet — try another filter.
              </p>
            ) : (
              visibleReels.map((reel) => {
                const id = reel._id || reel.id;
                const card = toCardProps(reel, savedIds.has(id));
                return (
                  <div
                    key={id}
                    className="w-[46%] shrink-0 snap-start sm:w-[32%] md:w-[28%] lg:w-[calc((100%-4rem)/5)]"
                  >
                    <ReelCard
                      {...card}
                      onOpen={() => setActiveReelId(id)}
                      onToggleSave={() => toggleSave(id)}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-10 flex justify-center"
        >
          <Link to="/reels">
            <Button
              variant="secondary"
              size="lg"
              pill
              className="border-primary-200 bg-white px-8 text-primary-600 hover:border-primary-300 hover:bg-primary-50"
              leftIcon={
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100">
                  <Play className="ml-0.5 h-3 w-3 fill-primary-600" strokeWidth={0} />
                </span>
              }
              rightIcon={<ChevronRight className="h-4 w-4 text-primary-500" strokeWidth={2.5} />}
            >
              View All Reels
            </Button>
          </Link>
        </motion.div>
      </Container>

      <ReelExpandModal
        open={Boolean(activeReelId)}
        reels={visibleReels}
        initialReelId={activeReelId}
        savedIds={savedIds}
        onClose={() => setActiveReelId(null)}
        onToggleSave={toggleSave}
        onLikeUpdate={handleLikeUpdate}
      />
    </Section>
  );
}
