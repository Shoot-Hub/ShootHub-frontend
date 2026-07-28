import { Link } from 'react-router-dom';
import type { AlbumPreview } from '../../types/dashboard.types';
import { GlassCard } from '../shared/GlassCard';

interface AlbumsSectionProps {
  albums: AlbumPreview[];
}

const statusStyles: Record<AlbumPreview['status'], string> = {
  draft: 'bg-amber-50 text-amber-700',
  ready: 'bg-emerald-50 text-emerald-700',
  shared: 'bg-[#F3EEFF] text-[#6B46FE]',
};

export function AlbumsSection({ albums }: AlbumsSectionProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {albums.map((album) => (
        <Link key={album.id} to="/user/albums">
          <GlassCard className="flex gap-4 overflow-hidden p-3">
            <img
              src={album.coverImage}
              alt=""
              className="h-28 w-20 shrink-0 rounded-2xl object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
              <span
                className={`mb-2 w-fit rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${statusStyles[album.status]}`}
              >
                {album.status}
              </span>
              <h3 className="truncate text-sm font-bold text-[#111827]">{album.title}</h3>
              <p className="mt-1 text-xs text-[#9CA3AF]">{album.pages} pages</p>
            </div>
          </GlassCard>
        </Link>
      ))}
    </div>
  );
}
