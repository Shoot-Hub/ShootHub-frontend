export type BookingListStatus = 'upcoming' | 'confirmed' | 'completed' | 'cancelled';

export interface UserBookingItem {
  id: string;
  bookingId: string;
  title: string;
  day: string;
  month: string;
  year: string;
  dateLabel: string;
  time: string;
  venue: string;
  city: string;
  photographer: string;
  category: string;
  status: BookingListStatus;
  coverImage: string;
  amount: number;
}

export const bookingStats = {
  total: 12,
  upcoming: 5,
  completed: 4,
  cancelled: 2,
  totalSpent: 145000,
};

export const userBookings: UserBookingItem[] = [
  {
    id: '1',
    bookingId: 'SHB-1012',
    title: 'Riya & Kunal Wedding',
    day: '12',
    month: 'DEC',
    year: '2026',
    dateLabel: '12 Dec 2026',
    time: '10:30 AM',
    venue: 'Jaipur Palace',
    city: 'Jaipur',
    photographer: 'Harsh Sharma',
    category: 'Wedding Photography',
    status: 'upcoming',
    coverImage:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
    amount: 85000,
  },
  {
    id: '2',
    bookingId: 'SHB-1008',
    title: 'Engagement Ceremony',
    day: '18',
    month: 'OCT',
    year: '2026',
    dateLabel: '18 Oct 2026',
    time: '6:00 PM',
    venue: 'The Grand Oak',
    city: 'Delhi',
    photographer: 'Aditi Films',
    category: 'Event Photography',
    status: 'confirmed',
    coverImage:
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=300&fit=crop',
    amount: 42000,
  },
  {
    id: '3',
    bookingId: 'SHB-0994',
    title: 'Pre-Wedding Shoot',
    day: '02',
    month: 'SEP',
    year: '2026',
    dateLabel: '02 Sep 2026',
    time: '4:00 PM',
    venue: 'Lodhi Garden',
    city: 'Delhi',
    photographer: 'Sneha Patel',
    category: 'Pre-Wedding',
    status: 'completed',
    coverImage:
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&h=300&fit=crop',
    amount: 28000,
  },
  {
    id: '4',
    bookingId: 'SHB-0981',
    title: 'Anniversary Celebration',
    day: '22',
    month: 'AUG',
    year: '2026',
    dateLabel: '22 Aug 2026',
    time: '7:00 PM',
    venue: 'Sky Lounge',
    city: 'Mumbai',
    photographer: 'Rahul Mehta',
    category: 'Event Photography',
    status: 'cancelled',
    coverImage:
      'https://images.unsplash.com/photo-1519225421980-715cb0215a07?w=400&h=300&fit=crop',
    amount: 18000,
  },
  {
    id: '5',
    bookingId: 'SHB-0972',
    title: 'Baby Shower Session',
    day: '14',
    month: 'JUL',
    year: '2026',
    dateLabel: '14 Jul 2026',
    time: '11:00 AM',
    venue: 'Home Studio',
    city: 'Bangalore',
    photographer: 'Priya Kapoor',
    category: 'Portrait Photography',
    status: 'completed',
    coverImage:
      'https://images.unsplash.com/photo-1511285560929-80b456fe3b6f?w=400&h=300&fit=crop',
    amount: 15000,
  },
  {
    id: '6',
    bookingId: 'SHB-0965',
    title: 'Corporate Headshots',
    day: '05',
    month: 'NOV',
    year: '2026',
    dateLabel: '05 Nov 2026',
    time: '2:00 PM',
    venue: 'Tech Park',
    city: 'Bangalore',
    photographer: 'Arjun Desai',
    category: 'Portrait Photography',
    status: 'upcoming',
    coverImage:
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop',
    amount: 12000,
  },
];

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const statusStyles: Record<
  BookingListStatus,
  { label: string; className: string }
> = {
  upcoming: {
    label: 'Upcoming',
    className: 'bg-[#F3EEFF] text-[#6B46FE]',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-[#E8F8EF] text-[#1B9C5A]',
  },
  completed: {
    label: 'Completed',
    className: 'bg-[#E8F1FF] text-[#2F6FED]',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-[#FFF1E8] text-[#E67E22]',
  },
};
