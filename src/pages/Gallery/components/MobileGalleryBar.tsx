import { Camera, Download } from 'lucide-react';

type Props = {
  selectedCount: number;
  onDownload: () => void;
  onUploadSelfie: () => void;
};

export function MobileGalleryBar({ selectedCount, onDownload, onUploadSelfie }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#EEF0F4] bg-white/95 p-3 backdrop-blur-xl lg:hidden">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onUploadSelfie}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#EEF0F4] py-3 text-sm font-semibold text-[#636E72]"
        >
          <Camera className="h-4 w-4" />
          Upload Selfie
        </button>
        <button
          type="button"
          onClick={onDownload}
          disabled={selectedCount === 0}
          className="flex flex-[1.5] items-center justify-center gap-2 rounded-2xl bg-[#6C3BFF] py-3 text-sm font-semibold text-white shadow-[0_4px_16px_-2px_rgba(108,59,255,0.45)] disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Download {selectedCount > 0 ? `(${selectedCount})` : ''}
        </button>
      </div>
    </div>
  );
}
