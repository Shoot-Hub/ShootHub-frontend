import type { LucideIcon } from 'lucide-react';
import {
  Film,
  LayoutTemplate,
  Type,
  Captions,
  Volume2,
  Music2,
  Mic,
  Sparkles,
  Blend,
  SlidersHorizontal,
  Layers,
  Sticker,
  Shapes,
  Clapperboard,
  Gauge,
  Palette,
  Wand2,
  Upload,
} from 'lucide-react';
import type { EditorModule } from '../types';

export type ModuleDef = {
  id: EditorModule;
  label: string;
  icon: LucideIcon;
  badge?: string;
};

export const EDITOR_MODULES: ModuleDef[] = [
  { id: 'media', label: 'Media', icon: Film },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'captions', label: 'Captions', icon: Captions },
  { id: 'audio', label: 'Audio', icon: Volume2 },
  { id: 'music', label: 'Music', icon: Music2 },
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'effects', label: 'Effects', icon: Sparkles },
  { id: 'transitions', label: 'Transitions', icon: Blend },
  { id: 'filters', label: 'Filters', icon: SlidersHorizontal },
  { id: 'overlay', label: 'Overlay', icon: Layers },
  { id: 'stickers', label: 'Stickers', icon: Sticker },
  { id: 'elements', label: 'Elements', icon: Shapes },
  { id: 'animation', label: 'Animation', icon: Clapperboard },
  { id: 'speed', label: 'Speed', icon: Gauge },
  { id: 'color', label: 'Color', icon: Palette },
  { id: 'ai-studio', label: 'AI Studio', icon: Wand2, badge: 'AI' },
  { id: 'export', label: 'Export', icon: Upload },
];
