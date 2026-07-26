export type AlbumStatus = 'draft' | 'in_progress' | 'completed';

export type AlbumType =
  | 'wedding'
  | 'pre_wedding'
  | 'engagement'
  | 'birthday'
  | 'baby_shoot'
  | 'corporate'
  | 'portfolio'
  | 'travel'
  | 'custom';

export type AlbumSize = '8x12' | '10x10' | '12x18' | '14x14' | 'custom';

export type AlbumOrientation = 'landscape' | 'portrait' | 'square';

export type CoverType = 'glossy' | 'matte' | 'premium';

export type TemplateId =
  | 'modern'
  | 'luxury'
  | 'classic'
  | 'minimal'
  | 'dark'
  | 'white'
  | 'floral'
  | 'premium'
  | 'magazine'
  | 'custom';

export type AlbumPhoto = {
  id: string;
  url: string;
  thumbnailUrl: string;
  filename: string;
  width: number;
  height: number;
  isFavorite: boolean;
  rating: number;
  createdAt: string;
  galleryId?: string;
  tags?: string[];
};

export type AlbumInfo = {
  name: string;
  client: string;
  booking: string;
  event: string;
  albumType: AlbumType;
  albumSize: AlbumSize;
  customSize?: string;
  orientation: AlbumOrientation;
  pageCount: number;
  coverType: CoverType;
};

export type Album = {
  id: string;
  info: AlbumInfo;
  templateId: TemplateId;
  selectedPhotoIds: string[];
  pages: AlbumPage[];
  status: AlbumStatus;
  coverThumbnail?: string;
  createdAt: string;
  updatedAt: string;
};

export type AlbumPage = {
  id: string;
  order: number;
  background: string;
  elements: AlbumElement[];
};

export type AlbumElementBase = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  locked?: boolean;
};

export type PhotoElement = AlbumElementBase & {
  type: 'photo';
  photoId: string;
  url: string;
  crop: { x: number; y: number; zoom: number };
  opacity: number;
  borderRadius: number;
  flipH: boolean;
  flipV: boolean;
  shadow: boolean;
  borderWidth: number;
  borderColor: string;
};

export type TextElement = AlbumElementBase & {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  letterSpacing: number;
  textAlign: 'left' | 'center' | 'right';
  color: string;
};

export type AlbumElement = PhotoElement | TextElement;

export type AlbumSortKey = 'updated' | 'created' | 'name' | 'status';
export type AlbumFilterKey = 'all' | 'draft' | 'in_progress' | 'completed';

export type AlbumStats = {
  total: number;
  drafts: number;
  completed: number;
  inProgress: number;
  templatesUsed: number;
};
