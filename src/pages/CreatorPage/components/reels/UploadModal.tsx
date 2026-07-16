import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Upload,
  X,
  Check,
  Loader2,
  ImagePlus,
  Hash,
  AlertCircle,
} from 'lucide-react';
import { reelService } from '@/services/creator';
import type { ReelUploadData } from '@/services/creator';
import { CATEGORIES } from './helpers';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const inputCls =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all placeholder:text-slate-300';

export function UploadModal({ open, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [thumbPreview, setThumbPreview] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStep(1);
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreview('');
    setThumbPreview('');
    setTitle('');
    setDescription('');
    setCategory('');
    setTagsInput('');
    setError('');
    setUploading(false);
  };

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file');
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setThumbnailFile(file);
      setThumbPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!videoFile || !title.trim()) {
      setError('Video and title are required');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
      const data: ReelUploadData = {
        video: videoFile,
        thumbnail: thumbnailFile || videoFile,
        title: title.trim(),
        description: description.trim() || undefined,
        category: category || undefined,
        tags: tags.length > 0 ? tags : undefined,
      };
      await reelService.uploadReel(data);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const parsedTags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 sm:max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Upload Reel</h2>
                  <p className="text-xs text-slate-400">Share your creative work</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ── Step Indicator ── */}
            <div className="flex items-center gap-2 px-6 py-3 bg-slate-50/60 border-b border-slate-100">
              {/* Step 1 */}
              <div className={`flex items-center gap-2 text-sm font-semibold ${step === 1 ? 'text-blue-600' : 'text-emerald-500'}`}>
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step === 1 ? 'bg-blue-600 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                  {step === 1 ? '1' : <Check className="h-3 w-3" />}
                </div>
                Media
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-slate-200" />
              {/* Step 2 */}
              <div className={`flex items-center gap-2 text-sm font-semibold ${step === 2 ? 'text-blue-600' : 'text-slate-400'}`}>
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  2
                </div>
                Details
              </div>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 mb-5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Video Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Video <span className="text-red-500">*</span>
                      </label>
                      {videoPreview ? (
                        <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] max-w-xs mx-auto shadow-xl">
                          <video
                            ref={videoRef}
                            src={videoPreview}
                            className="w-full h-full object-contain"
                            controls
                            playsInline
                          />
                          <button
                            onClick={() => { setVideoFile(null); setVideoPreview(''); }}
                            className="absolute top-2 right-2 rounded-full bg-black/60 backdrop-blur-sm p-1.5 text-white hover:bg-black/80 border border-white/10"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full aspect-[9/16] max-w-xs mx-auto rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-blue-500 group"
                        >
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 group-hover:bg-blue-50 transition-colors border border-slate-100">
                            <Video className="h-7 w-7" />
                          </div>
                          <div className="text-center">
                            <span className="text-sm font-semibold block">Tap to select video</span>
                            <span className="text-xs mt-0.5 block">MP4, MOV, or AVI</span>
                          </div>
                        </button>
                      )}
                      <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoSelect} />
                    </div>

                    {/* Thumbnail Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Thumbnail <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <div className="flex items-center gap-4">
                        {thumbPreview ? (
                          <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-100 shadow-sm">
                            <img src={thumbPreview} alt="" className="w-full h-full object-cover" />
                            <button
                              onClick={() => { setThumbnailFile(null); setThumbPreview(''); }}
                              className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => thumbInputRef.current?.click()}
                            className="w-28 h-20 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 flex items-center justify-center text-slate-400 hover:text-blue-500 transition-all hover:bg-blue-50/20"
                          >
                            <ImagePlus className="h-5 w-5" />
                          </button>
                        )}
                        <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailSelect} />
                        <p className="text-xs text-slate-400">Recommended: 16:9 ratio</p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button
                        onClick={() => {
                          if (!videoFile) { setError('Please select a video first'); return; }
                          setStep(2);
                        }}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                      >
                        Continue →
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-5"
                  >
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Give your reel a catchy title..."
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
                        placeholder="Describe your reel..."
                        rows={3}
                        className={`${inputCls} resize-none`}
                        maxLength={500}
                      />
                      <p className="text-xs text-slate-400 mt-1">{description.length}/500</p>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Category <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">Select a category</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Tags <span className="text-slate-400 font-normal">(comma separated)</span>
                      </label>
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/60">
              {step === 2 ? (
                <>
                  <button onClick={() => setStep(1)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                    ← Back
                  </button>
                  <div className="flex items-center gap-2">
                    <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors">
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={uploading || !title.trim()}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {uploading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" />Uploading...</>
                      ) : (
                        <><Upload className="h-4 w-4" />Upload Reel</>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex w-full justify-end">
                  <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
