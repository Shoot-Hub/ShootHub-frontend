import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Heart, Download, Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Photo } from '../types';

type Props = {
  photo: Photo;
  isSelected: boolean;
  view: 'grid' | 'list';
  onSelect: () => void;
  onFavorite: () => void;
  onDownload: () => void;
  onPreview: () => void;
  index: number;
};

export function GalleryCard({
  photo, isSelected, view, onSelect, onFavorite, onDownload, onPreview, index,
}: Props) {
  const aspect = photo.height / photo.width;

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: (index % 12) * 0.03 }}
        className="group flex items-center gap-4 rounded-2xl border border-[#EEF0F4] bg-white p-3 transition hover:shadow-md"
      >
        <button type="button" onClick={onPreview} className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
          <img src={photo.thumbnailUrl} alt={photo.filename} className="h-full w-full object-cover" loading="lazy" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[#111827]">{photo.filename}</p>
          <p className="text-xs text-[#636E72]">{photo.width} × {photo.height}</p>
        </div>
        <div className="flex items-center gap-1">
          <ActionBtn onClick={onFavorite} active={photo.isFavorite}><Heart className="h-4 w-4" /></ActionBtn>
          <ActionBtn onClick={onDownload}><Download className="h-4 w-4" /></ActionBtn>
          <ActionBtn onClick={onSelect} active={isSelected}><Check className="h-4 w-4" /></ActionBtn>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: (index % 12) * 0.04 }}
      whileHover={{ y: -4 }}
      className="group relative break-inside-avoid overflow-hidden rounded-[24px] bg-[#F8F9FB]"
      style={{ marginBottom: '12px' }}
    >
      <button type="button" onClick={onPreview} className="block w-full">
        <div className="relative overflow-hidden" style={{ paddingBottom: `${aspect * 100}%` }}>
          <img
            src={photo.thumbnailUrl}
            alt={photo.filename}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        </div>
      </button>

      <div className="absolute right-2 top-2 flex flex-col gap-1.5 opacity-0 transition group-hover:opacity-100">
        <ActionBtn onClick={onSelect} active={isSelected}><Check className="h-3.5 w-3.5" /></ActionBtn>
        <ActionBtn onClick={onFavorite} active={photo.isFavorite}><Heart className="h-3.5 w-3.5" /></ActionBtn>
        <ActionBtn onClick={onDownload}><Download className="h-3.5 w-3.5" /></ActionBtn>
      </div>

      {isSelected && (
        <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#6C3BFF] text-white shadow-lg">
          <Check className="h-4 w-4" />
        </div>
      )}
      {photo.isFavorite && (
        <Star className="absolute bottom-2 left-2 h-5 w-5 fill-amber-400 text-amber-400 drop-shadow" />
      )}
    </motion.div>
  );
}

function ActionBtn({ children, onClick, active }: { children: ReactNode; onClick: () => void; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition',
        active ? 'bg-[#6C3BFF] text-white' : 'bg-white/90 text-[#636E72] hover:bg-white',
      )}
    >
      {children}
    </button>
  );
}
