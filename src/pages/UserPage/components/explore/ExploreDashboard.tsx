import {
  customerReviews,
  photographyCategories,
  popularPackages,
  quickActions,
  recommendedCreators,
  topLocations,
  trendingReels,
  whyShootHub,
} from '../../data/dashboardData';
import { MotionSection } from '../shared/MotionSection';
import { SectionHeader } from '../shared/SectionHeader';
import { CategoryPill } from './CategoryPill';
import { CreatorCard } from './CreatorCard';
import { ExploreHero } from './ExploreHero';
import { LocationCard } from './LocationCard';
import { PackageCard } from './PackageCard';
import { QuickActions } from './QuickActions';
import { ReelCard } from './ReelCard';
import { ReviewCard } from './ReviewCard';
import { WhyShootHub } from './WhyShootHub';

export function ExploreDashboard() {
  return (
    <div className="space-y-10 pb-4 sm:space-y-12">
      <ExploreHero />

      <MotionSection>
        <SectionHeader
          eyebrow="Near you"
          title="Recommended Creators Near You"
          subtitle="Premium studios with verified portfolios, reviews, and clear starting prices."
          actionLabel="See all"
          actionTo="/user/explore-creators"
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {recommendedCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </MotionSection>

      <MotionSection delay={0.05}>
        <SectionHeader
          eyebrow="Trending"
          title="Trending Wedding Reels"
          subtitle="Instagram-style moments from ShootHub creators."
          actionLabel="Browse reels"
          actionTo="/user/reels"
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {trendingReels.map((reel) => (
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>
      </MotionSection>

      <MotionSection delay={0.05}>
        <SectionHeader
          eyebrow="Destinations"
          title="Top Shoot Locations"
          subtitle="Palaces, resorts, gardens, lakes, mountains, banquets, beaches, and more."
          actionLabel="Explore map"
          actionTo="/user/top-locations"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {topLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </MotionSection>

      <MotionSection delay={0.05}>
        <SectionHeader
          eyebrow="Browse"
          title="Photography Categories"
          subtitle="Find the right style for every celebration and shoot."
          actionLabel="View all"
          actionTo="/user/categories"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {photographyCategories.map((category) => (
            <CategoryPill key={category.id} category={category} />
          ))}
        </div>
      </MotionSection>

      <MotionSection delay={0.05}>
        <SectionHeader
          eyebrow="Packages"
          title="Popular Packages"
          subtitle="Transparent starting prices for Basic, Premium, Luxury, and Destination coverage."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {popularPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </MotionSection>

      <MotionSection delay={0.05}>
        <SectionHeader
          eyebrow="Love notes"
          title="Customer Reviews"
          subtitle="Real couples and clients on ShootHub."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {customerReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </MotionSection>

      <MotionSection delay={0.05}>
        <SectionHeader
          eyebrow="Trust"
          title="Why ShootHub"
          subtitle="Built for modern weddings and professional shoots."
        />
        <WhyShootHub items={whyShootHub} />
      </MotionSection>

      <MotionSection delay={0.05}>
        <SectionHeader
          eyebrow="Shortcuts"
          title="Quick Actions"
          subtitle="Jump straight into discovery, favorites, and messages."
        />
        <QuickActions actions={quickActions} />
      </MotionSection>
    </div>
  );
}
