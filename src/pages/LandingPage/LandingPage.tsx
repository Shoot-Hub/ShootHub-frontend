import { Navbar } from './landing/Navbar';
import { Hero } from './landing/Hero';
import { HeroSearch } from './landing/HeroSearch';
import { FeaturedCreators } from './landing/FeaturedCreators';
import { Reels } from './landing/Reels';
import { Categories } from './landing/Categories';
// import { TrustSection } from './landing/TrustSection';
import { Features } from './landing/Features';
import { HowItWorks } from './landing/HowItWorks';
import { Testimonials } from './landing/Testimonials';
import { Pricing } from './landing/Pricing';
import { Footer } from './landing/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
      <Navbar />
      <main>
        <Hero />
        <HeroSearch />
        <FeaturedCreators />
        <Reels />
        <Categories />
        {/* <TrustSection /> */}
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
