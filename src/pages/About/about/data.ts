import {
  BarChart3,
  Calendar,
  FolderOpen,
  Images,
  ScanFace,
  Shield,
  Sparkles,
  Users,
  HeartHandshake,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

import founderImg from '@/assets/landing/featured-creator-1.jpg';
import team1 from '@/assets/landing/featured-creator-2.jpg';
import team2 from '@/assets/landing/featured-creator-3.jpg';
import team3 from '@/assets/landing/featured-creator-4.jpg';
import heroImg from '@/assets/landing/hero-photographer.png';

export const aboutHeroImage = heroImg;

export const missionVision = [
  {
    title: 'Mission',
    description:
      'Make booking world-class photographers as simple as ordering coffee — while giving creators the tools to run a thriving business.',
  },
  {
    title: 'Vision',
    description:
      'Become India’s most trusted creative marketplace — where every celebration, campaign, and memory finds its perfect visual storyteller.',
  },
] as const;

export const storyTimeline = [
  {
    year: '2022',
    title: 'How ShootHub Started',
    description:
      'Two photographers frustrated with spreadsheets, WhatsApp chaos, and lost bookings decided to build something better.',
  },
  {
    year: '2023',
    title: 'Why We Built It',
    description:
      'Clients needed trust. Creators needed growth. We built verified profiles, secure galleries, and one-tap bookings under one roof.',
  },
  {
    year: '2024',
    title: 'Marketplace Takeoff',
    description:
      'AI Face Search, team workspaces, and city expansion unlocked thousands of bookings across India.',
  },
  {
    year: '2025',
    title: 'Scaling the Craft',
    description:
      'Studios, agencies, and solo creators now grow together on ShootHub — with analytics that actually help.',
  },
] as const;

export const stats = [
  { label: 'Creators', value: '12,000+' },
  { label: 'Bookings', value: '85,000+' },
  { label: 'Photos Delivered', value: '14M+' },
  { label: 'Countries', value: '8' },
] as const;

export const coreFeatures: {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}[] = [
  {
    title: 'AI Face Search',
    description: 'Find every smile in seconds across massive wedding galleries.',
    icon: ScanFace,
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-500',
  },
  {
    title: 'Client Galleries',
    description: 'Secure, branded delivery with watermarks and download control.',
    icon: Images,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
  },
  {
    title: 'Bookings',
    description: 'Requests, chat, and payments that keep shoots on schedule.',
    icon: Calendar,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  {
    title: 'Teams',
    description: 'Invite editors, second shooters, and managers with roles.',
    icon: Users,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-500',
  },
  {
    title: 'Analytics',
    description: 'Track revenue, repeat clients, and gallery engagement.',
    icon: BarChart3,
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-500',
  },
  {
    title: 'Portfolio',
    description: 'A beautiful public profile that converts browsers into bookings.',
    icon: FolderOpen,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
  },
];

export const team = [
  {
    name: 'Aarav Kapoor',
    role: 'Founder & CEO',
    bio: 'Photographer turned product builder. Obsessed with craft and clarity.',
    image: founderImg,
    founder: true,
  },
  {
    name: 'Meera Iyer',
    role: 'Head of Product',
    bio: 'Ships polished creator tools with ruthless simplicity.',
    image: team1,
    founder: false,
  },
  {
    name: 'Kabir Singh',
    role: 'Head of Engineering',
    bio: 'Builds fast galleries and reliable booking infrastructure.',
    image: team2,
    founder: false,
  },
  {
    name: 'Sana Rahman',
    role: 'Head of Community',
    bio: 'Connects creators across cities and celebrates great work.',
    image: team3,
    founder: false,
  },
] as const;

export const roadmap = [
  { quarter: 'Q2 2026', title: 'Smart Contracts', status: 'In Progress' },
  { quarter: 'Q3 2026', title: 'Creator CRM', status: 'Planned' },
  { quarter: 'Q4 2026', title: 'International Payments', status: 'Planned' },
  { quarter: 'Q1 2027', title: 'AI Shotlists', status: 'Exploring' },
] as const;

export const values: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: 'Innovation',
    description: 'We ship AI and workflows that save hours without losing the human touch.',
    icon: Sparkles,
  },
  {
    title: 'Trust',
    description: 'Verified creators, secure galleries, and transparent bookings.',
    icon: HeartHandshake,
  },
  {
    title: 'Community',
    description: 'A home for photographers, videographers, and the clients who book them.',
    icon: Users,
  },
  {
    title: 'Growth',
    description: 'Every feature should help creators earn more and clients book easier.',
    icon: TrendingUp,
  },
  {
    title: 'Security',
    description: 'Your images and payments are protected with modern safeguards.',
    icon: Shield,
  },
];

export const aboutFAQ = [
  {
    question: 'Is ShootHub only for photographers?',
    answer:
      'No. We support photographers, videographers, drone pilots, studios, and clients who book them.',
  },
  {
    question: 'How are creators verified?',
    answer:
      'We review identity, portfolio quality, and client feedback before a profile goes live.',
  },
  {
    question: 'Where is ShootHub available?',
    answer:
      'Across major Indian cities, with creators also serving destination and international shoots.',
  },
  {
    question: 'How can I join the team?',
    answer:
      'We’re hiring for product, design, and engineering. Reach out via Careers or hello@shoothub.in.',
  },
] as const;
