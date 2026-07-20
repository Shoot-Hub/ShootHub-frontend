import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Camera, ExternalLink, Play, UserRound, X } from 'lucide-react';

type DemoRole = 'creator' | 'client';

type WatchDemoModalProps = {
  open: boolean;
  onClose: () => void;
};

const demos: Record<
  DemoRole,
  { title: string; subtitle: string; video: string; posterHint: string }
> = {
  creator: {
    title: 'Creator Studio Demo',
    subtitle: 'See how creators manage bookings, portfolio, reels & grow on ShootHub.',
    video: '/reels/reel-4.mp4',
    posterHint: 'Creator walkthrough',
  },
  client: {
    title: 'Client Experience Demo',
    subtitle: 'See how clients discover creators, compare packages and book on ShootHub.',
    video: '/reels/reel-1.mp4',
    posterHint: 'Landing & booking walkthrough',
  },
};

export function WatchDemoModal({ open, onClose }: WatchDemoModalProps) {
  const [role, setRole] = useState<DemoRole | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) {
      setRole(null);
      videoRef.current?.pause();
      return;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!role || !videoRef.current) return;
    videoRef.current.currentTime = 0;
    void videoRef.current.play().catch(() => {
      // autoplay may be blocked — controls remain available
    });
  }, [role]);

  const demo = role ? demos[role] : null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="watch-demo-title"
        >
          <button
            type="button"
            aria-label="Close demo"
            className="absolute inset-0 bg-[#0F172A]/55 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-[0_24px_64px_-16px_rgba(15,23,42,0.35)]"
          >
            <div className="flex items-center justify-between border-b border-[#EEF0F4] px-5 py-4">
              <div className="min-w-0">
                {role ? (
                  <button
                    type="button"
                    onClick={() => {
                      videoRef.current?.pause();
                      setRole(null);
                    }}
                    className="mb-1 inline-flex items-center gap-1 text-xs font-semibold text-[#6B46FE] hover:underline"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Change role
                  </button>
                ) : null}
                <h2 id="watch-demo-title" className="text-lg font-bold text-[#2D3436]">
                  {demo?.title ?? 'Watch Demo'}
                </h2>
                <p className="mt-0.5 text-sm text-[#636E72]">
                  {demo?.subtitle ?? 'Are you a creator or a client? Pick one to play the right demo.'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#636E72] transition-colors hover:bg-[#F8F9FB]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!role ? (
              <div className="grid gap-3 p-5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setRole('creator')}
                  className="group flex flex-col items-start gap-3 rounded-2xl border border-[#EEF0F4] bg-[#FAFBFC] p-4 text-left transition-all hover:border-[#6B46FE]/40 hover:bg-[#F3EEFF] hover:shadow-md"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#6B46FE] to-[#8A60FF] text-white shadow-md shadow-[#6B46FE]/30">
                    <Camera className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                  <div>
                    <p className="text-base font-bold text-[#2D3436]">I&apos;m a Creator</p>
                    <p className="mt-1 text-xs leading-relaxed text-[#636E72]">
                      Demo of Creator Studio — bookings, portfolio, reels & growth tools.
                    </p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#6B46FE]">
                    <Play className="h-3.5 w-3.5 fill-[#6B46FE]" />
                    Play creator demo
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className="group flex flex-col items-start gap-3 rounded-2xl border border-[#EEF0F4] bg-[#FAFBFC] p-4 text-left transition-all hover:border-[#3498DB]/40 hover:bg-[#E8F4FD] hover:shadow-md"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#3498DB] to-[#5DADE2] text-white shadow-md shadow-[#3498DB]/25">
                    <UserRound className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                  <div>
                    <p className="text-base font-bold text-[#2D3436]">I&apos;m a Client</p>
                    <p className="mt-1 text-xs leading-relaxed text-[#636E72]">
                      Demo of the landing experience — find, compare and book creators.
                    </p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#3498DB]">
                    <Play className="h-3.5 w-3.5 fill-[#3498DB]" />
                    Play client demo
                  </span>
                </button>
              </div>
            ) : (
              <div className="p-5 pt-4">
                <div className="overflow-hidden rounded-2xl bg-[#0F172A] shadow-inner">
                  <video
                    ref={videoRef}
                    key={role}
                    src={demos[role].video}
                    controls
                    playsInline
                    className="aspect-video w-full bg-black object-contain"
                    aria-label={demos[role].posterHint}
                  />
                </div>
                <p className="mt-3 text-center text-xs text-[#A0A4B0]">
                  {role === 'creator'
                    ? 'Creator Studio walkthrough preview'
                    : 'Client landing & booking walkthrough preview'}
                </p>
                {role === 'client' ? (
                  <Link
                    to="/gallery/demo"
                    onClick={onClose}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#EEF0F4] bg-[#F3EEFF] py-3 text-sm font-semibold text-[#6C3BFF] transition hover:bg-[#EBE4FF]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Try Client Gallery Demo
                  </Link>
                ) : null}
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
