import type { FilterDefinition } from '../types';

export const EDITOR_FILTERS: FilterDefinition[] = [
  { id: 'none', name: 'Original' },
  {
    id: 'soft',
    name: 'Soft',
    adjustments: { contrast: -8, highlights: -10, shadows: 12, saturation: -8, blur: 4 },
  },
  {
    id: 'vivid',
    name: 'Vivid',
    adjustments: { contrast: 18, saturation: 22, vibrance: 20, sharpen: 12 },
  },
  {
    id: 'bw',
    name: 'B&W',
    adjustments: { saturation: -100, contrast: 12, vignette: 15 },
  },
  {
    id: 'fade',
    name: 'Fade',
    adjustments: { contrast: -12, blacks: -15, whites: 10, saturation: -18 },
  },
  {
    id: 'warm',
    name: 'Warm',
    adjustments: { temperature: 28, tint: 6, exposure: 0.1, vibrance: 10 },
  },
  {
    id: 'cool',
    name: 'Cool',
    adjustments: { temperature: -22, tint: -4, contrast: 8 },
  },
  {
    id: 'matte',
    name: 'Matte',
    adjustments: { contrast: -10, blacks: -20, highlights: -8, saturation: -12, vignette: 20 },
  },
];
