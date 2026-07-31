import { useMemo, useRef, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Camera,
  Volume2,
  VolumeX,
  Square,
  Repeat,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { findClipAtFrame, framesToTimecode } from '../utils';
import {
  useMediaStore,
  usePlaybackStore,
  useTimelineStore,
  useUiStore,
} from '../store';
import { IconButton, LoadingPulse } from './ui';
import type { AspectRatio } from '../types';
import heroWedding from '@/assets/landing/hero-wedding.jpg';

const ASPECTS: AspectRatio[] = ['16:9', '9:16', '1:1', '4:5'];

const ASPECT_CLASS: Record<AspectRatio, string> = {
  '16:9': 'aspect-video',
  '9:16': 'aspect-[9/16]',
  '1:1': 'aspect-square',
  '4:5': 'aspect-[4/5]',
};

export function PreviewWindow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sequenceName = useUiStore((s) => s.sequenceName);
  const aspectRatio = useUiStore((s) => s.aspectRatio);
  const setAspectRatio = useUiStore((s) => s.setAspectRatio);
  const showSafeArea = useUiStore((s) => s.showSafeArea);
  const setShowSafeArea = useUiStore((s) => s.setShowSafeArea);
  const previewFit = useUiStore((s) => s.previewFit);
  const setPreviewFit = useUiStore((s) => s.setPreviewFit);
  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const togglePlay = usePlaybackStore((s) => s.togglePlay);
  const stop = usePlaybackStore((s) => s.stop);
  const stepFrame = usePlaybackStore((s) => s.stepFrame);
  const currentFrame = usePlaybackStore((s) => s.currentFrame);
  const totalFrames = usePlaybackStore((s) => s.totalFrames);
  const fps = usePlaybackStore((s) => s.fps);
  const isFullscreen = useUiStore((s) => s.isFullscreen);
  const setFullscreen = useUiStore((s) => s.setFullscreen);
  const isPreviewLoading = useUiStore((s) => s.isPreviewLoading);
  const isMuted = usePlaybackStore((s) => s.isMuted);
  const toggleMute = usePlaybackStore((s) => s.toggleMute);
  const volume = usePlaybackStore((s) => s.volume);
  const setVolume = usePlaybackStore((s) => s.setVolume);
  const playbackSpeed = usePlaybackStore((s) => s.playbackSpeed);
  const setPlaybackSpeed = usePlaybackStore((s) => s.setPlaybackSpeed);
  const loop = usePlaybackStore((s) => s.loop);
  const setLoop = usePlaybackStore((s) => s.setLoop);
  const setCurrentFrame = usePlaybackStore((s) => s.setCurrentFrame);
  const mediaItems = useMediaStore((s) => s.mediaItems);
  const selectedMediaId = useMediaStore((s) => s.selectedMediaId);
  const clips = useTimelineStore((s) => s.clips);
  const tracks = useTimelineStore((s) => s.tracks);
  const transform = useUiStore((s) => s.transform);

  const previewSrc = useMemo(() => {
    // Track order is top → bottom in the timeline UI
    const videoTrackIds = tracks
      .filter((t) => (t.type === 'video' || t.type === 'overlay') && !t.hidden)
      .map((t) => t.id);
    const active = findClipAtFrame(clips, videoTrackIds, currentFrame);
    if (active?.disabled) {
      // findClipAtFrame already skips disabled; keep fallback below
    }
    if (active?.thumbnail) return active.thumbnail;
    if (active?.mediaId) {
      const media = mediaItems.find((m) => m.id === active.mediaId);
      if (media?.thumbnail) return media.thumbnail;
    }
    // Empty timeline region — show void, not a random library thumb
    if (!active) return heroWedding;
    const media = mediaItems.find((m) => m.id === selectedMediaId);
    return media?.thumbnail || heroWedding;
  }, [clips, tracks, currentFrame, mediaItems, selectedMediaId]);

  const activeClipId = useMemo(() => {
    const videoTrackIds = tracks
      .filter((t) => (t.type === 'video' || t.type === 'overlay') && !t.hidden)
      .map((t) => t.id);
    return findClipAtFrame(clips, videoTrackIds, currentFrame)?.id ?? null;
  }, [clips, tracks, currentFrame]);

  const scrubProgress = totalFrames > 0 ? (currentFrame / totalFrames) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="flex min-h-0 min-w-0 flex-1 flex-col bg-[var(--ve-bg)]"
    >
      <div className="flex h-9 shrink-0 items-center gap-1.5 overflow-x-auto border-b border-[var(--ve-border)] px-2 sm:h-10 sm:gap-2 sm:px-3">
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1 rounded-[8px] px-1.5 py-1 text-[11px] font-semibold text-[var(--ve-ink)] hover:bg-[var(--ve-elevated)] sm:px-2 sm:text-[12px]"
        >
          <span className="max-w-[88px] truncate sm:max-w-none">{sequenceName}</span>
          <ChevronDown className="h-3.5 w-3.5 text-[var(--ve-ink-muted)]" />
        </button>

        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
          {ASPECTS.map((ratio) => (
            <button
              key={ratio}
              type="button"
              onClick={() => setAspectRatio(ratio)}
              className={cn(
                'rounded-[8px] px-1.5 py-1 text-[9px] font-bold tabular-nums transition-colors sm:px-2 sm:text-[10px]',
                aspectRatio === ratio
                  ? 'bg-[var(--ve-primary-soft)] text-[var(--ve-primary)]'
                  : 'text-[var(--ve-ink-muted)] hover:text-[var(--ve-ink)]',
              )}
            >
              {ratio}
            </button>
          ))}
          <IconButton
            compact
            active={showSafeArea}
            aria-label="Safe area"
            onClick={() => setShowSafeArea(!showSafeArea)}
            className="ml-1 hidden text-[10px] !w-auto px-2 sm:inline-flex"
          >
            Safe
          </IconButton>
          <span className="ml-1 hidden rounded-[8px] bg-[var(--ve-card)] px-2 py-1 text-[10px] font-bold text-[var(--ve-ink-soft)] md:inline">
            1080p
          </span>
        </div>
      </div>

      <div className="ve-canvas-bg relative flex min-h-0 flex-1 items-center justify-center p-2 sm:p-5">
        <motion.div
          className={cn(
            'relative max-h-full max-w-full overflow-hidden rounded-[var(--ve-radius-md)] bg-black shadow-[var(--ve-shadow-panel)]',
            ASPECT_CLASS[aspectRatio],
            aspectRatio === '16:9' ? 'w-full' : 'h-full',
          )}
        >
          <img
            key={activeClipId ?? 'empty'}
            src={previewSrc}
            alt="Preview"
            className="h-full w-full object-cover [transform:var(--ve-preview-transform)] [opacity:var(--ve-preview-opacity)] [border-radius:var(--ve-preview-radius)]"
            style={
              {
                '--ve-preview-transform': `scale(${transform.scale / 100}) translate(${transform.positionX}px, ${transform.positionY}px) rotate(${transform.rotation}deg)`,
                '--ve-preview-opacity': String(transform.opacity / 100),
                '--ve-preview-radius': `${transform.cornerRadius}px`,
              } as CSSProperties
            }
          />

          {showSafeArea ? (
            <div className="ve-safe-area absolute inset-[8%] sm:inset-[10%]" />
          ) : null}

          <AnimatePresence>
            {isPreviewLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]"
              >
                <LoadingPulse label="AI processing…" />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="shrink-0 border-t border-[var(--ve-border)] bg-[var(--ve-surface)] px-2 py-1.5 sm:px-3 sm:py-2">
        <div
          className="mb-1.5 h-1.5 cursor-pointer rounded-full bg-[var(--ve-track)] sm:mb-2 sm:h-1"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            setCurrentFrame(ratio * totalFrames);
          }}
          onKeyDown={() => undefined}
          role="slider"
          aria-valuenow={currentFrame}
          aria-valuemin={0}
          aria-valuemax={totalFrames}
          tabIndex={0}
        >
          <div
            className="h-full rounded-full bg-[var(--ve-primary)] [width:var(--ve-scrub-width)]"
            style={{ '--ve-scrub-width': `${scrubProgress}%` } as CSSProperties}
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <p className="min-w-0 shrink truncate text-[10px] font-bold tabular-nums text-[var(--ve-primary)] sm:min-w-[140px] sm:text-[11px]">
            {framesToTimecode(currentFrame, fps)}
            <span className="text-[var(--ve-ink-muted)]"> / </span>
            <span className="text-[var(--ve-ink-soft)]">
              {framesToTimecode(totalFrames, fps)}
            </span>
          </p>

          <div className="mx-auto flex items-center gap-0.5 sm:gap-1">
            <IconButton
              compact
              aria-label="Stop"
              icon={<Square className="h-3.5 w-3.5" />}
              onClick={stop}
              className="hidden sm:inline-flex"
            />
            <IconButton
              compact
              aria-label="Frame back"
              icon={<SkipBack className="h-4 w-4" />}
              onClick={() => stepFrame(-1)}
            />
            <motion.button
              type="button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={togglePlay}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ve-primary)] text-white shadow-[0_4px_18px_var(--ve-primary-glow)] sm:h-10 sm:w-10"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current pl-0.5" />
              )}
            </motion.button>
            <IconButton
              compact
              aria-label="Frame forward"
              icon={<SkipForward className="h-4 w-4" />}
              onClick={() => stepFrame(1)}
            />
            <IconButton
              compact
              active={loop}
              aria-label="Loop"
              icon={<Repeat className="h-3.5 w-3.5" />}
              onClick={() => setLoop(!loop)}
              className="hidden sm:inline-flex"
            />
          </div>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <select
              value={previewFit}
              onChange={(e) =>
                setPreviewFit(e.target.value as 'fit' | 'fill' | '100%')
              }
              className="hidden h-8 rounded-[8px] border border-[var(--ve-border)] bg-[var(--ve-card)] px-2 text-[11px] font-semibold text-[var(--ve-ink-soft)] outline-none sm:block"
            >
              <option value="fit">Fit</option>
              <option value="fill">Fill</option>
              <option value="100%">100%</option>
            </select>

            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="hidden h-8 rounded-[8px] border border-[var(--ve-border)] bg-[var(--ve-card)] px-2 text-[11px] font-semibold text-[var(--ve-ink-soft)] outline-none md:block"
            >
              <option value={0.5}>0.5×</option>
              <option value={1}>1×</option>
              <option value={1.5}>1.5×</option>
              <option value={2}>2×</option>
            </select>

            <IconButton
              compact
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              icon={
                isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )
              }
              onClick={toggleMute}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="hidden w-16 accent-[var(--ve-primary)] lg:block"
              aria-label="Volume"
            />
            <IconButton
              compact
              aria-label="Snapshot"
              icon={<Camera className="h-4 w-4" />}
              className="hidden sm:inline-flex"
            />
            <IconButton
              compact
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              icon={
                isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )
              }
              onClick={() => setFullscreen(!isFullscreen)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
