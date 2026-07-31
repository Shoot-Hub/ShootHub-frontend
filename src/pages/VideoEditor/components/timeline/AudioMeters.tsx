import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePlaybackStore } from '../../store';

export function AudioMeters() {
  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const volume = usePlaybackStore((s) => s.volume);
  const isMuted = usePlaybackStore((s) => s.isMuted);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      setPulse((p) => (p + 7) % 18);
    }, 120);
    return () => window.clearInterval(id);
  }, [isPlaying]);

  const base = isMuted ? 0 : isPlaying ? volume * 0.85 + pulse : volume * 0.25;

  return (
    <div className="flex h-full w-10 shrink-0 flex-col items-center justify-end gap-1 border-l border-[var(--ve-border)] bg-[var(--ve-surface)] px-1.5 py-2">
      {(['L', 'R'] as const).map((ch, i) => {
        const height = Math.min(98, base + (i === 1 ? 6 : 0));
        return (
          <div key={ch} className="flex flex-1 flex-col items-center gap-1">
            <div className="relative w-2.5 flex-1 overflow-hidden rounded-full bg-[var(--ve-track)]">
              <motion.div
                className="ve-vu-green absolute bottom-0 left-0 right-0 rounded-full"
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.12 }}
              />
            </div>
            <span className="text-[8px] font-bold text-[var(--ve-ink-muted)]">{ch}</span>
          </div>
        );
      })}
    </div>
  );
}
