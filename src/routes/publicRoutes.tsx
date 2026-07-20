import { Route } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { CategoriesPage } from '@/pages/Categories';
import { PricingPage } from '@/pages/Pricing';
import { AboutPage } from '@/pages/About';
import { FeedbackPage } from '@/pages/Feedback';
import { CreatorsPage, CreatorProfilePage } from '@/pages/Creators';
import { ReelsPage } from '@/pages/ReelsPage';
import { GalleryPage, GalleryDemoPage } from '@/pages/Gallery';

export const publicRoutes = [
  <Route key="home" path="/" element={<LandingPage />} />,
  <Route key="creators" path="/creators" element={<CreatorsPage />} />,
  <Route key="creator-profile" path="/creators/:creatorId" element={<CreatorProfilePage />} />,
  <Route key="reels" path="/reels" element={<ReelsPage />} />,
  <Route key="categories" path="/categories" element={<CategoriesPage />} />,
  <Route key="pricing" path="/pricing" element={<PricingPage />} />,
  <Route key="feedback" path="/feedback" element={<FeedbackPage />} />,
  <Route key="about" path="/about" element={<AboutPage />} />,
  <Route key="gallery-demo" path="/gallery/demo" element={<GalleryDemoPage />} />,
  <Route key="gallery" path="/gallery/:slug" element={<GalleryPage />} />,
];
