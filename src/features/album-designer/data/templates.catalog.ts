import type { TemplateId } from '../types';

export type TemplateCategoryId =
  | 'wedding'
  | 'luxury_wedding'
  | 'classic'
  | 'modern'
  | 'minimal'
  | 'dark'
  | 'magazine'
  | 'traditional'
  | 'royal'
  | 'destination'
  | 'engagement'
  | 'pre_wedding'
  | 'baby'
  | 'birthday'
  | 'corporate'
  | 'travel'
  | 'fashion';

export type PremiumTemplate = {
  id: string;
  name: string;
  category: TemplateCategoryId;
  style: string;
  aspectRatio: '3:4' | '1:1' | '4:3' | '16:9' | '2:3';
  imageSlots: number;
  previewGradient: string;
  pageBackground: string;
  accent: string;
  textColor: string;
  /** Maps onto existing album template IDs for persistence compatibility */
  baseTemplateId: TemplateId;
};

export const TEMPLATE_CATEGORIES: {
  id: TemplateCategoryId;
  label: string;
  description: string;
}[] = [
  { id: 'wedding', label: 'Wedding', description: 'Romantic ceremony spreads' },
  { id: 'luxury_wedding', label: 'Luxury Wedding', description: 'Opulent gold & velvet' },
  { id: 'classic', label: 'Classic', description: 'Timeless serif layouts' },
  { id: 'modern', label: 'Modern', description: 'Clean bold grids' },
  { id: 'minimal', label: 'Minimal', description: 'Whitespace-first' },
  { id: 'dark', label: 'Dark', description: 'Dramatic night mood' },
  { id: 'magazine', label: 'Magazine', description: 'Editorial columns' },
  { id: 'traditional', label: 'Traditional', description: 'Heritage motifs' },
  { id: 'royal', label: 'Royal', description: 'Regal ornamentation' },
  { id: 'destination', label: 'Destination', description: 'Travel romance' },
  { id: 'engagement', label: 'Engagement', description: 'Proposal stories' },
  { id: 'pre_wedding', label: 'Pre Wedding', description: 'Couple portraits' },
  { id: 'baby', label: 'Baby', description: 'Soft nursery tones' },
  { id: 'birthday', label: 'Birthday', description: 'Celebration frames' },
  { id: 'corporate', label: 'Corporate', description: 'Clean professional' },
  { id: 'travel', label: 'Travel', description: 'Wanderlust albums' },
  { id: 'fashion', label: 'Fashion', description: 'Runway editorial' },
];

const CATEGORY_PALETTES: Record<
  TemplateCategoryId,
  { gradients: string[]; bgs: string[]; accents: string[]; texts: string[]; styles: string[]; base: TemplateId }
