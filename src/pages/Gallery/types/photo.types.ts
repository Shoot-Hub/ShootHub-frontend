export type Photo = {
  id: string;
  galleryId: string;
  url: string;
  thumbnailUrl: string;
  blurHash?: string;
  width: number;
  height: number;
  filename: string;
  albumId?: string;
  isFavorite: boolean;
  createdAt: string;
};

export type PhotoSelection = Set<string>;

export type PhotoModalState = {
  photoId: string | null;
  isOpen: boolean;
};
