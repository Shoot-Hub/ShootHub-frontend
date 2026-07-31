import type { MediaItem } from '../types';
import { createId } from './timecode';
import { VE_CONSTANTS } from './constants';

function extOf(name: string): string {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i).toLowerCase() : '';
}

export function isAcceptedMediaFile(file: File): boolean {
  const ext = extOf(file.name);
  if ((VE_CONSTANTS.ACCEPT_EXT as readonly string[]).includes(ext)) return true;
  const mime = file.type;
  return (
    (VE_CONSTANTS.ACCEPT_MIME.video as readonly string[]).includes(mime) ||
    (VE_CONSTANTS.ACCEPT_MIME.image as readonly string[]).includes(mime) ||
    (VE_CONSTANTS.ACCEPT_MIME.audio as readonly string[]).includes(mime) ||
    mime.startsWith('video/') ||
    mime.startsWith('image/') ||
    mime.startsWith('audio/')
  );
}

export function detectMediaType(file: File): MediaItem['type'] {
  if (file.type.startsWith('audio/') || ['.mp3', '.wav'].includes(extOf(file.name))) {
    return 'audio';
  }
  if (
    file.type.startsWith('image/') ||
    ['.jpg', '.jpeg', '.png'].includes(extOf(file.name))
  ) {
    return 'image';
  }
  return 'video';
}

function loadVideoMeta(url: string): Promise<{ duration: number; width: number; height: number; thumbnail: string }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = url;

    const cleanup = () => {
      video.onloadeddata = null;
      video.onerror = null;
      video.onseeked = null;
    };

    video.onerror = () => {
      cleanup();
      reject(new Error('Failed to load video'));
    };

    video.onloadeddata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 10;
      const capture = () => {
        const canvas = document.createElement('canvas');
        const w = video.videoWidth || 320;
        const h = video.videoHeight || 180;
        canvas.width = Math.min(480, w);
        canvas.height = Math.round((canvas.width / w) * h) || 270;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.72);
        cleanup();
        resolve({
          duration,
          width: w,
          height: h,
          thumbnail,
        });
      };

      if (video.readyState >= 2) {
        video.currentTime = Math.min(0.25, duration / 4);
        video.onseeked = capture;
      } else {
        capture();
      }
    };
  });
}

function loadImageMeta(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

function loadAudioDuration(url: string): Promise<number> {
  return new Promise((resolve) => {
    const audio = document.createElement('audio');
    audio.preload = 'metadata';
    audio.src = url;
    audio.onloadedmetadata = () => {
      resolve(Number.isFinite(audio.duration) ? audio.duration : 10);
    };
    audio.onerror = () => resolve(10);
  });
}

export async function fileToMediaItem(
  file: File,
  folderId: string,
): Promise<MediaItem> {
  const type = detectMediaType(file);
  const objectUrl = URL.createObjectURL(file);
  const id = createId('media');

  if (type === 'video') {
    try {
      const meta = await loadVideoMeta(objectUrl);
      return {
        id,
        name: file.name,
        type,
        folderId,
        durationSec: meta.duration,
        thumbnail: meta.thumbnail,
        width: meta.width,
        height: meta.height,
        objectUrl,
        createdAt: Date.now(),
      };
    } catch {
      return {
        id,
        name: file.name,
        type,
        folderId,
        durationSec: 10,
        thumbnail: objectUrl,
        objectUrl,
        createdAt: Date.now(),
      };
    }
  }

  if (type === 'image') {
    try {
      const meta = await loadImageMeta(objectUrl);
      return {
        id,
        name: file.name,
        type,
        folderId,
        durationSec: VE_CONSTANTS.DEFAULT_IMAGE_DURATION_SEC,
        thumbnail: objectUrl,
        width: meta.width,
        height: meta.height,
        objectUrl,
        createdAt: Date.now(),
      };
    } catch {
      return {
        id,
        name: file.name,
        type,
        folderId,
        durationSec: VE_CONSTANTS.DEFAULT_IMAGE_DURATION_SEC,
        thumbnail: objectUrl,
        objectUrl,
        createdAt: Date.now(),
      };
    }
  }

  const duration = await loadAudioDuration(objectUrl);
  return {
    id,
    name: file.name,
    type: 'audio',
    folderId,
    durationSec: duration,
    thumbnail: '',
    objectUrl,
    createdAt: Date.now(),
  };
}

export async function filesToMediaItems(
  files: File[],
  folderId: string,
): Promise<MediaItem[]> {
  const accepted = files.filter(isAcceptedMediaFile);
  const items = await Promise.all(accepted.map((f) => fileToMediaItem(f, folderId)));
  return items;
}

export function sortMediaItems(
  items: MediaItem[],
  sortKey: 'name' | 'duration' | 'type' | 'recent',
): MediaItem[] {
  const copy = [...items];
  switch (sortKey) {
    case 'duration':
      return copy.sort((a, b) => b.durationSec - a.durationSec);
    case 'type':
      return copy.sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name));
    case 'recent':
      return copy.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    case 'name':
    default:
      return copy.sort((a, b) => a.name.localeCompare(b.name));
  }
}
