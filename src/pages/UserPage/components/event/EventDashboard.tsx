import { activeEventDetails } from '../../data/dashboardData';
import type { ActiveEventDetails } from '../../types/dashboard.types';
import { MotionSection } from '../shared/MotionSection';
import { SectionHeader } from '../shared/SectionHeader';
import { AiFaceSearchCard } from './AiFaceSearchCard';
import { AlbumsSection } from './AlbumsSection';
import { EventHero } from './EventHero';
import { EventTimeline } from './EventTimeline';
import { NotificationsPanel } from './NotificationsPanel';
import { PaymentsCard } from './PaymentsCard';
import { PhotographerDetails } from './PhotographerDetails';
import { SharedGalleries } from './SharedGalleries';
import { WeddingMemories } from './WeddingMemories';

interface EventDashboardProps {
  event?: ActiveEventDetails;
}

export function EventDashboard({ event = activeEventDetails }: EventDashboardProps) {
  return (
    <div className="space-y-8 pb-4 sm:space-y-10">
      <EventHero booking={event.booking} />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <MotionSection>
          <SectionHeader
            eyebrow="Journey"
            title="Event Timeline"
            subtitle="Every milestone from booking to gallery delivery."
          />
          <EventTimeline steps={event.timeline} />
        </MotionSection>

        <div className="space-y-6">
          <MotionSection delay={0.05}>
            <SectionHeader eyebrow="Your team" title="Photographer Details" />
            <PhotographerDetails photographer={event.photographer} />
          </MotionSection>
          <MotionSection delay={0.08}>
            <NotificationsPanel notifications={event.notifications} />
          </MotionSection>
        </div>
      </div>

      <MotionSection delay={0.05}>
        <SectionHeader
          eyebrow="Shared"
          title="Shared Galleries"
          subtitle="Photos your photographer has unlocked for you."
          actionLabel="All galleries"
          actionTo="/user/galleries"
        />
        <SharedGalleries galleries={event.galleries} />
      </MotionSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <MotionSection delay={0.05}>
          <SectionHeader
            eyebrow="Albums"
            title="Albums"
            subtitle="Design status for your keepsake books."
            actionLabel="All albums"
            actionTo="/user/albums"
          />
          <AlbumsSection albums={event.albums} />
        </MotionSection>

        <MotionSection delay={0.08}>
          <SectionHeader eyebrow="Billing" title="Payments" />
          <PaymentsCard payments={event.payments} />
        </MotionSection>
      </div>

      <MotionSection delay={0.05}>
        <AiFaceSearchCard ready={event.aiFaceSearchReady} facesIndexed={event.facesIndexed} />
      </MotionSection>

      <MotionSection delay={0.05}>
        <SectionHeader
          eyebrow="Cherish"
          title="Wedding Memories"
          subtitle="Highlights from your shared moments so far."
        />
        <WeddingMemories memories={event.memories} />
      </MotionSection>
    </div>
  );
}
