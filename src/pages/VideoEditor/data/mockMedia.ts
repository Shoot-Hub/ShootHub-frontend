import heroWedding from '@/assets/landing/hero-wedding.jpg';
import heroPhotographer from '@/assets/landing/hero-photographer.jpg';
import heroDrone from '@/assets/landing/hero-drone.jpg';
import featured1 from '@/assets/landing/featured-creator-1.jpg';
import featured2 from '@/assets/landing/featured-creator-2.jpg';
import featured3 from '@/assets/landing/featured-creator-3.jpg';
import type {
  MediaFolder,
  MediaItem,
  TimelineClip,
  TimelineTrack,
  TransformProps,
  AudioProps,
  SpeedProps,
  TextProps,
  VideoFeatures,
  ExportSettings,
} from '../types';
import { FPS } from '../utils';

export const DEFAULT_TRANSFORM: TransformProps = {
  scale: 100,
  positionX: 0,
  positionY: 0,
  rotation: 0,
  opacity: 100,
  blendMode: 'normal',
  cornerRadius: 0,
  shadow: 0,
};

export const DEFAULT_AUDIO: AudioProps = {
  volume: 80,
  fadeIn: 0,
  fadeOut: 0,
  noiseReduction: false,
  eqBass: 0,
  eqMid: 0,
  eqTreble: 0,
};

export const DEFAULT_SPEED: SpeedProps = {
  speed: 1,
  reverse: false,
  curveEnabled: false,
};

export const DEFAULT_TEXT: TextProps = {
  content: 'A Perfect Day',
  fontFamily: 'Plus Jakarta Sans',
  fontSize: 48,
  fontWeight: 700,
  letterSpacing: 0,
  alignment: 'center',
  stroke: 0,
  glow: 0,
};

export const DEFAULT_VIDEO_FEATURES: VideoFeatures = {
  stabilization: false,
  lensCorrection: false,
  noiseReduction: false,
  relight: false,
};

export const DEFAULT_EXPORT: ExportSettings = {
  preset: 'instagram-reel',
  format: 'mp4',
  resolution: '1080p',
  fps: 30,
  watermark: false,
};

export const MEDIA_FOLDERS: MediaFolder[] = [
  { id: 'folder_wedding', name: 'Wedding Clips', count: 24 },
  { id: 'folder_reels', name: 'Reels Shot', count: 12 },
  { id: 'folder_drone', name: 'Drone Shots', count: 8 },
  { id: 'folder_audio', name: 'Audio', count: 6 },
];

export const MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'media_1',
    name: 'DJI_0045.MP4',
    type: 'video',
    folderId: 'folder_wedding',
    durationSec: 15,
    thumbnail: heroWedding,
    width: 1920,
    height: 1080,
  },
  {
    id: 'media_2',
    name: 'C0012.MOV',
    type: 'video',
    folderId: 'folder_wedding',
    durationSec: 22,
    thumbnail: featured1,
    width: 1920,
    height: 1080,
  },
  {
    id: 'media_3',
    name: 'Ceremony_Wide.MP4',
    type: 'video',
    folderId: 'folder_wedding',
    durationSec: 48,
    thumbnail: featured2,
    width: 1920,
    height: 1080,
  },
  {
    id: 'media_4',
    name: 'First_Look.MP4',
    type: 'video',
    folderId: 'folder_wedding',
    durationSec: 18,
    thumbnail: featured3,
    width: 1920,
    height: 1080,
  },
  {
    id: 'media_5',
    name: 'Reel_BTS.MP4',
    type: 'video',
    folderId: 'folder_reels',
    durationSec: 12,
    thumbnail: heroPhotographer,
    width: 1080,
    height: 1920,
  },
  {
    id: 'media_6',
    name: 'Aerial_Venue.MP4',
    type: 'video',
    folderId: 'folder_drone',
    durationSec: 30,
    thumbnail: heroDrone,
    width: 3840,
    height: 2160,
  },
  {
    id: 'media_7',
    name: 'Background Music.mp3',
    type: 'audio',
    folderId: 'folder_audio',
    durationSec: 185,
    thumbnail: '',
  },
  {
    id: 'media_8',
    name: 'Voice Over.wav',
    type: 'audio',
    folderId: 'folder_audio',
    durationSec: 42,
    thumbnail: '',
  },
];

