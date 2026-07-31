export type EditorTool =
  | 'crop'
  | 'rotate'
  | 'flip'
  | 'ai-enhance'
  | 'skin-retouch'
  | 'remove-bg'
  | 'remove-object'
  | 'sky-replace'
  | 'portrait-enhance'
  | 'beauty'
  | 'face-detect'
  | 'light'
  | 'color'
  | 'details'
  | 'presets'
  | 'batch'
  | 'history';

export type AiToolId =
  | 'ai-enhance'
  | 'skin-retouch'
  | 'remove-bg'
  | 'remove-object'
  | 'sky-replace'
  | 'portrait-enhance'
  | 'beauty'
  | 'face-detect';

export type AiFaceBox = {
  id: string;
  /** Percent of preview width/height */
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  confidence: number;
};

export type AiJobState = {
  toolId: AiToolId;
  status: 'running' | 'done' | 'cancelled';
  progress: number;
  stage: string;
  stageIndex: number;
  stageCount: number;
};

export type AiResultState = {
  toolId: AiToolId;
  previewMode: 'enhance' | 'cutout' | 'sky' | 'faces' | 'retouch' | 'object';
  faceBoxes: AiFaceBox[];
  applied: boolean;
};

export type RightTab = 'adjust' | 'presets' | 'filters';

export type ExportFormat = 'jpg' | 'png' | 'webp';

/** Tone & color adjustments — applied non-destructively via canvas */
export type Adjustments = {
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  temperature: number;
  tint: number;
  saturation: number;
  vibrance: number;
  sharpen: number;
  blur: number;
  vignette: number;
};

/** Geometric transform — never mutates the original image bytes */
export type TransformState = {
  /** Crop as % of original image (0–100) */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Degrees */
  rotation: number;
  flipH: boolean;
  flipV: boolean;
};

export type PhotoItem = {
  id: string;
  name: string;
  /** Original source URL — never overwritten by edits */
  src: string;
  thumb: string;
  width: number;
  height: number;
  adjustments: Adjustments;
  transform: TransformState;
  presetId: string | null;
  filterId: string | null;
  isLoading?: boolean;
};

export type EditSnapshot = {
  adjustments: Adjustments;
  transform: TransformState;
  presetId: string | null;
  filterId: string | null;
};

export type HistoryEntry = {
  id: string;
  label: string;
  photoId: string;
  snapshot: EditSnapshot;
  timestamp: number;
  isSnapshot?: boolean;
};

export type PresetCategory =
  | 'wedding'
  | 'haldi'
  | 'mehendi'
  | 'reception'
  | 'outdoor'
  | 'portrait'
  | 'vintage'
  | 'bw'
  | 'cinematic'
  | 'minimal';

export type PresetDefinition = {
  id: string;
  name: string;
  description: string;
  category: PresetCategory;
  thumbnail: string;
  adjustments: Partial<Adjustments>;
};

export type FilterDefinition = {
  id: string;
  name: string;
  /** Optional baked adjustment overrides for canvas filters */
  adjustments?: Partial<Adjustments>;
};

export type ExportSettings = {
  format: ExportFormat;
  quality: number;
  resizeEnabled: boolean;
  resizeWidth: number;
  watermark: boolean;
  watermarkText: string;
  renameEnabled: boolean;
  /** Tokens: {name}, {index}, {date} */
  renamePattern: string;
};

export type ClipboardEdits = {
  adjustments: Adjustments;
  transform: TransformState;
  presetId: string | null;
  filterId: string | null;
} | null;

export type BatchScope = 'selected' | 'all' | 'clipboard-selected';

export type BatchProgressState = {
  open: boolean;
  label: string;
  current: number;
  total: number;
  phase: 'running' | 'done' | 'cancelled';
};

export type BatchUndoEntry = {
  id: string;
  label: string;
  timestamp: number;
  before: Record<string, EditSnapshot>;
};

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  temperature: 0,
  tint: 0,
  saturation: 0,
  vibrance: 0,
  sharpen: 0,
  blur: 0,
  vignette: 0,
};

export const DEFAULT_TRANSFORM: TransformState = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  rotation: 0,
  flipH: false,
  flipV: false,
};

/** @deprecated use DEFAULT_TRANSFORM */
export const DEFAULT_CROP = DEFAULT_TRANSFORM;
