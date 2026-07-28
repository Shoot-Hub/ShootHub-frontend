import { Link } from 'react-router-dom';
import type { ShootLocation } from '../../types/dashboard.types';

interface LocationCardProps {
  location: ShootLocation;
}

export function LocationCard({ location }: LocationCardProps) {
  return (
    <Link
      to="/user/top-locations"
      className="group relative block aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_12px_32px_-12px_rgba(17,24,39,0.25)]"
    >
      <img
        src={location.image}
        alt=""
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
          {location.type}
        </p>
        <h3 className="mt-1 text-base font-bold text-white">{location.name}</h3>
        <p className="mt-0.5 text-xs text-white/75">
          {location.city} · {location.shoots}+ shoots
        </p>
      </div>
    </Link>
  );
}
