import type { TemplateId } from '../types';

export type AlbumTemplateMeta = {
  id: TemplateId;
  name: string;
  description: string;
  previewGradient: string;
  pageBackground: string;
  accent: string;
  textColor: string;
};

export const ALBUM_TEMPLATES: AlbumTemplateMeta[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean grids with bold typography',
    previewGradient: 'linear-gradient(135deg, #F8F9FB 0%, #E8E4FF 100%)',
    pageBackground: '#F8F9FB',
    accent: '#6B46FE',
    textColor: '#2D3436',
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Gold accents and elegant spacing',
    previewGradient: 'linear-gradient(135deg, #1A1A1A 0%, #3D2B1F 55%, #C9A227 100%)',
    pageBackground: '#1A1A1A',
    accent: '#C9A227',
    textColor: '#F5E6C8',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Timeless serif layouts',
    previewGradient: 'linear-gradient(135deg, #F5F0E8 0%, #E8DCC8 100%)',
    pageBackground: '#F5F0E8',
    accent: '#8B6914',
    textColor: '#3D2B1F',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Whitespace-first compositions',
    previewGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F0F0F0 100%)',
    pageBackground: '#FFFFFF',
    accent: '#2D3436',
    textColor: '#2D3436',
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Dramatic night-mood pages',
    previewGradient: 'linear-gradient(135deg, #0F0F12 0%, #2A2A35 100%)',
    pageBackground: '#121218',
    accent: '#8A60FF',
    textColor: '#F8F9FB',
  },
  {
    id: 'white',
    name: 'White',
    description: 'Bright editorial spreads',
    previewGradient: 'linear-gradient(135deg, #FFFFFF 0%, #EEF0F4 100%)',
    pageBackground: '#FFFFFF',
    accent: '#6B46FE',
    textColor: '#2D3436',
  },
  {
    id: 'floral',
    name: 'Floral',
    description: 'Soft blush botanical frames',
    previewGradient: 'linear-gradient(135deg, #FFF5F7 0%, #F8D7E0 50%, #E8C4A8 100%)',
    pageBackground: '#FFF8FA',
    accent: '#C45C7A',
    textColor: '#5C3A45',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Rich contrast with fine margins',
    previewGradient: 'linear-gradient(135deg, #0B1220 0%, #1E3A5F 60%, #6B46FE 100%)',
    pageBackground: '#0B1220',
    accent: '#6B46FE',
    textColor: '#E8ECF4',
  },
  {
    id: 'magazine',
    name: 'Magazine',
    description: 'Editorial columns and pull quotes',
    previewGradient: 'linear-gradient(135deg, #FAFAFA 0%, #E5E5E5 100%)',
    pageBackground: '#FAFAFA',
    accent: '#111111',
    textColor: '#111111',
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Blank canvas — design freely',
    previewGradient: 'linear-gradient(135deg, #EEF0F4 0%, #F8F9FB 100%)',
    pageBackground: '#FFFFFF',
    accent: '#6B46FE',
    textColor: '#2D3436',
  },
];

export function getTemplate(id: TemplateId): AlbumTemplateMeta {
  return ALBUM_TEMPLATES.find((t) => t.id === id) ?? ALBUM_TEMPLATES[0];
}
