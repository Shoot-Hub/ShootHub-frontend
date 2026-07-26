import { DEMO_EVENT_TIMELINE } from '../constants';
import type { EventTimelineDay } from '../types';

/**
 * Local-only data service — does NOT call backend APIs.
 * React Query wraps this for caching / loading UX.
 */
export async function fetchEventTimeline(eventId?: string): Promise<EventTimelineDay> {
  await new Promise((r) => setTimeout(r, 280));
  if (eventId && eventId !== DEMO_EVENT_TIMELINE.id) {
    // Future: map booking id → timeline. For now always return demo.
    return DEMO_EVENT_TIMELINE;
  }
  return DEMO_EVENT_TIMELINE;
}

export const eventTimelineKeys = {
  all: ['event-timeline'] as const,
  detail: (id: string) => ['event-timeline', id] as const,
};
