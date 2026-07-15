import {
  CTASection,
  FAQSection,
  PageShell,
  TestimonialGrid,
} from '@/components/marketing';
import { AboutHero } from './about/AboutHero';
import { AboutStats } from './about/AboutStats';
import { CoreFeatures } from './about/CoreFeatures';
import { MeetTeam } from './about/MeetTeam';
import { MissionVision } from './about/MissionVision';
import { RoadmapSection, ValuesSection } from './about/RoadmapValues';
import { StoryTimeline } from './about/StoryTimeline';
import { aboutFAQ } from './about/data';

export function AboutPage() {
  return (
    <PageShell>
      <AboutHero />
      <MissionVision />
      <StoryTimeline />
      <AboutStats />
      <CoreFeatures />
      <MeetTeam />
      <RoadmapSection />
      <TestimonialGrid className="bg-white" />
      <ValuesSection />
      <FAQSection items={aboutFAQ} />
      <CTASection title="Join ShootHub Today" />
    </PageShell>
  );
}
