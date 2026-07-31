import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth';
import {
  LoginPage,
  SignupPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from '@/pages/auth';
import { AUTH_ROUTES } from '@/constants/auth';
import {
  FindProfessionalsPage,
  MessagesPage,
  MyBookingsPage,
  MyEventsPage,
  MyGalleriesPage,
  NotificationsPage,
  PaymentsPage,
  UserDashboardPage,
  UserLayout,
  UserPlaceholderPage,
} from '@/pages/UserPage';

export const userRoutes = [
  <Route key="login" path={AUTH_ROUTES.LOGIN} element={<LoginPage />} />,
  <Route key="signup" path={AUTH_ROUTES.SIGNUP} element={<SignupPage />} />,
  <Route key="forgot-password" path={AUTH_ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />,
  <Route key="reset-password" path={AUTH_ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />,
  <Route key="verify-email" path={AUTH_ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />,
  <Route key="user" element={<ProtectedRoute roles={['user']} />}>
    <Route path="/user" element={<UserLayout />}>
      <Route index element={<UserDashboardPage />} />
      <Route path="find-professionals" element={<FindProfessionalsPage />} />
      <Route path="find-photographers" element={<FindProfessionalsPage />} />
      <Route path="my-bookings" element={<MyBookingsPage />} />
      <Route path="my-events" element={<MyEventsPage />} />
      <Route path="messages" element={<MessagesPage />} />
      <Route
        path="favorites"
        element={
          <UserPlaceholderPage
            title="Favorites"
            description="Your saved creators, galleries, and moments."
          />
        }
      />
      <Route
        path="ai-face-search"
        element={
          <UserPlaceholderPage
            title="AI Face Search"
            description="Find your photos instantly with AI face recognition."
          />
        }
      />
      <Route
        path="reviews"
        element={
          <UserPlaceholderPage
            title="Reviews"
            description="Manage and share reviews for your shoots."
          />
        }
      />
      <Route path="galleries" element={<MyGalleriesPage />} />
      <Route path="payments" element={<PaymentsPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route
        path="settings"
        element={
          <UserPlaceholderPage
            title="Settings"
            description="Manage your profile, preferences, and account."
          />
        }
      />
      <Route
        path="support"
        element={
          <UserPlaceholderPage
            title="Help & Support"
            description="Get help with bookings, payments, and account issues."
          />
        }
      />
      {/* Legacy routes kept for existing in-app links */}
      <Route
        path="albums"
        element={
          <UserPlaceholderPage
            title="All Albums"
            description="View designed albums shared by your photographers."
          />
        }
      />
      <Route
        path="reels"
        element={
          <UserPlaceholderPage
            title="All Reels"
            description="Watch reels and short videos from your shoots."
          />
        }
      />
      <Route
        path="my-photographer"
        element={
          <UserPlaceholderPage
            title="My Photographer"
            description="See photographers linked to your bookings."
          />
        }
      />
      <Route
        path="explore-creators"
        element={
          <UserPlaceholderPage
            title="Explore Creators"
            description="Discover and book photographers near you."
          />
        }
      />
      <Route
        path="top-locations"
        element={
          <UserPlaceholderPage
            title="Top Locations"
            description="Popular shoot destinations and venues."
          />
        }
      />
      <Route
        path="categories"
        element={
          <UserPlaceholderPage
            title="Categories"
            description="Browse by wedding, pre-wed, events, and more."
          />
        }
      />
    </Route>
  </Route>,
];
