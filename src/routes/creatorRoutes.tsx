import type { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { CreatorLayout } from '@/pages/CreatorPage';
import { DashboardPage } from '@/pages/CreatorPage';
import { ProfilePage } from '@/pages/CreatorPage';
import { PortfolioPage } from '@/pages/CreatorPage';
import { PackagesPage } from '@/pages/CreatorPage';
import { BookingsPage } from '@/pages/CreatorPage';
import { ReviewsPage } from '@/pages/CreatorPage';
import { MessagesPage } from '@/pages/CreatorPage';
import { SettingsPage, MyReelsPage, UploadReelPage } from '@/pages/CreatorPage';

export const creatorRoutes: ReactNode[] = [
  <Route key="creator" path="/creator" element={<CreatorLayout />}>
    <Route index element={<DashboardPage />} />
    <Route path="profile" element={<ProfilePage />} />
    <Route path="portfolio" element={<PortfolioPage />} />
    <Route path="reels" element={<MyReelsPage />} />
    <Route path="reels/upload" element={<UploadReelPage />} />
    <Route path="packages" element={<PackagesPage />} />
    <Route path="bookings" element={<BookingsPage />} />
    <Route path="reviews" element={<ReviewsPage />} />
    <Route path="messages" element={<MessagesPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>,
];
