import { useRef, useState } from 'react';
import { Pause, Play, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ReelCardProps = {
  category: string;
  title: string;
  bookings: string;
  video: string;
};

export function ReelCard({ category, title, bookings, video }: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const el = videoRef.current;
    if (!el) return;
    void el.play();
    setPlaying(true);
  };

  const pause = (reset = false) => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    if (reset) el.currentTime = 0;
    setPlaying(false);
  };

  const toggle = () => (playing ? pause() : play());

  return (
    <div
      className="group relative aspect-[9/16] w-full shrink-0 overflow-hidden rounded-[20px] bg-primary-50 shadow-card ring-1 ring-primary-100 transition-shadow hover:shadow-card-lg"
      onMouseEnter={play}
      onMouseLeave={() => pause(true)}
    >
      <video
        ref={videoRef}
        src={video}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary-600 shadow-md backdrop-blur-sm transition-transform hover:scale-105"
      >
        {playing ? (
          <Pause className="h-4 w-4 fill-primary-600" strokeWidth={0} />
        ) : (
          <Play className="ml-0.5 h-4 w-4 fill-primary-600" strokeWidth={0} />
        )}
      </button>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-primary-200">
          {category}
        </span>
        <h3 className="text-lg font-extrabold leading-tight text-white">{title}</h3>
        <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-white/80">
          <Users className="h-3.5 w-3.5" strokeWidth={2} />
          {bookings} bookings
        </span>
      </div>

      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-[20px] ring-2 ring-inset ring-primary-400/0 transition-all',
          playing && 'ring-primary-400/70',
        )}
        aria-hidden="true"
      />
    </div>
  );
}
