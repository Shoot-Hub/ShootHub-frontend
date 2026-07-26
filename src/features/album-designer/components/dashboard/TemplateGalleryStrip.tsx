import { Link } from 'react-router-dom';
import { ALBUM_TEMPLATES } from '../../constants';

export function TemplateGalleryStrip() {
  return (
    <div className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#2D3436]">Templates</h2>
          <p className="text-xs text-[#A0A4B0]">Start faster with a professional look</p>
        </div>
        <Link
          to="/creator/album-designer/new"
          className="text-xs font-bold text-[#6B46FE] hover:underline"
        >
          Use in wizard →
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {ALBUM_TEMPLATES.map((t) => (
          <div key={t.id} className="w-36 shrink-0">
            <div
              className="aspect-[3/4] rounded-xl border border-[#EEF0F4] shadow-inner"
              style={{ background: t.previewGradient }}
            />
            <p className="mt-2 truncate text-xs font-bold text-[#2D3436]">{t.name}</p>
            <p className="truncate text-[10px] text-[#A0A4B0]">{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
