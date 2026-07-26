import { Link } from 'react-router-dom';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Album } from '../../types';
import { getTemplate } from '../../constants';
import { StatusBadge } from '../shared';

type Props = {
  album: Album;
  onDelete: (id: string) => void;
};

export function AlbumCard({ album, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const template = getTemplate(album.templateId);
  const updated = new Date(album.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-sm transition-all hover:shadow-md hover:shadow-[#6B46FE]/8">
      <Link to={`/creator/album-designer/${album.id}/edit`} className="block">
        <div
          className="relative aspect-[4/3] overflow-hidden"
          style={{ background: template.previewGradient }}
        >
          {album.coverThumbnail ? (
            <img
              src={album.coverThumbnail}
              alt={album.info.name || 'Album cover'}
              className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <StatusBadge status={album.status} />
            <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#2D3436]">
              {album.pages.length} pages
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="truncate text-sm font-bold text-[#2D3436]">{album.info.name}</h3>
          <p className="mt-0.5 truncate text-xs text-[#A0A4B0]">
            {album.info.client || 'No client'} · {template.name}
          </p>
          <p className="mt-2 text-[11px] text-[#C0C4CC]">Updated {updated}</p>
        </div>
      </Link>

      <div className="absolute right-2 top-2">
        <button
          type="button"
          aria-label="Album actions"
          aria-expanded={menuOpen}
          onClick={(e) => {
            e.preventDefault();
            setMenuOpen((v) => !v);
          }}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-[#636E72] shadow-sm backdrop-blur hover:bg-white"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-xl border border-[#EEF0F4] bg-white py-1 shadow-xl">
              <Link
                to={`/creator/album-designer/${album.id}/edit`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#636E72] hover:bg-[#F8F9FB]"
                onClick={() => setMenuOpen(false)}
              >
                <Pencil className="h-3.5 w-3.5 text-[#6B46FE]" />
                Edit
              </Link>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#EA5455] hover:bg-red-50"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(album.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
