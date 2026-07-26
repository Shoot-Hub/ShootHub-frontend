import { useEffect, useMemo, useState } from 'react';
import type { Gallery, Photo } from '@/pages/Gallery/types';
import { buildWeddingStory } from '../services';
import type { TimelineSectionId, WeddingStory } from '../types';

export function useWeddingStory(gallery: Gallery, photos: Photo[]): WeddingStory {
  return useMemo(() => buildWeddingStory(gallery, photos), [gallery, photos]);
}

/**
 * Tracks which timeline section is in view while scrolling.
 */
export function useActiveTimelineSection(
  sectionIds: TimelineSectionId[],
  enabled = true,
) {
  const [activeId, setActiveId] = useState<TimelineSectionId | null>(
    sectionIds[0] ?? null,
  );

  useEffect(() => {
    if (!enabled || sectionIds.length === 0) return;

    const elements = sectionIds
      .map((id) => document.getElementById(`story-section-${id}`))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0];
        if (top?.target.id) {
          const id = top.target.id.replace('story-section-', '') as TimelineSectionId;
          setActiveId(id);
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.15, 0.35, 0.55],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, enabled]);

  const scrollToSection = (id: TimelineSectionId) => {
    const el = document.getElementById(`story-section-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(id);
  };

  return { activeId, scrollToSection, setActiveId };
}
