import { useEffect } from 'react';
import { usePhotoEditorStore } from '../store';

export type EditorBreakpoint = 'mobile' | 'tablet' | 'laptop' | 'desktop';

function resolveBreakpoint(width: number): EditorBreakpoint {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1280) return 'laptop';
  return 'desktop';
}

/** Keeps layout mode in sync with viewport — Adobe-style adaptive chrome */
export function usePhotoEditorBreakpoint() {
  const setBreakpoint = usePhotoEditorStore((s) => s.setBreakpoint);
  const breakpoint = usePhotoEditorStore((s) => s.breakpoint);

  useEffect(() => {
    const apply = () => {
      const width = window.visualViewport?.width ?? window.innerWidth;
      setBreakpoint(resolveBreakpoint(width));
    };
    apply();
    window.addEventListener('resize', apply);
    window.visualViewport?.addEventListener('resize', apply);
    return () => {
      window.removeEventListener('resize', apply);
      window.visualViewport?.removeEventListener('resize', apply);
    };
  }, [setBreakpoint]);

  return breakpoint;
}
