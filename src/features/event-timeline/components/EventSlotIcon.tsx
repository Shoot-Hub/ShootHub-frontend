import {
  Camera,
  Check,
  Circle,
  Flower2,
  Hand,
  Heart,
  Music2,
  PartyPopper,
  Sparkles,
  Sun,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';

const MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  camera: Camera,
  sun: Sun,
  users: Users,
  utensils: UtensilsCrossed,
  hand: Hand,
  music: Music2,
  party: PartyPopper,
  heart: Heart,
  flower: Flower2,
  circle: Circle,
  check: Check,
};

export function EventSlotIcon({ name, className }: { name: string; className?: string }) {
  const Icon = MAP[name] ?? Sparkles;
  return <Icon className={className} strokeWidth={2} />;
}
