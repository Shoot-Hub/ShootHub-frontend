import { Navbar } from './landing/Navbar';
import { Hero } from './landing/Hero';
import { HeroSearch } from './landing/HeroSearch';
import { TrustSection } from './landing/TrustSection';
import { Features } from './landing/Features';
import { Testimonials } from './landing/Testimonials';
import { Pricing } from './landing/Pricing';
import { Footer } from './landing/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Navbar />
      <main>
        <Hero />
        <HeroSearch />
        <TrustSection />
        <Features />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
