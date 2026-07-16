import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, X, Check, Loader2, Hash, AlertCircle } from 'lucide-react';
import { reelService } from '@/services/creator';
import type { Reel, ReelUpdateData } from '@/services/creator';
import { CATEGORIES } from './helpers';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reel: Reel;
};

const inputCls =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all placeholder:text-slate-300';

export function EditModal({ open, onClose, onSuccess, reel }: Props) {
  const [title, setTitle] = useState(reel.title);
  const [description, setDescription] = useState(reel.description || '');
  const [category, setCategory] = useState(reel.category || '');
  const [tagsInput, setTagsInput] = useState((reel.tags || []).join(', '));
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const thumbInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitle(reel.title);
      setDescription(reel.description || '');
      setCategory(reel.category || '');
      setTagsInput((reel.tags || []).join(', '));
      setThumbnailFile(null);
      setThumbPreview('');
      setError('');
    }
  }, [open, reel]);

  const handleSubmit = async () => {
    if (!title.trim()) { setError('Title is required'); return; }
    setUpdating(true);
    setError('');
    try {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
      const data: ReelUpdateData = {
        title: title.trim(),
        description: description.trim() || undefined,
        category: category || undefined,
        tags: tags.length > 0 ? tags : undefined,
      };
      if (thumbnailFile) data.thumbnail = thumbnailFile;
      await reelService.updateReel(reel._id, data);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const parsedTags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 sm:max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30">
                  <Edit3 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Edit Reel</h2>
                  <p className="text-xs text-slate-400">Update your reel details</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Change Thumbnail <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-32 h-20 rounded-xl overflow-hidden bg-slate-100 shadow-sm">
                    <img
                      src={thumbPreview || reel.thumbnail?.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {thumbPreview && (
                      <div className="absolute inset-0 ring-2 ring-blue-400 ring-inset rounded-xl" />
                    )}
                  </div>
                  <button
                    onClick={() => thumbInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
                  >
                    Browse
                  </button>
                  <input
                    ref={thumbInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) { setThumbnailFile(file); setThumbPreview(URL.createObjectURL(file)); }
                    }}
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputCls}
                  maxLength={100}
                />
                <p className="text-xs text-slate-400 mt-1">{title.length}/100</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Description <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={`${inputCls} resize-none`}
                  maxLength={500}
                />
                <p className="text-xs text-slate-400 mt-1">{description.length}/500</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tags</label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="wedding, cinematic, goa"
                    className={`${inputCls} pl-10`}
                  />
                </div>
                {parsedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {parsedTags.map((t, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
                        <Hash className="h-2.5 w-2.5" />{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
              <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={updating || !title.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:shadow-lg hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {updating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Saving...</>
                ) : (
                  <><Check className="h-4 w-4" />Save Changes</>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
