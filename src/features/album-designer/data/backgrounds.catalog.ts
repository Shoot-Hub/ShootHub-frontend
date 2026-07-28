export type BackgroundKind = 'Solid' | 'Gradient' | 'Pattern' | 'Texture' | 'Image' | 'Blur';

export type BackgroundItem = {
  id: string;
  name: string;
  kind: BackgroundKind;
  value: string;
};

export const BACKGROUNDS: BackgroundItem[] = [
  { id: 'bg_white', name: 'Pure White', kind: 'Solid', value: '#FFFFFF' },
  { id: 'bg_soft', name: 'Soft Gray', kind: 'Solid', value: '#F8F9FB' },
  { id: 'bg_ivory', name: 'Ivory', kind: 'Solid', value: '#F5F0E8' },
  { id: 'bg_blush', name: 'Blush', kind: 'Solid', value: '#FFF8FA' },
  { id: 'bg_ink', name: 'Ink', kind: 'Solid', value: '#121218' },
  { id: 'bg_navy', name: 'Deep Navy', kind: 'Solid', value: '#0B1220' },
  { id: 'bg_charcoal', name: 'Charcoal', kind: 'Solid', value: '#1A1A1A' },
  { id: 'bg_mist', name: 'Mist', kind: 'Solid', value: '#EEF0F4' },
  {
    id: 'bg_grad_lilac',
    name: 'Lilac Fade',
    kind: 'Gradient',
    value: 'linear-gradient(145deg, #FFFFFF 0%, #E8E4FF 100%)',
  },
  {
    id: 'bg_grad_gold',
    name: 'Gold Dusk',
    kind: 'Gradient',
    value: 'linear-gradient(145deg, #1A1A1A 0%, #3D2B1F 55%, #C9A227 100%)',
  },
  {
    id: 'bg_grad_rose',
    name: 'Rose Mist',
    kind: 'Gradient',
    value: 'linear-gradient(145deg, #FFF5F7 0%, #F8D7E0 50%, #E8C4A8 100%)',
  },
  {
    id: 'bg_grad_ocean',
    name: 'Ocean',
    kind: 'Gradient',
    value: 'linear-gradient(160deg, #ECFEFF 0%, #67E8F9 40%, #0E7490 100%)',
  },
  {
    id: 'bg_grad_violet',
    name: 'Royal Violet',
    kind: 'Gradient',
    value: 'linear-gradient(145deg, #1E1B4B 0%, #4C1D95 50%, #C4B5FD 100%)',
  },
  {
    id: 'bg_pattern_dots',
    name: 'Soft Dots',
    kind: 'Pattern',
    value:
      'radial-gradient(circle at 1px 1px, rgba(107,70,254,0.12) 1px, transparent 0) 0 0 / 16px 16px, #FFFFFF',
  },
  {
    id: 'bg_pattern_lines',
    name: 'Hairlines',
    kind: 'Pattern',
    value:
      'repeating-linear-gradient(90deg, transparent, transparent 11px, rgba(10,10,11,0.04) 11px, rgba(10,10,11,0.04) 12px), #FAFAFA',
  },
  {
    id: 'bg_texture_paper',
    name: 'Paper Grain',
    kind: 'Texture',
    value: 'linear-gradient(180deg, #F8F6F1 0%, #F0EBE3 100%)',
  },
  {
    id: 'bg_texture_linen',
    name: 'Linen',
    kind: 'Texture',
    value: 'linear-gradient(135deg, #F5F0E8 0%, #E8DCC8 100%)',
  },
  {
    id: 'bg_blur_soft',
    name: 'Soft Blur Wash',
    kind: 'Blur',
    value: 'linear-gradient(145deg, #F3EEFF 0%, #FFFFFF 50%, #EEF2FF 100%)',
  },
];

export const BACKGROUND_KINDS: BackgroundKind[] = [
  'Solid',
  'Gradient',
  'Pattern',
  'Texture',
  'Image',
  'Blur',
];
