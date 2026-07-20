import { useEffect, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronLeft, ChevronRight, Download, Heart, Share2,
  ZoomIn, ZoomOut, RotateCw, Maximize,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { Photo } from '../types';

type Props = {
  photos: Photo[];
  currentId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
  onFavorite: (id: string) => void;
  onDownload: (id: string) => void;
};

export function PhotoModal({
  photos, currentId, isOpen, onClose, onNavigate, onFavorite, onDownload,
}: Props) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const currentIndex = photos.findIndex((p) => p.id === currentId);
  const photo = currentIndex >= 0 ? photos[currentIndex] : null;

  const goNext = useCallback(() => {
    if (currentIndex < photos.length - 1) onNavigate(photos[currentIndex + 1].id);
  }, [currentIndex, photos, onNavigate]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) onNavigate(photos[currentIndex - 1].id);
  }, [currentIndex, photos, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, goNext, goPrev]);

  useEffect(() => { setZoom(1); setRotation(0); }, [currentId]);

  if (!photo) return null;

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="text-sm">{currentIndex + 1} / {photos.length}</span>
            <div className="flex items-center gap-1">
              <ToolBtn onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}><ZoomIn className="h-5 w-5" /></ToolBtn>
              <ToolBtn onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}><ZoomOut className="h-5 w-5" /></ToolBtn>
              <ToolBtn onClick={() => setRotation((r) => r + 90)}><RotateCw className="h-5 w-5" /></ToolBtn>
              <ToolBtn onClick={() => onFavorite(photo.id)}><Heart className={`h-5 w-5 ${photo.isFavorite ? 'fill-red-400 text-red-400' : ''}`} /></ToolBtn>
              <ToolBtn onClick={() => onDownload(photo.id)}><Download className="h-5 w-5" /></ToolBtn>
              <ToolBtn onClick={share}><Share2 className="h-5 w-5" /></ToolBtn>
              <ToolBtn onClick={() => document.documentElement.requestFullscreen?.()}><Maximize className="h-5 w-5" /></ToolBtn>
              <ToolBtn onClick={onClose}><X className="h-5 w-5" /></ToolBtn>
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-12">
            <button type="button" onClick={goPrev} disabled={currentIndex === 0} className="nav-btn left-4">
              <ChevronLeft className="h-8 w-8" />
            </button>
            <motion.img
              key={photo.id}
              src={photo.url}
              alt={photo.filename}
              className="max-h-[80vh] max-w-full object-contain"
              style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            />
            <button type="button" onClick={goNext} disabled={currentIndex === photos.length - 1} className="nav-btn right-4">
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>

          <p className="pb-4 text-center text-sm text-white/70">{photo.filename}</p>

          <style>{`
            .nav-btn { position: absolute; top: 50%; transform: translateY(-50%); padding: 0.5rem; color: white; opacity: 0.7; transition: opacity 0.2s; }
            .nav-btn:hover:not(:disabled) { opacity: 1; }
            .nav-btn:disabled { opacity: 0.2; cursor: not-allowed; }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ToolBtn({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-xl p-2 transition hover:bg-white/10">
      {children}
    </button>
  );
}
