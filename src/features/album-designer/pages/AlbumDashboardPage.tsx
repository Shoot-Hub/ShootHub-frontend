import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookImage, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAlbumStore } from '../store';
import {
  AlbumStatsGrid,
  AlbumToolbar,
  AlbumCard,
  TemplateGalleryStrip,
} from '../components/dashboard';
import type { Album } from '../types';

function Section({
  title,
  subtitle,
  albums,
  onDelete,
  empty,
}: {
  title: string;
  subtitle: string;
  albums: Album[];
  onDelete: (id: string) => void;
  empty: string;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-base font-bold text-[#2D3436]">{title}</h2>
        <p className="text-xs text-[#A0A4B0]">{subtitle}</p>
      </div>
      {albums.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#EEF0F4] bg-white px-4 py-8 text-center text-sm text-[#A0A4B0]">
          {empty}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
}

export function AlbumDashboardPage() {
  const hydrate = useAlbumStore((s) => s.hydrate);
  const hydrated = useAlbumStore((s) => s.hydrated);
  const albums = useAlbumStore((s) => s.albums);
  const search = useAlbumStore((s) => s.search);
  const filter = useAlbumStore((s) => s.filter);
  const sort = useAlbumStore((s) => s.sort);
  const setSearch = useAlbumStore((s) => s.setSearch);
  const setFilter = useAlbumStore((s) => s.setFilter);
  const setSort = useAlbumStore((s) => s.setSort);
  const remove = useAlbumStore((s) => s.remove);
  const getFiltered = useAlbumStore((s) => s.getFiltered);
  const getStats = useAlbumStore((s) => s.getStats);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const filtered = useMemo(
    () => (hydrated ? getFiltered() : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hydrated, albums, search, filter, sort],
  );

  const stats = useMemo(
    () => (hydrated ? getStats() : { total: 0, drafts: 0, completed: 0, inProgress: 0, templatesUsed: 0 }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hydrated, albums],
  );

  const recent = filtered.slice(0, 8);
  const drafts = filtered.filter((a) => a.status === 'draft');
  const completed = filtered.filter((a) => a.status === 'completed');

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this album? This cannot be undone.')) return;
    remove(id);
    toast.success('Album deleted');
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-[#2D3436] sm:text-2xl">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3EEFF] text-[#6B46FE]">
              <BookImage className="h-5 w-5" />
            </span>
            Album Designer
          </h1>
          <p className="mt-1 text-sm text-[#A0A4B0]">
            Design professional photo albums — from draft to print-ready.
          </p>
        </div>
        <Link
          to="/creator/album-designer/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#6B46FE]/25 transition-all hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Create Album
        </Link>
      </motion.div>

      <AlbumStatsGrid stats={stats} />
      <AlbumToolbar
        search={search}
        filter={filter}
        sort={sort}
        onSearch={setSearch}
        onFilter={setFilter}
        onSort={setSort}
      />
      <TemplateGalleryStrip />

      <Section
        title="Recent Albums"
        subtitle="Picked up where you left off"
        albums={recent}
        onDelete={handleDelete}
        empty="No albums yet — create your first album to get started."
      />
      <Section
        title="Draft Albums"
        subtitle="Still in progress"
        albums={drafts}
        onDelete={handleDelete}
        empty="No drafts right now."
      />
      <Section
        title="Completed Albums"
        subtitle="Ready for delivery"
        albums={completed}
        onDelete={handleDelete}
        empty="No completed albums yet."
      />
    </div>
  );
}
