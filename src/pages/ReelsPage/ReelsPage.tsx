import { Navbar } from '@/pages/LandingPage/landing/Navbar';
import { ReelsFeed } from './reels/ReelsFeed';

export function ReelsPage() {
  return (
    <div className="min-h-dvh bg-black">
      <Navbar />
      <ReelsFeed />
    </div>
  );
}
