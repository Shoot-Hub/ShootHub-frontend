export type PaymentTab =
  | 'all'
  | 'upcoming'
  | 'paid'
  | 'pending'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'upcoming' | 'confirmed' | 'cancelled';
export type PaymentProgress = 'paid' | 'partially_paid' | 'pending';

export interface UserPayment {
  id: string;
  bookingId: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  photographer: string;
  status: PaymentStatus;
  progress: PaymentProgress;
  total: number;
  paid: number;
  remaining: number;
  coverImage: string;
}

export const paymentStats = {
  totalPaid: 145000,
  pendingRemaining: 95000,
  outstanding: 50000,
  totalBookings: 12,
};

export const userPayments: UserPayment[] = [
  {
    id: 'pay-1',
    bookingId: 'SHB-1012',
    title: 'Riya & Kunal Wedding',
    date: '12 DEC 2026',
    time: '10:30 AM',
    venue: 'Jaipur Palace',
    city: 'Jaipur',
    photographer: 'Harsh Sharma',
    status: 'upcoming',
    progress: 'partially_paid',
    total: 85000,
    paid: 40000,
    remaining: 45000,
    coverImage:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=220&fit=crop',
  },
  {
    id: 'pay-2',
    bookingId: 'SHB-1008',
    title: 'Engagement Ceremony',
    date: '18 OCT 2026',
    time: '6:00 PM',
    venue: 'The Grand Oak',
    city: 'Delhi',
    photographer: 'Aditi Films',
    status: 'confirmed',
    progress: 'paid',
    total: 42000,
    paid: 42000,
    remaining: 0,
    coverImage:
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=300&h=220&fit=crop',
  },
  {
    id: 'pay-3',
    bookingId: 'SHB-0994',
    title: 'Pre-Wedding Shoot',
    date: '02 SEP 2026',
    time: '4:00 PM',
    venue: 'Lodhi Garden',
    city: 'Delhi',
    photographer: 'Sneha Patel',
    status: 'confirmed',
    progress: 'pending',
    total: 28000,
    paid: 0,
    remaining: 28000,
    coverImage:
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=300&h=220&fit=crop',
  },
  {
    id: 'pay-4',
    bookingId: 'SHB-0981',
    title: 'Anniversary Celebration',
    date: '22 AUG 2026',
    time: '7:00 PM',
    venue: 'Sky Lounge',
    city: 'Mumbai',
    photographer: 'Rahul Mehta',
    status: 'cancelled',
    progress: 'pending',
    total: 18000,
    paid: 5000,
    remaining: 13000,
    coverImage:
      'https://images.unsplash.com/photo-1519225421980-715cb0215a07?w=300&h=220&fit=crop',
  },
  {
    id: 'pay-5',
    bookingId: 'SHB-0972',
    title: 'Baby Shower Session',
    date: '14 JUL 2026',
    time: '11:00 AM',
    venue: 'Home Studio',
    city: 'Bangalore',
    photographer: 'Priya Kapoor',
    status: 'confirmed',
    progress: 'paid',
    total: 15000,
    paid: 15000,
    remaining: 0,
    coverImage:
      'https://images.unsplash.com/photo-1511285560929-80b456fe3b6f?w=300&h=220&fit=crop',
  },
];

export const savedPaymentMethods = [
  { id: 'pm-1', brand: 'Visa', last4: '4242', expiry: '08/28', default: true },
  { id: 'pm-2', brand: 'Mastercard', last4: '8899', expiry: '11/27', default: false },
  { id: 'pm-3', brand: 'UPI', last4: 'yuvraj@okaxis', expiry: '', default: false },
];

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const bookingStatusStyles: Record<PaymentStatus, string> = {
  upcoming: 'bg-[#F3EEFF] text-[#6B46FE]',
  confirmed: 'bg-[#E8F8EF] text-[#1B9C5A]',
  cancelled: 'bg-[#FEECEC] text-[#EA5455]',
};

export const progressStyles: Record<PaymentProgress, string> = {
  paid: 'bg-[#E8F8EF] text-[#1B9C5A]',
  partially_paid: 'bg-[#E8F8EF] text-[#1B9C5A]',
  pending: 'bg-[#FFF1E8] text-[#E67E22]',
};

export const progressLabels: Record<PaymentProgress, string> = {
  paid: 'Paid',
  partially_paid: 'Partially Paid',
  pending: 'Pending',
};
