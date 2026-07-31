export type NotificationCategory =
  | 'all'
  | 'bookings'
  | 'payments'
  | 'messages'
  | 'system'
  | 'promotions';

export interface UserNotification {
  id: string;
  category: Exclude<NotificationCategory, 'all'>;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  icon: 'calendar' | 'payment' | 'message' | 'gallery' | 'star' | 'system' | 'promo';
  amount?: string;
  thumbnail?: string;
  actionLabel?: string;
}

export const notificationTabs: { id: NotificationCategory; label: string; count: number }[] = [
  { id: 'all', label: 'All Notifications', count: 6 },
  { id: 'bookings', label: 'Bookings', count: 3 },
  { id: 'payments', label: 'Payments', count: 2 },
  { id: 'messages', label: 'Messages', count: 1 },
  { id: 'system', label: 'System', count: 0 },
  { id: 'promotions', label: 'Promotions', count: 0 },
];

export const notificationPreferences = [
  { id: 'bookings', label: 'Bookings', enabled: true },
  { id: 'payments', label: 'Payments', enabled: true },
  { id: 'messages', label: 'Messages', enabled: true },
  { id: 'galleries', label: 'Galleries', enabled: true },
  { id: 'reviews', label: 'Reviews', enabled: false },
  { id: 'promotions', label: 'Promotions', enabled: false },
];

export const unreadSummary = [
  { id: 'bookings', label: 'Bookings', count: 3 },
  { id: 'payments', label: 'Payments', count: 2 },
  { id: 'messages', label: 'Messages', count: 1 },
  { id: 'system', label: 'System', count: 0 },
  { id: 'promotions', label: 'Promotions', count: 0 },
];

export const userNotifications: UserNotification[] = [
  {
    id: 'n1',
    category: 'bookings',
    title: 'Booking Confirmed',
    description: 'Harsh Sharma confirmed your wedding booking for 12 Dec 2026.',
    time: '10 min ago',
    unread: true,
    icon: 'calendar',
    thumbnail:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=160&h=120&fit=crop',
  },
  {
    id: 'n2',
    category: 'payments',
    title: 'Payment Received',
    description: 'Advance of ₹20,000 was received for Riya & Kunal Wedding.',
    time: '1 hour ago',
    unread: true,
    icon: 'payment',
    amount: '₹20,000',
  },
  {
    id: 'n3',
    category: 'messages',
    title: 'New Message from Aditi Films',
    description: 'Engagement gallery is ready for preview. Tap to open chat.',
    time: 'Yesterday',
    unread: true,
    icon: 'message',
  },
  {
    id: 'n4',
    category: 'bookings',
    title: 'Gallery Shared',
    description: 'Sneha Patel shared Pre-Wedding Shoot gallery with you.',
    time: '2 days ago',
    unread: true,
    icon: 'gallery',
    actionLabel: 'View Gallery',
  },
  {
    id: 'n5',
    category: 'bookings',
    title: 'Write a Review',
    description: 'How was your experience with Rahul Mehta? Share your feedback.',
    time: '3 days ago',
    unread: true,
    icon: 'star',
    actionLabel: 'Write Review',
  },
  {
    id: 'n6',
    category: 'payments',
    title: 'Invoice Generated',
    description: 'Invoice #SHB-1008 is ready for Engagement Ceremony.',
    time: '5 days ago',
    unread: true,
    icon: 'payment',
    actionLabel: 'View Invoice',
  },
];
