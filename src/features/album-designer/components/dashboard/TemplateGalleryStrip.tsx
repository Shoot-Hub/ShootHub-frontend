import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TEMPLATE_CATEGORIES, getTemplatesByCategory } from '../../data';

export function TemplateGalleryStrip() {
  const featured = TEMPLATE_CATEGORIES.slice(0, 8).flatMap((c) => getTemplatesByCategory(c.id, 2));

  return (
    <div className="rounded-[20px] border border-[#EEF0F4] bg-white p-5 shadow-[0_8px_32px_-12px_rgba(107,70,254,0.12)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#0A0A0B]">Premium Templates</h2>
          <p className="text-xs text-[#8B93A1]">17 categories · 100+ designs each</p>
        </div>
        <Link
          to="/creator/album-designer/new"
          className="text-xs font-bold text-[#6B46FE] hover:underline"
        >
          Browse all →
        </Link>
      </div>
      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
        {TEMPLATE_CATEGORIES.map((c) => (
          <span
            key={c.id}
            className="shrink-0 rounded-full bg-[#F3EEFF] px-2.5 py-1 text-[10px] font-bold text-[#6B46FE]"
          >
            {c.label}
          </span>
        ))}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {featured.map((t) => (
          <motion.div key={t.id} whileHover={{ y: -3 }} className="w-36 shrink-0">
            <div
              className="relative aspect-[3/4] overflow-hidden rounded-[16px] border border-[#EEF0F4] shadow-inner"
              style={{ background: t.previewGradient }}
            >
              <span className="absolute bottom-2 left-2 rounded-full bg-black/45 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                {t.imageSlots} · {t.aspectRatio}
              </span>
            </div>
            <p className="mt-2 truncate text-xs font-bold text-[#0A0A0B]">{t.name}</p>
            <p className="truncate text-[10px] text-[#8B93A1]">{t.style}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
