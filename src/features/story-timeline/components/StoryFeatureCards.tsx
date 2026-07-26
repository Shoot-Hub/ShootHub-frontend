import { Album, Clapperboard, Heart, ScanFace } from 'lucide-react';
import { motion } from 'framer-motion';

type Props = {
  onFaceSearch: () => void;
  onCreateAlbum: () => void;
  onFavorites: () => void;
  onReels: () => void;
};

const CARDS = [
  {
    key: 'face',
    title: 'AI Face Search',
    desc: 'Find your photos in the gallery easily.',
    icon: ScanFace,
    accent: false,
  },
  {
    key: 'album',
    title: 'Create Album',
    desc: 'Design your custom wedding album.',
    icon: Album,
    accent: false,
  },
  {
    key: 'favorites',
    title: 'My Favorites',
    desc: 'View all your favorite photos.',
    icon: Heart,
    accent: false,
  },
  {
    key: 'reels',
    title: 'Cinematic Reels',
    desc: 'Watch highlight reels from events.',
    icon: Clapperboard,
    accent: true,
  },
] as const;

export function StoryFeatureCards({
  onFaceSearch,
  onCreateAlbum,
  onFavorites,
  onReels,
}: Props) {
  const handlers = {
    face: onFaceSearch,
    album: onCreateAlbum,
    favorites: onFavorites,
    reels: onReels,
  } as const;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {CARDS.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.button
            key={card.key}
            type="button"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            onClick={handlers[card.key]}
            className={`rounded-[24px] border p-4 text-left shadow-[var(--shadow-gallery-soft)] transition hover:-translate-y-0.5 ${
              card.accent
                ? 'border-[#6C3BFF]/30 bg-gradient-to-br from-[#6C3BFF] to-[#8B5CF6] text-white'
                : 'border-[#EEF0F4] bg-white/80 text-[#111827] backdrop-blur-xl'
            }`}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                card.accent ? 'bg-white/20' : 'bg-[#F3EEFF] text-[#6C3BFF]'
              }`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm font-extrabold">{card.title}</p>
            <p
              className={`mt-1 text-xs leading-relaxed ${
                card.accent ? 'text-white/80' : 'text-[#636E72]'
              }`}
            >
              {card.desc}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
