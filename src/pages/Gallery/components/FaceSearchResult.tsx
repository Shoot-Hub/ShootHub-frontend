import { motion } from 'framer-motion';
import { Sparkles, Download, X } from 'lucide-react';
import type { FaceSearchResult } from '../types';

type Props = {
  result: FaceSearchResult;
  onDownloadMatched: () => void;
  onClear: () => void;
};

export function FaceSearchResult({ result, onDownloadMatched, onClear }: Props) {
  if (result.status !== 'complete') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="mb-6 overflow-hidden rounded-[24px] border border-[#6C3BFF]/20 bg-gradient-to-r from-[#F3EEFF] to-white p-5 shadow-[var(--shadow-gallery)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6 }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6C3BFF] text-white shadow-lg"
          >
            <Sparkles className="h-6 w-6" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-[#111827]">
              {result.matchedPhotoIds.length} Matching Photos Found
            </h3>
            <p className="text-sm text-[#636E72]">
              AI confidence: <span className="font-semibold text-[#6C3BFF]">{result.confidence}%</span>
            </p>
          </div>
        </div>
        <button type="button" onClick={onClear} className="rounded-full p-1.5 text-[#A0A4B0] hover:bg-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onDownloadMatched}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#6C3BFF] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_-2px_rgba(108,59,255,0.45)] transition hover:bg-[#5A2FE0]"
        >
          <Download className="h-4 w-4" />
          Download Only My Photos
        </button>
        <button
          type="button"
          onClick={onClear}
          className="rounded-2xl border border-[#EEF0F4] bg-white px-5 py-2.5 text-sm font-medium text-[#636E72] transition hover:bg-[#F8F9FB]"
        >
          Show All Photos
        </button>
      </div>
    </motion.div>
  );
}
