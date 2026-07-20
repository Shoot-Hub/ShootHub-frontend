import { useCallback, useState } from 'react';
import type { FaceSearchResult } from '../types';

export function useFaceSearch(galleryId: string) {
  const [result, setResult] = useState<FaceSearchResult>({
    confidence: 0,
    matchedPhotoIds: [],
    status: 'idle',
  });

  const runSearch = useCallback(async (_selfiePreview: string) => {
    setResult({ confidence: 0, matchedPhotoIds: [], status: 'processing' });
    await new Promise((r) => setTimeout(r, 1800));

    const matchedPhotoIds = Array.from({ length: 18 }, (_, i) => `${galleryId}-photo-${(i * 5 + 1)}`);
    setResult({
      confidence: 94.6,
      matchedPhotoIds,
      status: 'complete',
    });
  }, [galleryId]);

  const reset = useCallback(() => {
    setResult({ confidence: 0, matchedPhotoIds: [], status: 'idle' });
  }, []);

  return { result, runSearch, reset };
}
