import type { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth';
import {
  AlbumDashboardPage,
  AlbumWizardPage,
  AlbumEditorPage,
} from '@/features/album-designer';
import { EventTimelinePage } from '@/features/event-timeline';
import { PaymentsDashboardPage } from '@/features/payments';
import { CreatorLayout } from '@/pages/CreatorPage';
import { DashboardPage } from '@/pages/CreatorPage';
import { ProfilePage } from '@/pages/CreatorPage';
import { PortfolioPage } from '@/pages/CreatorPage';
import { PackagesPage } from '@/pages/CreatorPage';
import { BookingsPage } from '@/pages/CreatorPage';
import { ReviewsPage } from '@/pages/CreatorPage';
import { MessagesPage } from '@/pages/CreatorPage';
import {
  SettingsPage,
  MyReelsPage,
  UploadReelPage,
  TeamsPage,
  SubscriptionsPage,
  CalendarPage,
  AnalyticsPage,
  UploadsPage,
} from '@/pages/CreatorPage';
import { PhotoEditorRoute } from '@/pages/PhotoEditor/PhotoEditorRoute';
import { VideoEditor } from '@/pages/VideoEditor';

export const creatorRoutes: ReactNode[] = [
  <Route key="creator" element={<ProtectedRoute roles={['photographer']} />}>
    <Route path="/creator" element={<CreatorLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="portfolio" element={<PortfolioPage />} />
      <Route path="reels" element={<MyReelsPage />} />
      <Route path="reels/upload" element={<UploadReelPage />} />
      <Route path="uploads" element={<UploadsPage />} />
      <Route path="album-designer" element={<AlbumDashboardPage />} />
      <Route path="album-designer/new" element={<AlbumWizardPage />} />
      <Route path="album-designer/:albumId/edit" element={<AlbumEditorPage />} />
      <Route path="photo-editor" element={<PhotoEditorRoute />} />
      <Route path="video-editor" element={<VideoEditor />} />
      <Route path="packages" element={<PackagesPage />} />
      <Route path="subscriptions" element={<SubscriptionsPage />} />
      <Route path="bookings" element={<BookingsPage />} />
      <Route path="calendar" element={<CalendarPage />} />
      <Route path="event-timeline" element={<EventTimelinePage />} />
      <Route path="analytics" element={<AnalyticsPage />} />
      <Route path="payments" element={<PaymentsDashboardPage />} />
      <Route path="reviews" element={<ReviewsPage />} />
      <Route path="messages" element={<MessagesPage />} />
      <Route path="teams" element={<TeamsPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
  </Route>,
];
