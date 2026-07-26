import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import type { TimelineVideoPreview } from '../types';

type Props = {
  video: TimelineVideoPreview;
  onPlay: () => void;
};

export function VideoReelPreview({ video, onPlay }: Props) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onPlay}
      aria-label={`Play ${video.title}`}
      className="group relative aspect-[16/10] w-full overflow-hidden rounded-[22px] bg-[#111827] shadow-[0_12px_40px_-16px_rgba(17,24,39,0.45)]"
    >
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />

      <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#6C3BFF] shadow-xl transition group-hover:scale-110">
        <Play className="ml-0.5 h-6 w-6 fill-[#6C3BFF]" strokeWidth={0} />
      </span>

      <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white backdrop-blur-sm">
        {video.durationLabel}
      </span>

      <span className="absolute bottom-3 right-3 max-w-[55%] truncate rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
        Highlight Reel
      </span>
    </motion.button>
  );
}
