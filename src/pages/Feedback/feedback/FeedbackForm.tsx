import {
  useCallback, useRef, useState,
  type ChangeEvent, type DragEvent, type FormEvent, type ReactNode,
} from 'react';
import { motion } from 'framer-motion';
import { Send, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SubmittedFeedback } from './data';
import { MAX_FEEDBACK_CHARS } from './data';
import { StarPicker } from './StarPicker';

type Recommend = 'yes' | 'maybe' | 'no' | null;

type Props = {
  onSuccess: (feedback: SubmittedFeedback) => void;
  className?: string;
};

export function FeedbackForm({ onSuccess, className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rating, setRating] = useState(0);
  const [recommend, setRecommend] = useState<Recommend>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [likes, setLikes] = useState('');
  const [improve, setImprove] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const pickFile = useCallback((file: File | null) => {
    if (!file?.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return;
    setScreenshot(file);
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!agreed || rating === 0) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    onSuccess({
      name: name.trim() || 'Anonymous User',
      email: email.trim(),
      rating,
      likes: likes.trim(),
      improve: improve.trim(),
      recommend,
      submittedAt: new Date().toISOString(),
    });
  };

  const recommendOptions: { id: Recommend; label: string; emoji: string }[] = [
    { id: 'yes', label: 'Yes', emoji: '😊' },
    { id: 'maybe', label: 'Maybe', emoji: '😐' },
    { id: 'no', label: 'No', emoji: '😞' },
  ];

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={onSubmit}
      className={cn(
        'rounded-[24px] border border-[#EEF0F4] bg-white p-6 shadow-[0_8px_40px_-12px_rgba(108,59,255,0.12)] sm:p-8',
        className,
      )}
    >
      <h2 className="text-lg font-bold text-[#111827]">Share Your Feedback</h2>
      <p className="mt-1 text-xs text-[#636E72]">Your feedback helps us improve ShootHub for everyone.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Your Name (Optional)">
          <input
            type="text"
            placeholder="John Doe"
            className="field-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="Your Email (Optional)">
          <input
            type="email"
            placeholder="john@example.com"
            className="field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-[#111827]">How was your overall experience?</p>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div className="mt-5">
        <CharTextarea label="What do you like about ShootHub?" value={likes} onChange={setLikes} />
      </div>

      <div className="mt-4">
        <CharTextarea label="What can we improve?" value={improve} onChange={setImprove} />
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-[#111827]">Would you recommend ShootHub to others?</p>
        <div className="flex flex-wrap gap-2">
          {recommendOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setRecommend(opt.id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition',
                recommend === opt.id
                  ? 'border-[#6C3BFF] bg-[#F3EEFF] text-[#6C3BFF]'
                  : 'border-[#EEF0F4] text-[#636E72] hover:bg-[#F8F9FB]',
              )}
            >
              <span>{opt.emoji}</span> {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-[#111827]">Upload Screenshot (Optional)</p>
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === 'Enter') inputRef.current?.click(); }}
          onDragEnter={(e) => { e.preventDefault(); setIsDragActive(true); }}
          onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragActive(false); }}
          onDrop={(e: DragEvent) => {
            e.preventDefault();
            setIsDragActive(false);
            pickFile(e.dataTransfer.files?.[0] ?? null);
          }}
          className={cn(
            'cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition',
            isDragActive ? 'border-[#6C3BFF] bg-[#F3EEFF]/40' : 'border-[#EEF0F4] hover:border-[#6C3BFF]/30',
          )}
        >
          <input ref={inputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e: ChangeEvent<HTMLInputElement>) => pickFile(e.target.files?.[0] ?? null)} />
          {screenshot ? (
            <div className="flex items-center justify-center gap-2 text-sm text-[#636E72]">
              <span className="truncate">{screenshot.name}</span>
              <button type="button" onClick={(e) => { e.stopPropagation(); setScreenshot(null); }} className="text-[#A0A4B0] hover:text-[#636E72]">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-7 w-7 text-[#6C3BFF]/50" />
              <p className="mt-2 text-sm text-[#636E72]">Drag &amp; drop or click to upload</p>
              <p className="text-xs text-[#A0A4B0]">PNG, JPG up to 5MB</p>
            </>
          )}
        </div>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-2 text-xs text-[#636E72]">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 rounded border-[#EEF0F4] text-[#6C3BFF]" />
        <span>I agree to the Privacy Policy and consent to ShootHub using my feedback to improve the platform.</span>
      </label>

      <button
        type="submit"
        disabled={!agreed || rating === 0 || submitting}
        className="mt-6 ml-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C3BFF] py-3 text-sm font-semibold text-white shadow-[0_4px_16px_-2px_rgba(108,59,255,0.45)] transition hover:bg-[#5A2FE0] disabled:cursor-not-allowed disabled:opacity-50 sm:w-48"
      >
        <Send className="h-4 w-4" />
        {submitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </motion.form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[#636E72]">{label}</span>
      {children}
    </label>
  );
}

function CharTextarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#111827]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_FEEDBACK_CHARS))}
        rows={3}
        className="field-input min-h-[88px] resize-none"
        placeholder="Share your thoughts..."
      />
      <span className="mt-1 block text-right text-xs text-[#A0A4B0]">{value.length}/{MAX_FEEDBACK_CHARS}</span>
    </label>
  );
}
