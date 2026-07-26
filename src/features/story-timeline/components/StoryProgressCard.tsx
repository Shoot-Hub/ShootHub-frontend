import { motion } from 'framer-motion';
import type { WeddingStory } from '../types';
import { formatCompactCount } from '../utils';

type Props = {
  story: WeddingStory;
};

export function StoryProgressCard({ story }: Props) {
  return (
    <div className="rounded-[24px] border border-[#EEF0F4] bg-white p-4 shadow-[var(--shadow-gallery-soft)]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#A0A4B0]">
          Story Progress
        </p>
        <span className="text-xs font-bold text-[#6C3BFF]">
          {story.progressPercent}% completed
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F3EEFF]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${story.progressPercent}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-[#6C3BFF] to-[#8B5CF6]"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {story.events
          .filter((e) => e.completed)
          .slice(0, 6)
          .map((e) => (
            <span
              key={e.id}
              className="inline-flex items-center gap-1 rounded-full bg-[#F3EEFF] px-2 py-0.5 text-[10px] font-semibold text-[#6C3BFF]"
            >
              {e.title} ✔
            </span>
          ))}
      </div>
    </div>
  );
}

export function CoupleSummaryCard({ story }: Props) {
  const { hero, totals } = story;
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#EEF0F4] bg-white shadow-[var(--shadow-gallery-soft)]">
      <div className="relative h-20 overflow-hidden">
        <img
          src={hero.coverImage}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
      </div>
      <div className="-mt-8 px-4 pb-4">
        <img
          src={hero.photographerAvatar}
          alt={hero.photographerName}
          className="h-14 w-14 rounded-2xl object-cover ring-4 ring-white shadow-md"
        />
        <p className="mt-2 text-sm font-extrabold text-[#111827]">{hero.coupleLine}</p>
        <p className="text-xs text-[#636E72]">
          {hero.date} · {hero.location}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { label: 'Photos', value: formatCompactCount(totals.photos) },
            { label: 'Videos', value: formatCompactCount(totals.videos) },
            { label: 'Favorites', value: formatCompactCount(totals.favorites) },
            { label: 'Downloads', value: formatCompactCount(totals.downloads) },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl bg-[#F8F9FB] px-2.5 py-2"
            >
              <p className="text-sm font-extrabold text-[#111827]">{s.value}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A0A4B0]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