export const INITIAL_TRACKS: TimelineTrack[] = [
  {
    id: 'track_v2',
    name: 'Video 2',
    type: 'video',
    locked: false,
    hidden: false,
    muted: false,
    color: '#7c3aed',
    height: 40,
  },
  {
    id: 'track_v1',
    name: 'Video 1',
    type: 'video',
    locked: false,
    hidden: false,
    muted: false,
    color: '#0e7490',
    height: 52,
  },
  {
    id: 'track_t1',
    name: 'Text 1',
    type: 'text',
    locked: false,
    hidden: false,
    muted: false,
    color: '#ea580c',
    height: 36,
  },
  {
    id: 'track_a1',
    name: 'Audio 1',
    type: 'audio',
    locked: false,
    hidden: false,
    muted: false,
    color: '#0d9488',
    height: 44,
  },
  {
    id: 'track_a2',
    name: 'Audio 2',
    type: 'voice',
    locked: false,
    hidden: false,
    muted: false,
    color: '#2563eb',
    height: 44,
  },
];

export const INITIAL_CLIPS: TimelineClip[] = [
  {
    id: 'clip_adj',
    trackId: 'track_v2',
    name: 'Adjustment Layer',
    kind: 'adjustment',
    startFrame: 0,
    durationFrames: FPS * 28,
    sourceOffset: 0,
    sourceDurationFrames: FPS * 28,
    color: '#7c3aed',
  },
  {
    id: 'clip_v1',
    trackId: 'track_v1',
    name: 'DJI_0045',
    kind: 'video',
    startFrame: 0,
    durationFrames: FPS * 8,
    sourceOffset: 0,
    sourceDurationFrames: FPS * 8,
    mediaId: 'media_1',
    thumbnail: heroWedding,
    hasTransitionAfter: true,
  },
  {
    id: 'clip_v2',
    trackId: 'track_v1',
    name: 'C0012',
    kind: 'video',
    startFrame: FPS * 8,
    durationFrames: FPS * 10,
    sourceOffset: 0,
    sourceDurationFrames: FPS * 10,
    mediaId: 'media_2',
    thumbnail: featured1,
    hasTransitionAfter: true,
  },
  {
    id: 'clip_v3',
    trackId: 'track_v1',
    name: 'Ceremony',
    kind: 'video',
    startFrame: FPS * 18,
    durationFrames: FPS * 12,
    sourceOffset: 0,
    sourceDurationFrames: FPS * 12,
    mediaId: 'media_3',
    thumbnail: featured2,
    hasTransitionAfter: false,
  },
  {
    id: 'clip_t1',
    trackId: 'track_t1',
    name: 'A Perfect Day',
    kind: 'text',
    startFrame: FPS * 2,
    durationFrames: FPS * 5,
    sourceOffset: 0,
    sourceDurationFrames: FPS * 5,
    color: '#ea580c',
  },
  {
    id: 'clip_t2',
    trackId: 'track_t1',
    name: 'Two Souls',
    kind: 'text',
    startFrame: FPS * 14,
    durationFrames: FPS * 4,
    sourceOffset: 0,
    sourceDurationFrames: FPS * 4,
    color: '#ea580c',
  },
  {
    id: 'clip_a1',
    trackId: 'track_a1',
    name: 'Background Music.mp3',
    kind: 'audio',
    startFrame: 0,
    durationFrames: FPS * 65,
    sourceOffset: 0,
    sourceDurationFrames: FPS * 65,
    mediaId: 'media_7',
    color: '#0d9488',
  },
  {
    id: 'clip_a2',
    trackId: 'track_a2',
    name: 'Voice Over.wav',
    kind: 'audio',
    startFrame: FPS * 6,
    durationFrames: FPS * 22,
    sourceOffset: 0,
    sourceDurationFrames: FPS * 22,
    mediaId: 'media_8',
    color: '#2563eb',
  },
];

export const INITIAL_HISTORY: Omit<import('../types').HistoryEntry, 'snapshot'>[] = [
  { id: 'h1', label: 'Project opened', timestamp: Date.now() - 120000 },
  { id: 'h2', label: 'Imported Wedding Clips', timestamp: Date.now() - 90000 },
  { id: 'h3', label: 'Added Background Music', timestamp: Date.now() - 60000 },
  { id: 'h4', label: 'Applied cross dissolve', timestamp: Date.now() - 30000 },
  { id: 'h5', label: 'Scaled clip to 100%', timestamp: Date.now() - 10000 },
];

export const TOTAL_FRAMES = FPS * 65 + 20;
