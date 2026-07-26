import { motion } from 'framer-motion';
import { Heart, ScanFace, Video } from 'lucide-react';
import type { Photo } from '@/pages/Gallery/types';
import { cn } from '@/lib/utils';
import { formatCompactCount } from '../utils';

type Props = {
  photos: Photo[];
  remainingCount: number;
  onPhotoClick: (photoId: string) => void;
  onViewAll: () => void;
  showFaceBadge?: boolean;
};

export function PhotoGridPreview({
  photos,
  remainingCount,
  onPhotoClick,
  onViewAll,
  showFaceBadge,
}: Props) {
  const cells = photos.slice(0, 4);

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
      {cells.map((photo, index) => {
        const isLast = index === cells.length - 1 && remainingCount > 0;
        return (
          <motion.button
            key={photo.id}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (isLast ? onViewAll() : onPhotoClick(photo.id))}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-[#F3EEFF]"
          >
            <img
              src={photo.thumbnailUrl || photo.url}
              alt={photo.filename}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

            {photo.isFavorite ? (
              <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
                <Heart className="h-3 w-3 fill-rose-400 text-rose-400" strokeWidth={0} />
              </span>
            ) : null}

            {showFaceBadge && index === 0 ? (
              <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-[#6C3BFF] backdrop-blur-sm">
                <ScanFace className="h-3 w-3" />
                AI
              </span>
            ) : null}

            {index === 1 ? (
              <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/50 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
                <Video className="h-3 w-3" />
                Reel
              </span>
            ) : null}

            {isLast ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
                <span className="text-lg font-extrabold text-white">
                  +{formatCompactCount(remainingCount)}
                </span>
              </div>
            ) : null}
          </motion.button>
        );
      })}

      {cells.length === 0 ? (
        <div
          className={cn(
            'col-span-2 flex aspect-[2/1] items-center justify-center rounded-2xl border border-dashed border-[#EEF0F4] bg-[#F8F9FB] text-sm text-[#A0A4B0]',
          )}
        >
          Photos coming soon
        </div>
      ) : null}
    </div>
  );
}