> = {
  wedding: {
    gradients: [
      'linear-gradient(145deg,#FFF8FA 0%,#F8D7E0 50%,#E8C4A8 100%)',
      'linear-gradient(145deg,#FFFFFF 0%,#F5E6F0 100%)',
      'linear-gradient(160deg,#FDF6F0 0%,#F0D9C8 100%)',
    ],
    bgs: ['#FFF8FA', '#FFFFFF', '#FDF6F0'],
    accents: ['#C45C7A', '#6B46FE', '#B8956C'],
    texts: ['#5C3A45', '#2D3436', '#3D2B1F'],
    styles: ['Romantic', 'Soft Blush', 'Ivory'],
    base: 'floral',
  },
  luxury_wedding: {
    gradients: [
      'linear-gradient(145deg,#1A1A1A 0%,#3D2B1F 55%,#C9A227 100%)',
      'linear-gradient(145deg,#0B0B0C 0%,#2A2118 70%,#D4AF37 100%)',
      'linear-gradient(160deg,#1C1220 0%,#4A3050 60%,#E8C87A 100%)',
    ],
    bgs: ['#1A1A1A', '#0B0B0C', '#1C1220'],
    accents: ['#C9A227', '#D4AF37', '#E8C87A'],
    texts: ['#F5E6C8', '#F8F0D8', '#F5E6C8'],
    styles: ['Gold Leaf', 'Velvet Night', 'Champagne'],
    base: 'luxury',
  },
  classic: {
    gradients: [
      'linear-gradient(145deg,#F5F0E8 0%,#E8DCC8 100%)',
      'linear-gradient(145deg,#FAF7F2 0%,#EDE4D4 100%)',
      'linear-gradient(160deg,#F8F4EC 0%,#D9CBB3 100%)',
    ],
    bgs: ['#F5F0E8', '#FAF7F2', '#F8F4EC'],
    accents: ['#8B6914', '#6B5344', '#A07855'],
    texts: ['#3D2B1F', '#2C241B', '#3D2B1F'],
    styles: ['Heritage', 'Linen', 'Sepia'],
    base: 'classic',
  },
  modern: {
    gradients: [
      'linear-gradient(145deg,#F8F9FB 0%,#E8E4FF 100%)',
      'linear-gradient(145deg,#FFFFFF 0%,#E0E7FF 100%)',
      'linear-gradient(160deg,#F5F6FA 0%,#D4D0FF 100%)',
    ],
    bgs: ['#F8F9FB', '#FFFFFF', '#F5F6FA'],
    accents: ['#6B46FE', '#4F46E5', '#7C5CFF'],
    texts: ['#2D3436', '#111827', '#1F2937'],
    styles: ['Grid', 'Bold Type', 'Airy'],
    base: 'modern',
  },
  minimal: {
    gradients: [
      'linear-gradient(145deg,#FFFFFF 0%,#F0F0F0 100%)',
      'linear-gradient(145deg,#FAFAFA 0%,#EEEEEE 100%)',
      'linear-gradient(160deg,#FFFFFF 0%,#E8E8E8 100%)',
    ],
    bgs: ['#FFFFFF', '#FAFAFA', '#FFFFFF'],
    accents: ['#2D3436', '#111111', '#4B5563'],
    texts: ['#2D3436', '#111111', '#374151'],
    styles: ['Whitespace', 'Quiet', 'Mono'],
    base: 'minimal',
  },
  dark: {
    gradients: [
      'linear-gradient(145deg,#0F0F12 0%,#2A2A35 100%)',
      'linear-gradient(145deg,#121218 0%,#1E1E28 100%)',
      'linear-gradient(160deg,#0A0A0E 0%,#3A2A55 100%)',
    ],
    bgs: ['#121218', '#0F0F12', '#0A0A0E'],
    accents: ['#8A60FF', '#6B46FE', '#A78BFA'],
    texts: ['#F8F9FB', '#E5E7EB', '#F3F4F6'],
    styles: ['Noir', 'Neon Soft', 'Midnight'],
    base: 'dark',
  },
  magazine: {
    gradients: [
      'linear-gradient(145deg,#FAFAFA 0%,#E5E5E5 100%)',
      'linear-gradient(145deg,#FFFFFF 0%,#F3F3F3 100%)',
      'linear-gradient(160deg,#F7F7F7 0%,#DADADA 100%)',
    ],
    bgs: ['#FAFAFA', '#FFFFFF', '#F7F7F7'],
    accents: ['#111111', '#6B46FE', '#DC2626'],
    texts: ['#111111', '#171717', '#0A0A0A'],
    styles: ['Editorial', 'Pull Quote', 'Column'],
    base: 'magazine',
  },
  traditional: {
    gradients: [
      'linear-gradient(145deg,#FFF7ED 0%,#FDBA74 40%,#9A3412 100%)',
      'linear-gradient(145deg,#FEF3C7 0%,#F59E0B 50%,#78350F 100%)',
      'linear-gradient(160deg,#FFFBEB 0%,#D97706 100%)',
    ],
    bgs: ['#FFF7ED', '#FEF3C7', '#FFFBEB'],
    accents: ['#9A3412', '#B45309', '#92400E'],
    texts: ['#431407', '#78350F', '#451A03'],
    styles: ['Heritage Motif', 'Festive', 'Warm Clay'],
    base: 'classic',
  },
  royal: {
    gradients: [
      'linear-gradient(145deg,#1E1B4B 0%,#4C1D95 50%,#C4B5FD 100%)',
      'linear-gradient(145deg,#0F172A 0%,#1E3A8A 60%,#FBBF24 100%)',
      'linear-gradient(160deg,#312E81 0%,#7C3AED 70%,#FDE68A 100%)',
    ],
    bgs: ['#1E1B4B', '#0F172A', '#312E81'],
    accents: ['#C4B5FD', '#FBBF24', '#FDE68A'],
    texts: ['#EDE9FE', '#F8FAFC', '#FEF3C7'],
    styles: ['Crown', 'Sapphire', 'Amethyst'],
    base: 'premium',
  },
  destination: {
    gradients: [
      'linear-gradient(145deg,#ECFEFF 0%,#67E8F9 40%,#0E7490 100%)',
      'linear-gradient(145deg,#FFF7ED 0%,#FB923C 50%,#9A3412 100%)',
      'linear-gradient(160deg,#F0FDF4 0%,#34D399 50%,#065F46 100%)',
    ],
    bgs: ['#ECFEFF', '#FFF7ED', '#F0FDF4'],
    accents: ['#0E7490', '#EA580C', '#059669'],
    texts: ['#164E63', '#7C2D12', '#064E3B'],
    styles: ['Coastal', 'Desert Glow', 'Jungle'],
    base: 'modern',
  },
  engagement: {
    gradients: [
      'linear-gradient(145deg,#FDF2F8 0%,#F9A8D4 50%,#BE185D 100%)',
      'linear-gradient(145deg,#FFF1F2 0%,#FECDD3 100%)',
      'linear-gradient(160deg,#FAF5FF 0%,#E9D5FF 100%)',
    ],
    bgs: ['#FDF2F8', '#FFF1F2', '#FAF5FF'],
    accents: ['#BE185D', '#E11D48', '#7C3AED'],
    texts: ['#831843', '#881337', '#4C1D95'],
    styles: ['Promise', 'Ring Light', 'Soft Lavender'],
    base: 'floral',
  },
  pre_wedding: {
    gradients: [
      'linear-gradient(145deg,#F5F3FF 0%,#C4B5FD 50%,#5B21B6 100%)',
      'linear-gradient(145deg,#EEF2FF 0%,#A5B4FC 100%)',
      'linear-gradient(160deg,#FDF4FF 0%,#F0ABFC 100%)',
    ],
    bgs: ['#F5F3FF', '#EEF2FF', '#FDF4FF'],
    accents: ['#6B46FE', '#4F46E5', '#C026D3'],
    texts: ['#2E1065', '#312E81', '#701A75'],
    styles: ['Couple Grid', 'Dreamy', 'Sunset'],
    base: 'modern',
  },
  baby: {
    gradients: [
      'linear-gradient(145deg,#F0F9FF 0%,#BAE6FD 100%)',
      'linear-gradient(145deg,#FFF7ED 0%,#FED7AA 100%)',
      'linear-gradient(160deg,#FDF2F8 0%,#FBCFE8 100%)',
    ],
    bgs: ['#F0F9FF', '#FFF7ED', '#FDF2F8'],
    accents: ['#0EA5E9', '#FB923C', '#F472B6'],
    texts: ['#0C4A6E', '#7C2D12', '#9D174D'],
    styles: ['Nursery', 'Pastel', 'Tiny Toes'],
    base: 'white',
  },
  birthday: {
    gradients: [
      'linear-gradient(145deg,#FEF3C7 0%,#F472B6 50%,#8B5CF6 100%)',
      'linear-gradient(145deg,#FFF7ED 0%,#FB7185 100%)',
      'linear-gradient(160deg,#ECFDF5 0%,#34D399 50%,#6366F1 100%)',
    ],
    bgs: ['#FEF3C7', '#FFF7ED', '#ECFDF5'],
    accents: ['#8B5CF6', '#F43F5E', '#10B981'],
    texts: ['#4C1D95', '#9F1239', '#064E3B'],
    styles: ['Confetti', 'Party Pop', 'Balloon'],
    base: 'modern',
  },
  corporate: {
    gradients: [
      'linear-gradient(145deg,#F8FAFC 0%,#CBD5E1 100%)',
      'linear-gradient(145deg,#FFFFFF 0%,#E2E8F0 100%)',
      'linear-gradient(160deg,#F1F5F9 0%,#94A3B8 100%)',
    ],
    bgs: ['#F8FAFC', '#FFFFFF', '#F1F5F9'],
    accents: ['#0F172A', '#334155', '#6B46FE'],
    texts: ['#0F172A', '#1E293B', '#0F172A'],
    styles: ['Boardroom', 'Clean Pro', 'Brand Kit'],
    base: 'minimal',
  },
  travel: {
    gradients: [
      'linear-gradient(145deg,#ECFEFF 0%,#22D3EE 40%,#0F766E 100%)',
      'linear-gradient(145deg,#FFFBEB 0%,#FBBF24 50%,#B45309 100%)',
      'linear-gradient(160deg,#EFF6FF 0%,#60A5FA 50%,#1D4ED8 100%)',
    ],
    bgs: ['#ECFEFF', '#FFFBEB', '#EFF6FF'],
    accents: ['#0F766E', '#B45309', '#1D4ED8'],
    texts: ['#134E4A', '#78350F', '#1E3A8A'],
    styles: ['Atlas', 'Horizon', 'Passport'],
    base: 'magazine',
  },
  fashion: {
    gradients: [
      'linear-gradient(145deg,#FAFAFA 0%,#171717 100%)',
      'linear-gradient(145deg,#FFFFFF 0%,#F5F5F5 60%,#A3A3A3 100%)',
      'linear-gradient(160deg,#0A0A0A 0%,#404040 100%)',
    ],
    bgs: ['#FAFAFA', '#FFFFFF', '#0A0A0A'],
    accents: ['#171717', '#6B46FE', '#F5F5F5'],
    texts: ['#171717', '#0A0A0A', '#FAFAFA'],
    styles: ['Runway', 'Lookbook', 'Vogue'],
    base: 'magazine',
  },
};

