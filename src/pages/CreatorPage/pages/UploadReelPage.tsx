import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Video,
  Upload,
  X,
  Check,
  Loader2,
  ImagePlus,
  Hash,
  AlertCircle,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { reelService } from '@/services/creator';
import type { ReelUploadData } from '@/services/creator';
import { CATEGORIES } from '../components/reels';

const inputCls =
  'w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all placeholder:text-slate-300 text-slate-700';

export function UploadReelPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [thumbPreview, setThumbPreview] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      if (thumbPreview) URL.revokeObjectURL(thumbPreview);
    };
  }, [videoPreview, thumbPreview]);

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
      setSuccess(true);
      setTimeout(() => navigate('/creator/reels'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const parsedTags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

  // ── Success screen ──
  if (success) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white mx-auto mb-6 shadow-xl shadow-blue-500/30">
            <Check className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Reel Uploaded!</h2>
          <p className="text-slate-400 text-sm">Redirecting to your reels...</p>
          <div className="mt-4 h-1 w-48 mx-auto rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2 }}
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      {/* ── Top Header ── */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-4">
          <button
            onClick={() => navigate('/creator/reels')}
            className="flex items-center justify-center h-9 w-9 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-sm">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 leading-none">Upload Reel</h1>
              <p className="text-[11px] text-slate-400">Share your creative work</p>
            </div>
          </div>
          {/* Step indicator pill */}
          <div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5">
            <div className={`h-2 w-2 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-emerald-500'}`} />
            <span className="text-[11px] font-bold text-slate-500">Step {step}/2</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-slate-100">
          <motion.div
            animate={{ width: step === 1 ? '50%' : '100%' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
          />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="flex items-center gap-2.5 p-3.5 mb-5 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-600"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
              <button onClick={() => setError('')} className="ml-auto">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {/* ════ STEP 1 — MEDIA ════ */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Hero title */}
              <div className="text-center pb-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold mb-3">
                  <Sparkles className="h-3.5 w-3.5" />
                  Step 1 of 2 — Select Media
                </div>
                <h2 className="text-xl font-black text-slate-800">Choose your video</h2>
                <p className="text-slate-400 text-sm mt-1">MP4, MOV, or AVI • Max 500MB</p>
              </div>

              {/* Video upload zone */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Video <span className="text-red-500">*</span>
                </label>
                {videoPreview ? (
                  <div className="relative rounded-3xl overflow-hidden bg-black aspect-[9/16] max-w-[220px] mx-auto shadow-2xl shadow-black/30">
                    <video
                      ref={videoRef}
                      src={videoPreview}
                      className="w-full h-full object-contain"
                      controls
                      playsInline
                    />
                    <button
                      onClick={() => { setVideoFile(null); setVideoPreview(''); }}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white border border-white/10 hover:bg-black/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/10">
                      <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-white text-xs font-medium truncate">{videoFile?.name}</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[9/16] max-w-[220px] mx-auto rounded-3xl border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-blue-500 group block"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 group-hover:bg-blue-100 transition-colors border border-blue-100">
                      <Video className="h-9 w-9 text-blue-500" />
                    </div>
                    <div className="text-center px-4">
                      <span className="text-sm font-bold block text-slate-600">Tap to select video</span>
                      <span className="text-xs mt-1 block text-slate-400">MP4, MOV, AVI</span>
                    </div>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoSelect} />
              </div>

              {/* Thumbnail upload */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Thumbnail <span className="text-slate-400 font-normal text-xs">(optional)</span>
                </label>
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white">
                  {thumbPreview ? (
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 ring-2 ring-blue-400">
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
                      className="w-24 h-16 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 flex items-center justify-center text-slate-400 hover:text-blue-500 transition-all flex-shrink-0 bg-slate-50 hover:bg-blue-50"
                    >
                      <ImagePlus className="h-6 w-6" />
                    </button>
                  )}
                  <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailSelect} />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Cover image</p>
                    <p className="text-xs text-slate-400 mt-0.5">16:9 ratio recommended</p>
                  </div>
                </div>
              </div>

              {/* Next button */}
              <button
                onClick={() => {
                  if (!videoFile) { setError('Please select a video first'); return; }
                  setStep(2);
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all"
              >
                Continue to Details →
              </button>
            </motion.div>
          )}

          {/* ════ STEP 2 — DETAILS ════ */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              {/* Hero title */}
              <div className="text-center pb-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-3">
                  <Sparkles className="h-3.5 w-3.5" />
                  Step 2 of 2 — Add Details
                </div>
                <h2 className="text-xl font-black text-slate-800">Tell us about your reel</h2>
                <p className="text-slate-400 text-sm mt-1">Help clients discover your work</p>
              </div>

              {/* Thumbnail preview strip */}
              {(thumbPreview || videoPreview) && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="w-16 h-10 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                    {thumbPreview ? (
                      <img src={thumbPreview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="h-5 w-5 text-slate-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">{videoFile?.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {videoFile ? `${(videoFile.size / 1024 / 1024).toFixed(1)} MB` : ''}
                    </p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs text-blue-600 font-semibold flex-shrink-0">
                    Change
                  </button>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
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
                <p className="text-xs text-slate-400 mt-1 text-right">{title.length}/100</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Description <span className="text-slate-400 font-normal text-xs">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your reel, the shoot, the story..."
                  rows={3}
                  className={`${inputCls} resize-none`}
                  maxLength={500}
                />
                <p className="text-xs text-slate-400 mt-1 text-right">{description.length}/500</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Category <span className="text-slate-400 font-normal text-xs">(optional)</span>
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
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Tags <span className="text-slate-400 font-normal text-xs">(comma separated)</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="wedding, cinematic, goa"
                    className={`${inputCls} pl-10`}
                  />
                </div>
                {parsedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {parsedTags.map((t, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100"
                      >
                        <Hash className="h-2.5 w-2.5" />
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={uploading || !title.trim()}
                  className="flex-[2] py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:shadow-xl hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Uploading...</>
                  ) : (
                    <><Upload className="h-4 w-4" />Upload Reel</>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
