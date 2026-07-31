import type { LucideIcon } from 'lucide-react';
import {
  Crop,
  RotateCw,
  FlipHorizontal2,
  Sparkles,
  SunMedium,
  Palette,
  Aperture,
  UserRound,
  ImageOff,
  Eraser,
  LayoutTemplate,
  Layers,
  History,
  Smile,
  CloudSun,
  Heart,
  ScanFace,
} from 'lucide-react';
import type { EditorTool } from '../types';

export type EditorToolDefinition = {
  id: EditorTool;
  label: string;
  short: string;
  icon: LucideIcon;
  badge?: string;
  group: 'main' | 'ai' | 'secondary';
};

export const EDITOR_TOOLS: EditorToolDefinition[] = [
  { id: 'crop', label: 'Crop', short: 'Crop', icon: Crop, group: 'main' },
  { id: 'rotate', label: 'Rotate', short: 'Rotate', icon: RotateCw, group: 'main' },
  { id: 'flip', label: 'Flip', short: 'Flip', icon: FlipHorizontal2, group: 'main' },
  { id: 'light', label: 'Light', short: 'Light', icon: SunMedium, group: 'main' },
  { id: 'color', label: 'Color', short: 'Color', icon: Palette, group: 'main' },
  { id: 'details', label: 'Details', short: 'Detail', icon: Aperture, group: 'main' },
  {
    id: 'ai-enhance',
    label: 'AI Enhance',
    short: 'Enhance',
    icon: Sparkles,
    badge: 'NEW',
    group: 'ai',
  },
  { id: 'skin-retouch', label: 'Skin Retouch', short: 'Skin', icon: Smile, group: 'ai' },
  {
    id: 'remove-bg',
    label: 'Remove BG',
    short: 'Cutout',
    icon: ImageOff,
    badge: 'NEW',
    group: 'ai',
  },
  {
    id: 'remove-object',
    label: 'Object Removal',
    short: 'Object',
    icon: Eraser,
    badge: 'NEW',
    group: 'ai',
  },
  { id: 'sky-replace', label: 'Sky Replace', short: 'Sky', icon: CloudSun, group: 'ai' },
  {
    id: 'portrait-enhance',
    label: 'Portrait Enhance',
    short: 'Portrait',
    icon: UserRound,
    group: 'ai',
  },
  { id: 'beauty', label: 'Beauty', short: 'Beauty', icon: Heart, group: 'ai' },
  { id: 'face-detect', label: 'Face Detection', short: 'Faces', icon: ScanFace, group: 'ai' },
  {
    id: 'presets',
    label: 'Presets',
    short: 'Presets',
    icon: LayoutTemplate,
    group: 'secondary',
  },
  { id: 'batch', label: 'Batch Edit', short: 'Batch', icon: Layers, group: 'secondary' },
  { id: 'history', label: 'History', short: 'History', icon: History, group: 'secondary' },
];

export const MOBILE_TOOL_IDS: EditorTool[] = [
  'light',
  'color',
  'crop',
  'ai-enhance',
  'presets',
  'batch',
  'history',
  'remove-bg',
  'portrait-enhance',
];
