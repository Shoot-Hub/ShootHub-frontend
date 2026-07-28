export type TextPreset = {
  id: string;
  name: string;
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  textAlign: 'left' | 'center' | 'right';
  color: string;
};

export const TEXT_PRESETS: TextPreset[] = [
  {
    id: 'tp_wedding_title',
    name: 'Wedding Title',
    content: 'Our Wedding',
    fontFamily: 'Playfair Display',
    fontSize: 42,
    fontWeight: 700,
    letterSpacing: 2,
    textAlign: 'center',
    color: '#2D3436',
  },
  {
    id: 'tp_bride',
    name: 'Bride Name',
    content: 'Priya',
    fontFamily: 'Great Vibes',
    fontSize: 48,
    fontWeight: 400,
    letterSpacing: 1,
    textAlign: 'center',
    color: '#C45C7A',
  },
  {
    id: 'tp_groom',
    name: 'Groom Name',
    content: 'Rohit',
    fontFamily: 'Cinzel',
    fontSize: 36,
    fontWeight: 600,
    letterSpacing: 3,
    textAlign: 'center',
    color: '#2D3436',
  },
  {
    id: 'tp_subtitle',
    name: 'Subtitle',
    content: 'A celebration of love',
    fontFamily: 'Cormorant',
    fontSize: 22,
    fontWeight: 500,
    letterSpacing: 4,
    textAlign: 'center',
    color: '#5B6472',
  },
  {
    id: 'tp_date',
    name: 'Date',
    content: '20 · 05 · 2026',
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: 6,
    textAlign: 'center',
    color: '#6B46FE',
  },
  {
    id: 'tp_location',
    name: 'Location',
    content: 'Udaipur, Rajasthan',
    fontFamily: 'Lora',
    fontSize: 18,
    fontWeight: 400,
    letterSpacing: 1,
    textAlign: 'center',
    color: '#5B6472',
  },
  {
    id: 'tp_story',
    name: 'Story',
    content: 'Every glance became a chapter…',
    fontFamily: 'Cormorant',
    fontSize: 20,
    fontWeight: 400,
    letterSpacing: 0.5,
    textAlign: 'left',
    color: '#2D3436',
  },
  {
    id: 'tp_quote',
    name: 'Quote',
    content: '"In all the world, there is no heart for me like yours."',
    fontFamily: 'Playfair Display',
    fontSize: 18,
    fontWeight: 500,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#3D2B1F',
  },
  {
    id: 'tp_paragraph',
    name: 'Paragraph',
    content: 'Add your story here — memories, moments, and everything in between.',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 400,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#5B6472',
  },
];

export const DESIGNER_FONTS = [
  'Inter',
  'Poppins',
  'Montserrat',
  'Playfair Display',
  'Cormorant',
  'Cinzel',
  'Great Vibes',
  'Lora',
  'DM Sans',
  'Plus Jakarta Sans',
] as const;
