export type AiToolId =
  | 'auto_layout'
  | 'smart_album'
  | 'face_center'
  | 'smart_crop'
  | 'remove_bg'
  | 'enhance'
  | 'color_match'
  | 'quote_gen'
  | 'story_gen'
  | 'caption_gen'
  | 'layout_suggest'
  | 'remove_object'
  | 'expand'
  | 'replace_sky';

export type AiTool = {
  id: AiToolId;
  name: string;
  description: string;
  badge?: string;
};

export const AI_TOOLS: AiTool[] = [
  { id: 'auto_layout', name: 'AI Auto Layout', description: 'Arrange photos into a balanced spread', badge: 'Popular' },
  { id: 'smart_album', name: 'AI Smart Album', description: 'Build a full album from your selects', badge: 'New' },
  { id: 'face_center', name: 'AI Face Center', description: 'Center faces inside photo frames' },
  { id: 'smart_crop', name: 'AI Smart Crop', description: 'Crop for composition and print safety' },
  { id: 'remove_bg', name: 'AI Remove Background', description: 'Isolate subject instantly' },
  { id: 'enhance', name: 'AI Enhance Image', description: 'Brightness, clarity, and color polish' },
  { id: 'color_match', name: 'AI Color Match', description: 'Harmonize tones across the spread' },
  { id: 'quote_gen', name: 'AI Quote Generator', description: 'Romantic quotes for captions' },
  { id: 'story_gen', name: 'AI Story Generator', description: 'Narrative copy for album pages' },
  { id: 'caption_gen', name: 'AI Caption Generator', description: 'Short titles and pull quotes' },
  { id: 'layout_suggest', name: 'AI Layout Suggestions', description: 'Smart alternatives for this page' },
  { id: 'remove_object', name: 'AI Remove Object', description: 'Erase distractions from photos' },
  { id: 'expand', name: 'AI Expand Image', description: 'Outpaint edges for bleed coverage' },
  { id: 'replace_sky', name: 'AI Replace Sky', description: 'Swap skies for cinematic light' },
];
