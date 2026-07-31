import type { AiToolId } from '../types';
import {
  Clapperboard,
  Highlighter,
  Captions,
  Scissors,
  AudioLines,
  ScanFace,
  ImageOff,
  Eraser,
  Blend,
  Heart,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type AiToolDef = {
  id: AiToolId;
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  durationMs: number;
};

export const AI_TOOLS: AiToolDef[] = [
  {
    id: 'reel-generator',
    title: 'AI Reel Generator',
    description: 'Build a vertical reel from highlights in seconds.',
    icon: Clapperboard,
    badge: 'NEW',
    durationMs: 3200,
  },
  {
    id: 'auto-highlight',
    title: 'Auto Highlight',
    description: 'Detect peak moments across your wedding footage.',
    icon: Highlighter,
    durationMs: 2800,
  },
  {
    id: 'auto-captions',
    title: 'Auto Captions',
    description: 'Generate burned-in captions with timing.',
    icon: Captions,
    durationMs: 2400,
  },
  {
    id: 'smart-cut',
    title: 'Smart Cut',
    description: 'Remove silence and dead space automatically.',
    icon: Scissors,
    durationMs: 2600,
  },
  {
    id: 'beat-sync',
    title: 'Beat Sync',
    description: 'Snap cuts to the music beat grid.',
    icon: AudioLines,
    badge: 'PRO',
    durationMs: 3000,
  },
  {
    id: 'face-tracking',
    title: 'Face Tracking',
    description: 'Keep subjects framed for reels and stories.',
    icon: ScanFace,
    durationMs: 3500,
  },
  {
    id: 'bg-removal',
    title: 'Background Removal',
    description: 'Isolate subjects with studio-grade cutout.',
    icon: ImageOff,
    durationMs: 2900,
  },
  {
    id: 'object-removal',
    title: 'Object Removal',
    description: 'Paint away distractions from the frame.',
    icon: Eraser,
    durationMs: 3100,
  },
  {
    id: 'color-match',
    title: 'Color Match',
    description: 'Match grade across cameras and sequences.',
    icon: Blend,
    durationMs: 2200,
  },
  {
    id: 'wedding-highlight',
    title: 'Wedding Highlight',
    description: 'Craft a cinematic highlight film from the day.',
    icon: Heart,
    badge: 'NEW',
    durationMs: 4000,
  },
];
