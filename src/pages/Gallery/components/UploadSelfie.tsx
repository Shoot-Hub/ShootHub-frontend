import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  progress: number;
  preview: string | null;
  status: 'idle' | 'uploading' | 'complete' | 'error';
  aiStatus: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  onUpload: (file: File) => void;
  onReset: () => void;
  compact?: boolean;
};

export function UploadSelfie({ progress, preview, status, aiStatus, onUpload, onReset, compact }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const isDisabled = status === 'uploading' || aiStatus === 'processing';

  const pickFile = useCallback((file: File | null) => {
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    if (!isImage) return;
    onUpload(file);
  }, [onUpload]);

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      if (isDisabled) return;
      pickFile(e.dataTransfer.files?.[0] ?? null);
    },
    [isDisabled, pickFile],
  );

  const openPicker = useCallback(() => {
    if (isDisabled) return;
    inputRef.current?.click();
  }, [isDisabled]);

  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    pickFile(e.target.files?.[0] ?? null);
    e.currentTarget.value = '';
  }, [pickFile]);

  const isProcessing = status === 'uploading' || aiStatus === 'processing';

  return (
    <div className={cn('rounded-[24px] border border-[#EEF0F4] bg-white p-5 shadow-[var(--shadow-gallery-soft)]', compact && 'p-4')}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3EEFF]">
            <Camera className="h-4 w-4 text-[#6C3BFF]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#111827]">Upload Your Selfie</h3>
            <p className="text-xs text-[#636E72]">AI finds photos of you</p>
          </div>
        </div>
        {preview && (
          <button type="button" onClick={onReset} className="rounded-full p-1 text-[#A0A4B0] hover:bg-[#F8F9FB]">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-2xl ring-2 ring-[#6C3BFF]/20">
              <img src={preview} alt="Selfie preview" className="h-full w-full object-cover" />
            </div>
            {isProcessing && (
              <div className="space-y-1">
                <div className="h-1.5 overflow-hidden rounded-full bg-[#EEF0F4]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#6C3BFF] to-[#8A60FF]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-xs text-[#636E72]">
                  {aiStatus === 'processing' ? 'AI scanning faces...' : `Uploading ${progress}%`}
                </p>
              </div>
            )}
            {aiStatus === 'complete' && (
              <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#6C3BFF]">
                <Sparkles className="h-3.5 w-3.5" /> Face match complete
              </div>
            )}
          </motion.div>
        ) : (
          <div
            key="dropzone"
            role="button"
            tabIndex={0}
            onClick={openPicker}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPicker();
              }
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isDisabled) setIsDragActive(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isDisabled) setIsDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragActive(false);
            }}
            onDrop={onDrop}
            className={cn(
              'cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition',
              isDragActive ? 'border-[#6C3BFF] bg-[#F3EEFF]/50' : 'border-[#EEF0F4] hover:border-[#6C3BFF]/40 hover:bg-[#F8F9FB]',
              isDisabled && 'cursor-not-allowed opacity-70',
              compact && 'p-4',
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onInputChange}
              className="hidden"
              disabled={isDisabled}
            />
            <Upload className="mx-auto h-8 w-8 text-[#6C3BFF]/60" />
            <p className="mt-2 text-sm font-medium text-[#111827]">Drag & drop your selfie</p>
            <p className="mt-1 text-xs text-[#636E72]">JPG, PNG, WEBP · Max 10MB</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
