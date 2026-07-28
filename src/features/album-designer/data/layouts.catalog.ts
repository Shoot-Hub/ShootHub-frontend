export type LayoutSlot = { x: number; y: number; width: number; height: number };

export type LayoutPreset = {
  id: string;
  name: string;
  category:
    | '1 Image'
    | '2 Image'
    | '3 Image'
    | '4 Image'
    | '6 Image'
    | '8 Image'
    | '10 Image'
    | 'Collage'
    | 'Magazine'
    | 'Story'
    | 'Grid'
    | 'Pinterest'
    | 'Luxury';
  slots: LayoutSlot[];
  preview: string;
};

function grid(cols: number, rows: number, gap = 2, pad = 4): LayoutSlot[] {
  const slots: LayoutSlot[] = [];
  const cellW = (100 - pad * 2 - gap * (cols - 1)) / cols;
  const cellH = (100 - pad * 2 - gap * (rows - 1)) / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      slots.push({
        x: pad + c * (cellW + gap),
        y: pad + r * (cellH + gap),
        width: cellW,
        height: cellH,
      });
    }
  }
  return slots;
}

export const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: 'single-full',
    name: 'Full Bleed',
    category: '1 Image',
    slots: [{ x: 0, y: 0, width: 100, height: 100 }],
    preview: 'full',
  },
  {
    id: 'single-framed',
    name: 'Framed Center',
    category: '1 Image',
    slots: [{ x: 10, y: 12, width: 80, height: 76 }],
    preview: 'framed',
  },
  {
    id: 'two-split',
    name: 'Vertical Split',
    category: '2 Image',
    slots: [
      { x: 4, y: 4, width: 44, height: 92 },
      { x: 52, y: 4, width: 44, height: 92 },
    ],
    preview: 'vsplit',
  },
  {
    id: 'two-stack',
    name: 'Horizontal Stack',
    category: '2 Image',
    slots: [
      { x: 4, y: 4, width: 92, height: 44 },
      { x: 4, y: 52, width: 92, height: 44 },
    ],
    preview: 'hsplit',
  },
  {
    id: 'three-hero',
    name: 'Hero + Duo',
    category: '3 Image',
    slots: [
      { x: 4, y: 4, width: 92, height: 58 },
      { x: 4, y: 66, width: 44, height: 30 },
      { x: 52, y: 66, width: 44, height: 30 },
    ],
    preview: 'hero',
  },
  {
    id: 'three-column',
    name: 'Triple Column',
    category: '3 Image',
    slots: [
      { x: 3, y: 6, width: 30, height: 88 },
      { x: 35, y: 6, width: 30, height: 88 },
      { x: 67, y: 6, width: 30, height: 88 },
    ],
    preview: 'cols',
  },
  {
    id: 'four-grid',
    name: '2×2 Grid',
    category: '4 Image',
    slots: grid(2, 2),
    preview: 'grid4',
  },
  {
    id: 'four-magazine',
    name: 'Feature Quad',
    category: '4 Image',
    slots: [
      { x: 4, y: 4, width: 58, height: 60 },
      { x: 66, y: 4, width: 30, height: 28 },
      { x: 66, y: 36, width: 30, height: 28 },
      { x: 4, y: 68, width: 92, height: 28 },
    ],
    preview: 'mag4',
  },
  {
    id: 'six-grid',
    name: '3×2 Grid',
    category: '6 Image',
    slots: grid(3, 2, 2, 3),
    preview: 'grid6',
  },
  {
    id: 'eight-grid',
    name: '4×2 Mosaic',
    category: '8 Image',
    slots: grid(4, 2, 1.5, 3),
    preview: 'grid8',
  },
  {
    id: 'ten-contact',
    name: 'Contact Sheet',
    category: '10 Image',
    slots: grid(5, 2, 1.5, 3),
    preview: 'contact',
  },
  {
    id: 'collage-asymmetric',
    name: 'Asymmetric Collage',
    category: 'Collage',
    slots: [
      { x: 3, y: 3, width: 48, height: 55 },
      { x: 54, y: 3, width: 43, height: 32 },
      { x: 54, y: 38, width: 43, height: 28 },
      { x: 3, y: 61, width: 28, height: 36 },
      { x: 34, y: 61, width: 63, height: 36 },
    ],
    preview: 'collage',
  },
  {
    id: 'magazine-spread',
    name: 'Editorial Spread',
    category: 'Magazine',
    slots: [
      { x: 5, y: 8, width: 42, height: 84 },
      { x: 52, y: 8, width: 43, height: 48 },
      { x: 52, y: 60, width: 43, height: 32 },
    ],
    preview: 'editorial',
  },
  {
    id: 'story-vertical',
    name: 'Story Reel',
    category: 'Story',
    slots: [
      { x: 18, y: 4, width: 64, height: 28 },
      { x: 18, y: 36, width: 64, height: 28 },
      { x: 18, y: 68, width: 64, height: 28 },
    ],
    preview: 'story',
  },
  {
    id: 'grid-uniform',
    name: 'Uniform Grid',
    category: 'Grid',
    slots: grid(3, 3, 2, 4),
    preview: 'grid9',
  },
  {
    id: 'pinterest-masonry',
    name: 'Masonry',
    category: 'Pinterest',
    slots: [
      { x: 3, y: 3, width: 30, height: 42 },
      { x: 35, y: 3, width: 30, height: 28 },
      { x: 67, y: 3, width: 30, height: 36 },
      { x: 35, y: 34, width: 30, height: 40 },
      { x: 3, y: 48, width: 30, height: 49 },
      { x: 67, y: 42, width: 30, height: 55 },
      { x: 35, y: 77, width: 30, height: 20 },
    ],
    preview: 'masonry',
  },
  {
    id: 'luxury-centered',
    name: 'Luxury Frame',
    category: 'Luxury',
    slots: [
      { x: 12, y: 10, width: 76, height: 62 },
      { x: 18, y: 78, width: 28, height: 16 },
      { x: 54, y: 78, width: 28, height: 16 },
    ],
    preview: 'luxury',
  },
];

export const LAYOUT_CATEGORIES = Array.from(new Set(LAYOUT_PRESETS.map((l) => l.category)));
