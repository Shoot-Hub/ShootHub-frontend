export type EditorModule =
  | 'media'
  | 'templates'
  | 'text'
  | 'captions'
  | 'audio'
  | 'music'
  | 'voice'
  | 'effects'
  | 'transitions'
  | 'filters'
  | 'overlay'
  | 'stickers'
  | 'elements'
  | 'animation'
  | 'speed'
  | 'color'
  | 'ai-studio'
  | 'export';

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5';

export type MediaSourceTab = 'project' | 'cloud' | 'brand';

export type MediaViewMode = 'grid' | 'list';

export type PropertiesTab = 'video' | 'audio' | 'speed' | 'animation' | 'ai';

export type VideoSubTab = 'basic' | 'cutout' | 'mask' | 'enhance';

export type TrackType = 'video' | 'audio' | 'voice' | 'text' | 'effects' | 'overlay';

export type ClipKind = 'video' | 'audio' | 'text' | 'adjustment' | 'effect' | 'overlay';

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'soft-light';

export type ExportPreset =
  | 'instagram-reel'
  | 'youtube'
  | 'facebook'
  | 'tiktok'
  | 'custom';

export type ExportFormat = 'mp4' | 'mov';

export type ExportResolution = '1080p' | '2k' | '4k';

export type ExportFps = 24 | 30 | 60;

export type AiToolId =
  | 'reel-generator'
  | 'auto-highlight'
  | 'auto-captions'
  | 'smart-cut'
  | 'beat-sync'
  | 'face-tracking'
  | 'bg-removal'
  | 'object-removal'
  | 'color-match'
  | 'wedding-highlight';

export type AiToolStatus = 'idle' | 'processing' | 'done';

export type MediaItem = {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'image';
  folderId: string;
  durationSec: number;
  thumbnail: string;
  width?: number;
  height?: number;
  objectUrl?: string;
  createdAt?: number;
};

export type MediaFolder = {
  id: string;
  name: string;
  count: number;
  icon?: string;
};

export type TransformProps = {
  scale: number;
  positionX: number;
  positionY: number;
  rotation: number;
  opacity: number;
  blendMode: BlendMode;
  cornerRadius: number;
  shadow: number;
};

export type AudioProps = {
  volume: number;
  fadeIn: number;
  fadeOut: number;
  noiseReduction: boolean;
  eqBass: number;
  eqMid: number;
  eqTreble: number;
};

export type SpeedProps = {
  speed: number;
  reverse: boolean;
  curveEnabled: boolean;
};

export type TextProps = {
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  alignment: 'left' | 'center' | 'right';
  stroke: number;
  glow: number;
};

export type VideoFeatures = {
  stabilization: boolean;
  lensCorrection: boolean;
  noiseReduction: boolean;
  relight: boolean;
};

export type TimelineClip = {
  id: string;
  trackId: string;
  name: string;
  kind: ClipKind;
  startFrame: number;
  durationFrames: number;
  /** Offset into source media in frames */
  sourceOffset: number;
  /** Max available source duration in frames */
  sourceDurationFrames: number;
  color?: string;
  mediaId?: string;
  thumbnail?: string;
  hasTransitionAfter?: boolean;
  locked?: boolean;
  disabled?: boolean;
};

export type TimelineTrack = {
  id: string;
  name: string;
  type: TrackType;
  locked: boolean;
  hidden: boolean;
  muted: boolean;
  color: string;
  height: number;
};

export type HistorySnapshot = {
  clips: TimelineClip[];
  tracks: TimelineTrack[];
};

export type HistoryEntry = {
  id: string;
  label: string;
  timestamp: number;
  snapshot: HistorySnapshot;
};

export type ClipboardPayload = {
  clips: TimelineClip[];
};

export type DropIndicator = {
  trackId: string;
  frame: number;
  durationFrames: number;
  valid: boolean;
} | null;

export type MediaSortKey = 'name' | 'duration' | 'type' | 'recent';

export type ContextMenuState = {
  open: boolean;
  x: number;
  y: number;
  clipId: string | null;
};

export type ExportSettings = {
  preset: ExportPreset;
  format: ExportFormat;
  resolution: ExportResolution;
  fps: ExportFps;
  watermark: boolean;
};

export type PlaybackState = {
  isPlaying: boolean;
  currentFrame: number;
  totalFrames: number;
  fps: number;
  volume: number;
  playbackSpeed: number;
  isMuted: boolean;
};

export type UiState = {
  sidebarCollapsed: boolean;
  mediaPanelOpen: boolean;
  propertiesOpen: boolean;
  activeModule: EditorModule;
  mediaTab: MediaSourceTab;
  mediaView: MediaViewMode;
  mediaSearch: string;
  selectedFolderId: string | null;
  selectedClipId: string | null;
  selectedMediaId: string | null;
  propertiesTab: PropertiesTab;
  videoSubTab: VideoSubTab;
  aspectRatio: AspectRatio;
  showSafeArea: boolean;
  previewFit: 'fit' | 'fill' | '100%';
  isFullscreen: boolean;
  timelineZoom: number;
  snapEnabled: boolean;
  exportOpen: boolean;
  shortcutsOpen: boolean;
  historyOpen: boolean;
  isPreviewLoading: boolean;
  autoSaveLabel: string;
  projectName: string;
  sequenceName: string;
  renderStatus: 'idle' | 'rendering' | 'ready';
  gpuLabel: string;
};
