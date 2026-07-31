import { create } from 'zustand';
import { VE_CONSTANTS } from '../utils';
import { TOTAL_FRAMES } from '../data';

type PlaybackState = {
  isPlaying: boolean;
  currentFrame: number;
  totalFrames: number;
  fps: number;
  volume: number;
  playbackSpeed: number;
  isMuted: boolean;
  loop: boolean;

  play: () => void;
  pause: () => void;
  stop: () => void;
  togglePlay: () => void;
  setCurrentFrame: (frame: number) => void;
  stepFrame: (delta: number) => void;
  setVolume: (v: number) => void;
  setPlaybackSpeed: (s: number) => void;
  toggleMute: () => void;
  setLoop: (v: boolean) => void;
  setTotalFrames: (frames: number) => void;
  ensureCapacity: (frame: number) => void;
};

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  isPlaying: false,
  currentFrame: VE_CONSTANTS.FPS * 12 + 15,
  totalFrames: TOTAL_FRAMES,
  fps: VE_CONSTANTS.FPS,
  volume: 80,
  playbackSpeed: 1,
  isMuted: false,
  loop: false,

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  stop: () => set({ isPlaying: false, currentFrame: 0 }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  setCurrentFrame: (frame) => {
    const { totalFrames } = get();
    set({
      currentFrame: Math.min(totalFrames, Math.max(0, Math.round(frame))),
    });
  },

  stepFrame: (delta) => {
    const { currentFrame, totalFrames } = get();
    set({
      currentFrame: Math.min(totalFrames, Math.max(0, currentFrame + delta)),
      isPlaying: false,
    });
  },

  setVolume: (v) => set({ volume: Math.min(100, Math.max(0, v)) }),
  setPlaybackSpeed: (s) => set({ playbackSpeed: s }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  setLoop: (v) => set({ loop: v }),
  setTotalFrames: (frames) => set({ totalFrames: Math.max(frames, VE_CONSTANTS.FPS) }),

  ensureCapacity: (frame) => {
    const { totalFrames } = get();
    if (frame + VE_CONSTANTS.FPS > totalFrames) {
      set({ totalFrames: frame + VE_CONSTANTS.FPS * 10 });
    }
  },
}));
