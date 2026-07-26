import { useEffect, useState } from 'react';
import { Heart, ScanFace, Star, Calendar, Check } from 'lucide-react';
import { useAlbumPhotoLibrary, type PhotoFilterMode } from '../../hooks';
import { useWizardStore } from '../../store';
import { cn } from '@/lib/utils';

const FILTERS: { id: PhotoFilterMode; label: string; icon: typeof Heart }[] = [
  { id: 'all', label: 'All', icon: Star },
  { id: 'face', label: 'AI Face', icon: ScanFace },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'rating', label: 'Rating 4+', icon: Star },
  { id: 'date', label: 'By Date', icon: Calendar },
];

export function StepSelectPhotos() {
  const { selectedPhotoIds, setPhotos, togglePhoto } = useWizardStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<PhotoFilterMode>('all');
  const { photos, isLoading, setSelected } = useAlbumPhotoLibrary({ search, filter });

  useEffect(() => {
    setSelected(new Set(selectedPhotoIds));
  }, [selectedPhotoIds, setSelected]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#2D3436]">Select Photos</h2>
          <p className="text-sm text-[#A0A4B0]">
            Reuse uploaded gallery photos · {selectedPhotoIds.length} selected
          </p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search photos…"
          className="h-10 w-full rounded-xl border border-[#EEF0F4] bg-[#F8F9FB] px-3.5 text-sm outline-none focus:border-[#6B46FE]/40 sm:w-64"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
              filter === f.id
                ? 'border-[#6B46FE] bg-[#F3EEFF] text-[#6B46FE]'
                : 'border-[#EEF0F4] bg-white text-[#636E72] hover:bg-[#F8F9FB]',
            )}
          >
            <f.icon className="h-3.5 w-3.5" />
            {f.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPhotos(photos.map((p) => p.id))}
          className="ml-auto text-xs font-bold text-[#6B46FE] hover:underline"
        >
          Select all visible
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl bg-[#EEF0F4]" />
          ))}
        </div>
      ) : (
        <div className="grid max-h-[420px] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4 md:grid-cols-6">
          {photos.map((photo) => {
            const selected = selectedPhotoIds.includes(photo.id);
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => togglePhoto(photo.id)}
                className={cn(
                  'group relative aspect-square overflow-hidden rounded-xl border-2 transition-all',
                  selected ? 'border-[#6B46FE] ring-2 ring-[#6B46FE]/20' : 'border-transparent',
                )}
              >
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.filename}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                {photo.isFavorite && (
                  <Heart className="absolute left-1.5 top-1.5 h-3.5 w-3.5 fill-[#EA5455] text-[#EA5455]" />
                )}
                {selected && (
                  <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#6B46FE] text-white shadow">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
                <span className="absolute bottom-0 inset-x-0 bg-black/50 px-1 py-0.5 text-[9px] text-white truncate">
                  ★ {photo.rating}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
