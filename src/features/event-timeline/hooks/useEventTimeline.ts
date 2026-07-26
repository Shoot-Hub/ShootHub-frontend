import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { DEMO_EVENT_TIMELINE } from '../constants';
import { eventTimelineKeys, fetchEventTimeline } from '../services';
import { computeStats, getCountdown, getLiveSlot, getNextSlot } from '../utils';

export function useEventTimeline(eventId = DEMO_EVENT_TIMELINE.id) {
  return useQuery({
    queryKey: eventTimelineKeys.detail(eventId),
    queryFn: () => fetchEventTimeline(eventId),
  });
}

export function useEventTimelineStats(eventId = DEMO_EVENT_TIMELINE.id) {
  const query = useEventTimeline(eventId);
  const stats = useMemo(
    () => (query.data ? computeStats(query.data) : null),
    [query.data],
  );
  return { ...query, stats };
}

/** Live ticking countdown toward a target ISO datetime */
export function useCountdown(targetISO: string | null | undefined) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetISO) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [targetISO]);

  return useMemo(
    () => (targetISO ? getCountdown(targetISO, now) : { days: 0, hours: 0, mins: 0, secs: 0 }),
    [targetISO, now],
  );
}

export function useTimelineFocus(eventId = DEMO_EVENT_TIMELINE.id) {
  const { data } = useEventTimeline(eventId);
  const live = data ? getLiveSlot(data.slots) : null;
  const next = data ? getNextSlot(data.slots) : null;
  return { live, next };
}
