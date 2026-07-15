import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { InstaReel } from './InstaReel';
import { reelsFeed } from './data';

export function ReelsFeed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);

  const updateActive = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const index = Math.round(el.scrollTop / el.clientHeight);
    setActiveIndex(Math.min(Math.max(index, 0), reelsFeed.length - 1));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    updateActive();
    el.addEventListener('scroll', updateActive, { passive: true });
    return () => el.removeEventListener('scroll', updateActive);
  }, [updateActive]);

  const goTo = (index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const next = Math.min(Math.max(index, 0), reelsFeed.length - 1);
    el.scrollTo({ top: next * el.clientHeight, behavior: 'smooth' });
  };

  return (
    <div className="flex h-[calc(100dvh-6rem)] w-full justify-center bg-black">
      <div className="relative h-full w-full max-w-[430px] overflow-hidden bg-black sm:max-w-[480px] lg:rounded-b-2xl lg:ring-1 lg:ring-white/10">
        <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-4 pb-8 pt-3">
          <h1 className="text-base font-extrabold text-white">Reels</h1>
          <span className="text-[11px] font-semibold text-white/70">
            {activeIndex + 1} / {reelsFeed.length}
          </span>
        </div>

        <div
          ref={containerRef}
          className="h-full w-full snap-y snap-mandatory overflow-y-scroll overscroll-y-contain [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {reelsFeed.map((reel, index) => (
            <div key={reel.id} className="h-full w-full">
              <InstaReel
                reel={reel}
                isActive={index === activeIndex}
                globalMuted={muted}
                onToggleMute={() => setMuted((m) => !m)}
              />
            </div>
          ))}
        </div>

        <div className="absolute right-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 xl:flex">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm disabled:opacity-30"
            aria-label="Previous reel"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === reelsFeed.length - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm disabled:opacity-30"
            aria-label="Next reel"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
