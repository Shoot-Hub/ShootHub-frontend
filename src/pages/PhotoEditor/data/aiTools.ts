import type { AiFaceBox, AiToolId } from '../types';

export type AiToolDefinition = {
  id: AiToolId;
  name: string;
  description: string;
  badge?: string;
  /** Mock processing stages shown during loading */
  stages: string[];
  durationMs: number;
  previewMode: 'enhance' | 'cutout' | 'sky' | 'faces' | 'retouch' | 'object';
  /** Applied on Accept — frontend-only mock effect */
  adjustments: Partial<Adjustments>;
  historyLabel: string;
};

export const AI_TOOLS: AiToolDefinition[] = [
  {
    id: 'ai-enhance',
    name: 'AI Enhance',
    description: 'Auto tone, clarity & color balance',
    badge: 'Popular',
    stages: [
      'Analyzing exposure histogram…',
      'Balancing highlights & shadows…',
      'Boosting micro-contrast…',
      'Polishing final render…',
    ],
    durationMs: 2800,
    previewMode: 'enhance',
    adjustments: {
      exposure: 0.22,
      contrast: 10,
      highlights: -14,
      shadows: 16,
      vibrance: 14,
      sharpen: 12,
    },
    historyLabel: 'AI Enhance',
  },
  {
    id: 'skin-retouch',
    name: 'Skin Retouch',
    description: 'Smooth skin while keeping texture',
    stages: [
      'Detecting skin regions…',
      'Separating texture layers…',
      'Softening blemishes…',
      'Restoring natural detail…',
    ],
    durationMs: 3200,
    previewMode: 'retouch',
    adjustments: {
      contrast: -4,
      highlights: -8,
      shadows: 10,
      sharpen: -6,
      vibrance: 4,
      temperature: 4,
      blur: 4,
    },
    historyLabel: 'Skin Retouch',
  },
  {
    id: 'remove-bg',
    name: 'Remove Background',
    description: 'Isolate subject on transparent cutout',
    badge: 'NEW',
    stages: [
      'Segmenting subject mask…',
      'Refining hair edges…',
      'Cleaning matte spill…',
      'Compositing cutout…',
    ],
    durationMs: 3400,
    previewMode: 'cutout',
    adjustments: {
      contrast: 6,
      shadows: 8,
      vibrance: 6,
    },
    historyLabel: 'Remove Background',
  },
  {
    id: 'remove-object',
    name: 'Object Removal',
    description: 'Inpaint distracting objects',
    badge: 'NEW',
    stages: [
      'Mapping object boundaries…',
      'Sampling surrounding texture…',
      'Inpainting content-aware fill…',
      'Blending seams…',
    ],
    durationMs: 3600,
    previewMode: 'object',
    adjustments: {
      sharpen: 4,
      contrast: 4,
      shadows: 6,
    },
    historyLabel: 'Object Removal',
  },
  {
    id: 'sky-replace',
    name: 'Sky Replace',
    description: 'Swap dull skies with cinematic skies',
    stages: [
      'Detecting sky region…',
      'Matching horizon line…',
      'Color-grading sky plate…',
      'Harmonizing subject light…',
    ],
    durationMs: 3000,
    previewMode: 'sky',
    adjustments: {
      temperature: -8,
      contrast: 12,
      highlights: -10,
      vibrance: 18,
      saturation: 8,
      exposure: 0.1,
    },
    historyLabel: 'Sky Replace',
  },
  {
    id: 'portrait-enhance',
    name: 'Portrait Enhance',
    description: 'Flattering light for faces & eyes',
    stages: [
      'Locating facial landmarks…',
      'Lifting facial illumination…',
      'Enhancing iris detail…',
      'Softening background falloff…',
    ],
    durationMs: 3000,
    previewMode: 'enhance',
    adjustments: {
      exposure: 0.18,
      shadows: 20,
      highlights: -12,
      temperature: 6,
      vibrance: 10,
      sharpen: 8,
      vignette: 18,
    },
    historyLabel: 'Portrait Enhance',
  },
  {
    id: 'beauty',
    name: 'Beauty',
    description: 'Subtle glamour polish for portraits',
    stages: [
      'Analyzing facial features…',
      'Evening skin tone…',
      'Adding soft glow…',
      'Finishing beauty look…',
    ],
    durationMs: 3100,
    previewMode: 'retouch',
    adjustments: {
      exposure: 0.15,
      contrast: -6,
      highlights: -10,
      shadows: 14,
      temperature: 8,
      saturation: -4,
      vibrance: 12,
      vignette: 12,
    },
    historyLabel: 'Beauty',
  },
  {
    id: 'face-detect',
    name: 'Face Detection',
    description: 'Detect & label faces in the frame',
    stages: [
      'Scanning image pyramid…',
      'Running face proposals…',
      'Scoring detections…',
      'Labeling confidence…',
    ],
    durationMs: 2400,
    previewMode: 'faces',
    adjustments: {},
    historyLabel: 'Face Detection',
  },
];

export const AI_TOOL_IDS = AI_TOOLS.map((t) => t.id);

export function getAiTool(id: string) {
  return AI_TOOLS.find((t) => t.id === id);
}

export function isAiToolId(id: string): id is AiToolId {
  return AI_TOOL_IDS.includes(id as AiToolId);
}

/** Deterministic mock face boxes from photo id — UI only */
export function mockFaceBoxes(seed: string): AiFaceBox[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const count = 1 + (hash % 3);
  const boxes: AiFaceBox[] = [];
  for (let i = 0; i < count; i++) {
    const n = (hash + i * 97) % 1000;
    const w = 14 + (n % 10);
    const h = w * 1.15;
    const x = 12 + ((n * 3) % 55);
    const y = 10 + ((n * 7) % 40);
    boxes.push({
      id: `face-${i}`,
      x: Math.min(x, 100 - w - 4),
      y: Math.min(y, 100 - h - 4),
      w,
      h,
      label: `Face ${i + 1}`,
      confidence: 0.82 + ((n % 15) / 100),
    });
  }
  return boxes;
}
