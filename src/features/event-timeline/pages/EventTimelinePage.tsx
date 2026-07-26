import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShootHubLoader } from '@/components/ShootHubLoader';
import {
  EventHeroBanner,
  EventListView,
  EventOverviewPanel,
  EventTimelineCard,
  EventTimelineToolbar,
  MobileBottomTimelineNav,
  MobileSlotScroller,
  NextEventCard,
  QuickActionsPanel,
  ReminderBanner,
  TeamAssignedPanel,
  TimelineExportPreview,
  TimelineViewToggle,
} from '../components';
import { DEMO_EVENT_TIMELINE } from '../constants';
import {
  useCountdown,
  useEventTimeline,
  useEventTimelineStats,
  useTimelineFocus,
} from '../hooks';
import type { EventTimelineViewMode, TimelineSlot } from '../types';
import { getCountdown, openTimelinePrintWindow } from '../utils';

export function EventTimelinePage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useEventTimeline(DEMO_EVENT_TIMELINE.id);
  const { stats } = useEventTimelineStats(DEMO_EVENT_TIMELINE.id);
  const { live, next } = useTimelineFocus(DEMO_EVENT_TIMELINE.id);

  const [mode, setMode] = useState<EventTimelineViewMode>('timeline');
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  const countdownTarget = useMemo(() => {
    if (!data) return null;
    return next?.startTime || live?.endTime || data.slots[0]?.startTime || null;
  }, [data, next, live]);

  const countdown = useCountdown(countdownTarget);
  const nextCountdown = useCountdown(next?.startTime);

  useEffect(() => {
    if (!data) return;
    const preferred = live?.id || next?.id || data.slots[0]?.id || null;
    setActiveSlotId((prev) => prev ?? preferred);
  }, [data, live, next]);

  const handleShare = async () => {
    const url = `${window.location.origin}/creator/event-timeline`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${data?.coupleLine || 'Event'} Timeline`,
          text: 'Wedding day schedule',
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Timeline link copied');
      }
    } catch {
      // cancelled
    }
  };

  const openPrintDoc = (autoPrint: boolean) => {
    if (!data || !stats) return;
    const ok = openTimelinePrintWindow(data, stats, autoPrint);
    if (!ok) {
      toast.error('Please allow pop-ups to download / print the timeline');
      return;
    }
    if (autoPrint) {
      toast.success('Print dialog opened — choose “Save as PDF”');
    } else {
      toast.success('Timeline preview opened');
    }
  };

  const handleDownloadPdf = () => {
    // Show design preview first (same as screenshot), then print-to-PDF
    setExportOpen(true);
  };

  const handlePrintFromPreview = () => {
    openPrintDoc(true);
  };

  const scrollToSlot = (id: string) => {
    setActiveSlotId(id);
    const el = document.getElementById(`event-slot-${id}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const openGallery = (slot: TimelineSlot) => {
    if (slot.gallerySlug) {
      window.open(`/gallery/${slot.gallerySlug}`, '_blank', 'noopener,noreferrer');
      return;
    }
    toast('Gallery link coming soon for this slot');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <ShootHubLoader size="lg" label="Loading event timeline…" />
      </div>
    );
  }

  if (isError || !data || !stats) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
        <p className="text-sm font-semibold text-rose-600">Could not load timeline</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24 lg:pb-6">
      <EventTimelineToolbar
        onShare={handleShare}
        onDownloadPdf={handleDownloadPdf}
        onPrint={() => openPrintDoc(true)}
        onAddEvent={() => toast('Add Event — frontend only for now')}
      />

      <EventHeroBanner day={data} countdown={countdown} />

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TimelineViewToggle mode={mode} onChange={setMode} />
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
              <button
                type="button"
                onClick={() => navigate('/creator/uploads')}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 hover:border-[#6B46FE]/30 hover:text-[#6B46FE]"
              >
                Open Gallery
              </button>
              <button
                type="button"
                onClick={() => navigate('/creator/reels')}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 hover:border-[#6B46FE]/30 hover:text-[#6B46FE]"
              >
                View Videos
              </button>
              <button
                type="button"
                onClick={() => navigate('/creator/bookings')}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 hover:border-[#6B46FE]/30 hover:text-[#6B46FE]"
              >
                Book Similar Event
              </button>
            </div>
          </div>

          <MobileSlotScroller
            slots={data.slots}
            activeId={activeSlotId}
            onSelect={scrollToSlot}
          />

          {mode === 'timeline' ? (
            <div className="rounded-3xl border border-slate-100 bg-white/80 p-3 shadow-sm backdrop-blur-sm sm:p-5">
              {data.slots.map((slot, index) => (
                <div key={slot.id} id={`event-slot-${slot.id}`}>
                  <EventTimelineCard
                    slot={slot}
                    team={data.team}
                    index={index}
                    isLast={index === data.slots.length - 1}
                    onOpenGallery={openGallery}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EventListView
              slots={data.slots}
              team={data.team}
              onSelect={(slot) => {
                setMode('timeline');
                window.setTimeout(() => scrollToSlot(slot.id), 50);
              }}
            />
          )}

          <ReminderBanner
            onEnable={() => toast.success('Reminders enabled for this timeline')}
          />
        </div>

        <aside className="w-full shrink-0 space-y-4 xl:w-[320px]">
          <EventOverviewPanel
            stats={stats}
            totalCoverageLabel={data.totalCoverageLabel}
          />
          <TeamAssignedPanel team={data.team} />
          {next ? (
            <NextEventCard
              slot={next}
              countdown={
                nextCountdown.days + nextCountdown.hours + nextCountdown.mins + nextCountdown.secs > 0
                  ? nextCountdown
                  : getCountdown(next.startTime)
              }
              onViewDetails={() => scrollToSlot(next.id)}
            />
          ) : null}
          <QuickActionsPanel
            onAdd={() => toast('Add New Event — coming soon')}
            onEdit={() => toast('Edit Timeline — coming soon')}
            onRemind={() => toast.success('Reminder queued for team & client')}
            onShare={handleShare}
            onDownload={handleDownloadPdf}
          />
        </aside>
      </div>

      <MobileBottomTimelineNav
        slots={data.slots}
        activeId={activeSlotId}
        onSelect={scrollToSlot}
      />

      <TimelineExportPreview
        open={exportOpen}
        day={data}
        stats={stats}
        onClose={() => setExportOpen(false)}
        onDownloadPdf={handlePrintFromPreview}
        onPrint={handlePrintFromPreview}
        onShare={handleShare}
      />
    </div>
  );
}
