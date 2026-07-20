import avatar1 from '@/assets/landing/avatar-1.jpg';
import avatar2 from '@/assets/landing/avatar-2.jpg';
import avatar3 from '@/assets/landing/avatar-3.jpg';
import avatar4 from '@/assets/landing/avatar-4.jpg';
import creatorAvatar1 from '@/assets/landing/creator-avatar-1.jpg';
import creatorAvatar2 from '@/assets/landing/creator-avatar-2.jpg';

export type Review = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  timeAgo: string;
  verified: boolean;
  text: string;
  reply?: string;
};

export type SubmittedFeedback = {
  name: string;
  email: string;
  rating: number;
  likes: string;
  improve: string;
  recommend: 'yes' | 'maybe' | 'no' | null;
  submittedAt: string;
};

export const recentReviews: Review[] = [
  {
    id: '1',
    name: 'Rajesh Sharma',
    avatar: avatar1,
    rating: 5,
    timeAgo: '2 days ago',
    verified: true,
    text: 'ShootHub made finding our wedding photographer so easy! The gallery feature is amazing — our family loved browsing photos online.',
    reply: 'Thank you Rajesh! We\'re thrilled your family loved the gallery experience. Wishing you both a lifetime of happiness!',
  },
  {
    id: '2',
    name: 'Priya Mehta',
    avatar: avatar2,
    rating: 5,
    timeAgo: '5 days ago',
    verified: true,
    text: 'As a photographer, ShootHub has transformed my business. The booking system and client galleries are top-notch. Highly recommend!',
    reply: 'Thanks Priya! Creators like you are the heart of ShootHub. Keep capturing beautiful moments!',
  },
  {
    id: '3',
    name: 'Ananya Patel',
    avatar: avatar3,
    rating: 4,
    timeAgo: '1 week ago',
    verified: true,
    text: 'Great platform overall. The AI face search in galleries is a game-changer for events. Would love to see more payment options.',
  },
  {
    id: '4',
    name: 'Vikram Singh',
    avatar: avatar4,
    rating: 5,
    timeAgo: '2 weeks ago',
    verified: false,
    text: 'Booked a corporate headshot session through ShootHub. Professional experience from start to finish. The creator was verified and delivered on time.',
  },
];

export const feedbackBenefits = [
  { title: 'Help us improve', desc: 'Your insights shape our roadmap' },
  { title: 'Better experience', desc: 'We fix issues you report' },
  { title: 'We read every feedback', desc: 'Nothing goes unnoticed' },
  { title: 'Quick response', desc: 'Team replies within 48 hours' },
] as const;

export const trustItems = [
  { title: 'We Value Your Opinion', desc: 'Every voice matters to us' },
  { title: '100% Safe & Secure', desc: 'Your data is protected' },
  { title: 'Quick Response', desc: 'Reply within 48 hours' },
  { title: 'Community Driven', desc: 'Built with your input' },
] as const;

export const communityAvatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  creatorAvatar1,
  creatorAvatar2,
];

export const MAX_FEEDBACK_CHARS = 500;

export function submittedFeedbackToReview(feedback: SubmittedFeedback): Review {
  const parts = [feedback.likes, feedback.improve].filter(Boolean);
  return {
    id: 'user-submitted',
    name: feedback.name,
    avatar: avatar1,
    rating: feedback.rating,
    timeAgo: 'Just now',
    verified: false,
    text: parts.join(' ') || 'Thank you for sharing your feedback with ShootHub!',
  };
}
