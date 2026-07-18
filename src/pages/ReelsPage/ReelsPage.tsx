import { Navbar } from '@/pages/LandingPage/landing/Navbar';
import { ReelsFeed } from './reels/ReelsFeed';

export function ReelsPage() {
  return (
    <div className="min-h-dvh bg-black pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
      <Navbar />
      <ReelsFeed />
    </div>
  );
}
