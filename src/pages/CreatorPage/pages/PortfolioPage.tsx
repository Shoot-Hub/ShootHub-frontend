import { Images, Upload } from 'lucide-react';
import { useAuth } from '@/store';

export function PortfolioPage() {
  const { user } = useAuth();
  const images = user?.portfolioImages ?? [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
          <p className="text-sm text-gray-500">Showcase your best work to attract clients.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all">
          <Upload className="h-4 w-4" />
          Upload Images
        </button>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-blue-100 shadow-sm">
              {img.url ? (
                <img src={img.url} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Images className="h-8 w-8 text-gray-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-white p-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 mb-4">
            <Images className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No portfolio images yet</h3>
          <p className="mt-1 text-sm text-gray-500">Upload your best photos to attract more clients.</p>
          <button className="mt-4 rounded-xl bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors">
            Upload Your First Image
          </button>
        </div>
      )}
    </div>
  );
}