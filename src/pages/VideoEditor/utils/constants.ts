export const VE_CONSTANTS = {
  FPS: 30,
  BASE_PIXELS_PER_FRAME: 2.2,
  MIN_CLIP_FRAMES: 3,
  SNAP_THRESHOLD_FRAMES: 5,
  TRACK_HEADER_WIDTH: 112,
  RULER_HEIGHT: 28,
  TIMELINE_MIN_WIDTH: 800,
  MAX_HISTORY: 80,
  DEFAULT_IMAGE_DURATION_SEC: 5,
  ACCEPT_MIME: {
    video: ['video/mp4', 'video/quicktime', 'video/webm'],
    image: ['image/jpeg', 'image/png', 'image/jpg'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/webm'],
  },
  ACCEPT_EXT: ['.mp4', '.mov', '.webm', '.jpg', '.jpeg', '.png'],
  MEDIA_DRAG_MIME: 'application/x-shoothub-media',
} as const;

export type MediaSortKey = 'name' | 'duration' | 'type' | 'recent';
