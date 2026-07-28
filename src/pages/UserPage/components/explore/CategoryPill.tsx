import { Link } from 'react-router-dom';
import type { PhotoCategory } from '../../types/dashboard.types';

interface CategoryPillProps {
  category: PhotoCategory;
}

export function CategoryPill({ category }: CategoryPillProps) {
  return (
    <Link
      to="/user/categories"
      className="group flex min-w-0 flex-col items-center gap-2.5 rounded-3xl border border-[#EEF0F4] bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6B46FE]/25 hover:shadow-[0_16px_40px_-16px_rgba(107,70,254,0.35)] sm:p-4"
    >
      <div className="h-16 w-16 overflow-hidden rounded-2xl sm:h-20 sm:w-20">
        <img
          src={category.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="min-w-0 text-center">
        <p className="truncate text-xs font-bold text-[#111827] sm:text-sm">{category.name}</p>
        <p className="text-[10px] text-[#9CA3AF]">{category.count}+</p>
      </div>
    </Link>
  );
}
