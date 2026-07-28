import { customerBookings, getActiveBookings } from '../data/dashboardData';
import { EventDashboard } from '../components/event/EventDashboard';
import { ExploreDashboard } from '../components/explore/ExploreDashboard';

/**
 * Customer dashboard — booking-aware.
 * Empty / no active bookings → Explore marketplace.
 * Active bookings → Event command center.
 */
export function UserDashboardPage() {
  const activeBookings = getActiveBookings(customerBookings);
  const hasActiveBooking = activeBookings.length > 0;

  return hasActiveBooking ? <EventDashboard /> : <ExploreDashboard />;
}
