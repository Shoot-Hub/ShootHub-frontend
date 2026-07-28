export type ElementCategory =
  | 'Wedding Icons'
  | 'Flowers'
  | 'Leaves'
  | 'Frames'
  | 'Borders'
  | 'Watercolor'
  | 'Brush'
  | 'Shapes'
  | 'Arrows'
  | 'Lines'
  | 'Ribbons'
  | 'Luxury Decorations';

export type DesignElementItem = {
  id: string;
  name: string;
  category: ElementCategory;
  emoji: string;
  accent: string;
};

const RAW: Array<[ElementCategory, string, string, string]> = [
  ['Wedding Icons', 'Rings', '💍', '#C9A227'],
  ['Wedding Icons', 'Cake', '🎂', '#F472B6'],
  ['Wedding Icons', 'Champagne', '🥂', '#D4AF37'],
  ['Wedding Icons', 'Bouquet', '💐', '#C45C7A'],
  ['Wedding Icons', 'Church', '⛪', '#6B46FE'],
  ['Wedding Icons', 'Heart Lock', '🔐', '#BE185D'],
  ['Flowers', 'Rose', '🌹', '#E11D48'],
  ['Flowers', 'Tulip', '🌷', '#F472B6'],
  ['Flowers', 'Cherry Blossom', '🌸', '#F9A8D4'],
  ['Flowers', 'Lotus', '🪷', '#A78BFA'],
  ['Flowers', 'Sunflower', '🌻', '#F59E0B'],
  ['Leaves', 'Leaf', '🍃', '#22C55E'],
  ['Leaves', 'Fern', '🌿', '#16A34A'],
  ['Leaves', 'Palm', '🌴', '#059669'],
  ['Frames', 'Ornate Frame', '🖼️', '#8B6914'],
  ['Frames', 'Polaroid', '📷', '#2D3436'],
  ['Frames', 'Gold Corner', '✨', '#C9A227'],
  ['Borders', 'Dashed Border', '▭', '#6B46FE'],
  ['Borders', 'Double Line', '═', '#111111'],
  ['Borders', 'Filigree', '꧁', '#C9A227'],
  ['Watercolor', 'Wash Blob', '🫧', '#A78BFA'],
  ['Watercolor', 'Splash', '💦', '#38BDF8'],
  ['Watercolor', 'Ink Bleed', '🎨', '#F472B6'],
  ['Brush', 'Stroke', '🖌️', '#6B46FE'],
  ['Brush', 'Scribble', '〰️', '#111111'],
  ['Brush', 'Paint Dab', '🖍️', '#EF4444'],
  ['Shapes', 'Circle', '●', '#6B46FE'],
  ['Shapes', 'Square', '■', '#2D3436'],
  ['Shapes', 'Triangle', '▲', '#8B93A1'],
  ['Shapes', 'Diamond', '◆', '#C9A227'],
  ['Shapes', 'Star', '★', '#F59E0B'],
  ['Arrows', 'Arrow Right', '→', '#6B46FE'],
  ['Arrows', 'Arrow Curve', '↩', '#8B93A1'],
  ['Arrows', 'Chevron', '›', '#2D3436'],
  ['Lines', 'Thin Line', '—', '#2D3436'],
  ['Lines', 'Dotted', '⋯', '#8B93A1'],
  ['Lines', 'Divider', '⸻', '#C9A227'],
  ['Ribbons', 'Banner', '🎀', '#F472B6'],
  ['Ribbons', 'Sash', '🎗️', '#C9A227'],
  ['Luxury Decorations', 'Crown', '👑', '#D4AF37'],
  ['Luxury Decorations', 'Gem', '💎', '#38BDF8'],
  ['Luxury Decorations', 'Sparkle Cluster', '✦', '#C9A227'],
  ['Luxury Decorations', 'Flourish', '❧', '#8B6914'],
];

export const DESIGN_ELEMENTS: DesignElementItem[] = RAW.map(([category, name, emoji, accent], i) => ({
  id: `el_${i + 1}`,
  name,
  category,
  emoji,
  accent,
}));

export const ELEMENT_CATEGORIES = Array.from(new Set(DESIGN_ELEMENTS.map((e) => e.category)));

export type StickerCategory =
  | 'Wedding'
  | 'Love'
  | 'Birthday'
  | 'Travel'
  | 'Baby'
  | 'Corporate'
  | 'Minimal';

export type StickerItem = {
  id: string;
  name: string;
  category: StickerCategory;
  emoji: string;
};

export const STICKERS: StickerItem[] = [
  { id: 'st_1', name: 'Just Married', category: 'Wedding', emoji: '👰' },
  { id: 'st_2', name: 'Mr & Mrs', category: 'Wedding', emoji: '🤵' },
  { id: 'st_3', name: 'Kiss', category: 'Love', emoji: '💋' },
  { id: 'st_4', name: 'Heart Eyes', category: 'Love', emoji: '😍' },
  { id: 'st_5', name: 'Party', category: 'Birthday', emoji: '🎉' },
  { id: 'st_6', name: 'Cake Slice', category: 'Birthday', emoji: '🧁' },
  { id: 'st_7', name: 'Airplane', category: 'Travel', emoji: '✈️' },
  { id: 'st_8', name: 'Camera', category: 'Travel', emoji: '📸' },
  { id: 'st_9', name: 'Baby Bottle', category: 'Baby', emoji: '🍼' },
  { id: 'st_10', name: 'Footprint', category: 'Baby', emoji: '👣' },
  { id: 'st_11', name: 'Handshake', category: 'Corporate', emoji: '🤝' },
  { id: 'st_12', name: 'Briefcase', category: 'Corporate', emoji: '💼' },
  { id: 'st_13', name: 'Dot', category: 'Minimal', emoji: '•' },
  { id: 'st_14', name: 'Line Mark', category: 'Minimal', emoji: '|' },
  { id: 'st_15', name: 'Love Letter', category: 'Love', emoji: '💌' },
  { id: 'st_16', name: 'Balloon', category: 'Birthday', emoji: '🎈' },
];

export const STICKER_CATEGORIES = Array.from(new Set(STICKERS.map((s) => s.category)));
