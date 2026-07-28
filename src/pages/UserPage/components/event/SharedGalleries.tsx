import { Images } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SharedGallery } from '../../types/dashboard.types';
import { GlassCard } from '../shared/GlassCard';

interface SharedGalleriesProps {
  galleries: SharedGallery[];
}

export function SharedGalleries({ galleries }: SharedGalleriesProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {galleries.map((gallery) => (
        <Link key={gallery.id} to="/user/galleries">
          <GlassCard className="overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={gallery.coverImage} alt="" className="h-full w-full object-cover" />
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                <Images className="h-3 w-3" />
                {gallery.photoCount} photos
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-bold text-[#111827]">{gallery.title}</h3>
              <p className="mt-0.5 text-xs text-[#9CA3AF]">Updated {gallery.updatedAt}</p>
            </div>
          </GlassCard>
        </Link>
      ))}
    </div>
  );
}
