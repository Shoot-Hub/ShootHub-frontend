export type GalleryAccess = 'public' | 'password' | 'private';

export type GallerySettings = {
  isPublic: boolean;
  isPasswordProtected: boolean;
  hasWatermark: boolean;
  downloadEnabled: boolean;
  expiryDate: string;
};

export type GalleryPhotographer = {
  id: string;
  name: string;
  avatar: string;
  studio?: string;
};

export type GalleryAlbum = {
  id: string;
  name: string;
  photoCount: number;
};

export type Gallery = {
  id: string;
  slug: string;
  name: string;
  description: string;
  coverImage: string;
  eventDate: string;
  location: string;
  photoCount: number;
  albumCount: number;
  createdDate: string;
  storageUsed: string;
  access: GalleryAccess;
  password?: string;
  settings: GallerySettings;
  photographer: GalleryPhotographer;
  albums: GalleryAlbum[];
};

export type GallerySort = 'newest' | 'oldest' | 'name' | 'favorite';
export type GalleryView = 'grid' | 'list';
export type GalleryFilter = 'all' | 'favorites' | 'selected';

export type FaceSearchResult = {
  confidence: number;
  matchedPhotoIds: string[];
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
};
