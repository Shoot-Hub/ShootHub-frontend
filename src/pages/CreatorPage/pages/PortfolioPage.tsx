import { Images, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '@/store';

export function PortfolioPage() {
  const { user } = useAuth();
  const images = user?.portfolioImages ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#2D3436] sm:text-2xl">Portfolio</h2>
          <p className="mt-0.5 text-sm text-[#636E72]">
            Showcase your best work to attract clients.
          </p>
        </div>
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B46FE]/25 sm:w-auto">
          <Upload className="h-4 w-4" />
          Upload Images
        </button>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {images.map((img, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-[#EEF0F4] bg-[#F0F1F5] shadow-sm"
            >
              {img.url ? (
                <img
                  src={img.url}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Images className="h-8 w-8 text-[#C4B5FD]" />
                </div>
              )}
              <button
                className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 text-[#EA5455] shadow-md backdrop-blur-sm transition-colors hover:bg-red-50 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Delete image"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E0D4FF] bg-white px-4 py-10 text-center sm:p-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F3EEFF]">
            <Images className="h-8 w-8 text-[#6B46FE]" />
          </div>
          <h3 className="text-lg font-semibold text-[#2D3436]">No portfolio images yet</h3>
          <p className="mt-1 text-sm text-[#636E72]">
            Upload your best photos to attract more clients.
          </p>
          <button className="mt-4 rounded-xl bg-[#F3EEFF] px-5 py-2.5 text-sm font-bold text-[#6B46FE] hover:bg-[#EDE5FF]">
            Upload Your First Image
          </button>
        </div>
      )}
    </div>
  );
}
