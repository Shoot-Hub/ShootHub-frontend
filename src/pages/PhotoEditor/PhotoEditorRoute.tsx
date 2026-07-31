import { lazy, Suspense } from 'react';
import { PhotoEditorRouteFallback } from './components/ui/PanelSkeleton';

const PhotoEditor = lazy(() =>
  import('./PhotoEditor').then((m) => ({ default: m.PhotoEditor })),
);

/** Lazy route entry — keeps creatorRoutes free of inline lazy components. */
export function PhotoEditorRoute() {
  return (
    <Suspense fallback={<PhotoEditorRouteFallback />}>
      <PhotoEditor />
    </Suspense>
  );
}
