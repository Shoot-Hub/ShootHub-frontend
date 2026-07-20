import { motion } from 'framer-motion';
import {
  CheckSquare, Square, Download, Share2, Link2, ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

type Props = {
  selectedCount: number;
  totalVisible: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDownloadSelected: () => void;
  onShare: () => void;
  shareUrl: string;
};

export function DownloadToolbar({
  selectedCount, totalVisible, onSelectAll, onDeselectAll,
  onDownloadSelected, onShare, shareUrl,
}: Props) {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Gallery link copied!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-[73px] z-30 border-b border-[#EEF0F4] bg-[#F8F9FB]/90 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-2.5 sm:px-6 lg:px-8">
        <button type="button" onClick={onSelectAll} className="toolbar-btn">
          <CheckSquare className="h-4 w-4" /> Select All ({totalVisible})
        </button>
        <button type="button" onClick={onDeselectAll} className="toolbar-btn">
          <Square className="h-4 w-4" /> Deselect
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDownloadMenu((s) => !s)}
            disabled={selectedCount === 0}
            className={cn(
              'inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-white transition',
              selectedCount > 0
                ? 'bg-[#6C3BFF] shadow-[0_4px_16px_-2px_rgba(108,59,255,0.45)] hover:bg-[#5A2FE0]'
                : 'cursor-not-allowed bg-[#C4B5FD]',
            )}
          >
            <Download className="h-4 w-4" />
            Download {selectedCount > 0 && `(${selectedCount})`}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {showDownloadMenu && selectedCount > 0 && (
            <div className="absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-2xl border border-[#EEF0F4] bg-white p-1 shadow-lg">
              <button type="button" onClick={onDownloadSelected} className="menu-item">Download Original</button>
              <button type="button" onClick={onDownloadSelected} className="menu-item">Download Compressed</button>
            </div>
          )}
        </div>

        <button type="button" onClick={onShare} className="toolbar-btn hidden sm:inline-flex">
          <Share2 className="h-4 w-4" /> Share Gallery
        </button>
        <button type="button" onClick={copyLink} className="toolbar-btn hidden sm:inline-flex">
          <Link2 className="h-4 w-4" /> Copy Link
        </button>

        {selectedCount > 0 && (
          <span className="ml-auto text-sm font-medium text-[#6C3BFF]">{selectedCount} selected</span>
        )}
      </div>

      <style>{`
        .toolbar-btn { display: inline-flex; align-items: center; gap: 0.375rem; border-radius: 1rem; border: 1px solid #EEF0F4; background: white; padding: 0.5rem 0.875rem; font-size: 0.875rem; font-weight: 500; color: #636E72; transition: background 0.2s; }
        .toolbar-btn:hover { background: #F8F9FB; }
        .menu-item { display: block; width: 100%; border-radius: 0.75rem; padding: 0.5rem 0.75rem; text-align: left; font-size: 0.875rem; color: #636E72; }
        .menu-item:hover { background: #F3EEFF; color: #6C3BFF; }
      `}</style>
    </motion.div>
  );
}
