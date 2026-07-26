import { motion } from 'framer-motion';
import {
  Calendar,
  Download,
  Heart,
  ImageIcon,
  MapPin,
  Share2,
  Video,
} from 'lucide-react';
import type { StoryHero, StoryTotals } from '../types';
import { formatCompactCount } from '../utils';

type Props = {
  hero: StoryHero;
  totals: StoryTotals;
  onShare: () => void;
  onDownload: () => void;
  onFavorite?: () => void;
  favoriteActive?: boolean;
};

export function StoryHeroBanner({
  hero,
  totals,
  onShare,
  onDownload,
  onFavorite,
  favoriteActive,
}: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[28px] shadow-[0_20px_60px_-24px_rgba(108,59,255,0.35)]"
    >
      <div className="relative aspect-[21/9] min-h-[240px] w-full sm:min-h-[300px] lg:min-h-[360px]">
        <img
          src={hero.coverImage}
          alt={hero.title}
          className="absolute inset-0 h-full w-full object-cover scale-105 transition-transform duration-[1.2s] ease-out hover:scale-110"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20"
          aria-hidden="true"
        />

        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
                Wedding Story Timeline
              </p>
              <h1 className="mt-2 min-w-0 break-words text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {hero.title}
              </h1>
              <p className="mt-2 text-sm font-medium text-white/90 sm:text-base">
                {hero.coupleLine}
              </p>
              <p className="mt-3 max-w-md text-sm italic leading-relaxed text-white/75 sm:text-[15px]">
                “{hero.quote.replace(/^"|"$/g, '')}”
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-white/85 sm:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {hero.date}
                </span>
                <span className="text-white/40">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {hero.location}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onDownload}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-[#6C3BFF] shadow-lg transition hover:bg-[#F3EEFF]"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  type="button"
                  onClick={onShare}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  <Share2 className="h-4 w-4" />
                  Share Gallery
                </button>
                {onFavorite ? (
                  <button
                    type="button"
                    onClick={onFavorite}
                    aria-pressed={favoriteActive}
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
                  >
                    <Heart
                      className={`h-4 w-4 ${favoriteActive ? 'fill-rose-400 text-rose-400' : ''}`}
                    />
                    Favorite
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[
                { icon: ImageIcon, label: 'Photos', value: formatCompactCount(totals.photos) },
                { icon: Video, label: 'Videos', value: formatCompactCount(totals.videos) },
                { icon: Heart, label: 'Favorites', value: formatCompactCount(totals.favorites) },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-[96px] rounded-2xl border border-white/20 bg-white/15 px-3.5 py-3 backdrop-blur-xl"
                >
                  <stat.icon className="h-4 w-4 text-white/80" />
                  <p className="mt-1.5 text-lg font-extrabold text-white">{stat.value}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/65">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
