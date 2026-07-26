import {
  Camera,
  Check,
  Circle,
  Clapperboard,
  DoorOpen,
  Droplets,
  Flower2,
  Hand,
  Heart,
  Music2,
  PartyPopper,
  Shirt,
  Sparkles,
  Sun,
  Users,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  lipstick: Sparkles,
  shirt: Shirt,
  sun: Sun,
  hand: Hand,
  music: Music2,
  horse: PartyPopper,
  heart: Heart,
  flower: Flower2,
  circle: Circle,
  droplet: Droplets,
  door: DoorOpen,
  party: PartyPopper,
  camera: Camera,
  users: Users,
  clapper: Clapperboard,
};

export function TimelineIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon className={className} strokeWidth={2} />;
}

export function CompletedCheck({ className }: { className?: string }) {
  return <Check className={className} strokeWidth={2.5} />;
}