const ASPECTS: PremiumTemplate['aspectRatio'][] = ['3:4', '1:1', '4:3', '2:3', '16:9'];
const SLOT_COUNTS = [1, 2, 3, 4, 6, 8, 10];

function buildCategoryTemplates(category: TemplateCategoryId, count = 108): PremiumTemplate[] {
  const palette = CATEGORY_PALETTES[category];
  const label = TEMPLATE_CATEGORIES.find((c) => c.id === category)?.label ?? category;
  const items: PremiumTemplate[] = [];

  for (let i = 0; i < count; i++) {
    const gi = i % palette.gradients.length;
    const style = palette.styles[i % palette.styles.length];
    const slots = SLOT_COUNTS[i % SLOT_COUNTS.length];
    const aspect = ASPECTS[i % ASPECTS.length];
    items.push({
      id: `${category}_${String(i + 1).padStart(3, '0')}`,
      name: `${label} ${style} ${i + 1}`,
      category,
      style,
      aspectRatio: aspect,
      imageSlots: slots,
      previewGradient: palette.gradients[gi],
      pageBackground: palette.bgs[gi],
      accent: palette.accents[gi],
      textColor: palette.texts[gi],
      baseTemplateId: palette.base,
    });
  }
  return items;
}

export const PREMIUM_TEMPLATES: PremiumTemplate[] = TEMPLATE_CATEGORIES.flatMap((c) =>
  buildCategoryTemplates(c.id, 108),
);

export function getTemplatesByCategory(category: TemplateCategoryId | 'all', limit = 48) {
  const list =
    category === 'all'
      ? PREMIUM_TEMPLATES
      : PREMIUM_TEMPLATES.filter((t) => t.category === category);
  return list.slice(0, limit);
}

export function searchTemplates(query: string, category: TemplateCategoryId | 'all' = 'all', limit = 48) {
  const q = query.trim().toLowerCase();
  let list = category === 'all' ? PREMIUM_TEMPLATES : PREMIUM_TEMPLATES.filter((t) => t.category === category);
  if (q) {
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.style.toLowerCase().includes(q) ||
        t.category.includes(q),
    );
  }
  return list.slice(0, limit);
}
