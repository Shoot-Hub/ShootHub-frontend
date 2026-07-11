import {
  BadgeCheck,
  Camera,
  ChevronRight,
  Drone,
  Star,
  User,
  Video,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Image } from '@/components/ui/Image';
import { cn } from '@/lib/utils';

export type CreatorTheme = 'purple' | 'teal' | 'dark' | 'orange';

const themeStyles: Record<
  CreatorTheme,
  { imageBg: string; iconBg: string; button: string; check: string }
> = {
  purple: {
    imageBg: 'bg-[#4c1d95]',
    iconBg: 'bg-[#6d00ff]',
    button: 'bg-[#6d00ff] hover:bg-primary-700',
    check: 'text-primary-500',
  },
  teal: {
    imageBg: 'bg-[#0f766e]',
    iconBg: 'bg-[#14b8a6]',
    button: 'bg-[#0ea5a3] hover:bg-[#0f766e]',
    check: 'text-[#14b8a6]',
  },
  dark: {
    imageBg: 'bg-[#111827]',
    iconBg: 'bg-[#111827]',
    button: 'bg-[#111827] hover:bg-black',
    check: 'text-[#1e293b]',
  },
  orange: {
    imageBg: 'bg-[#ea580c]',
    iconBg: 'bg-[#ff8a00]',
    button: 'bg-[#ff8a00] hover:bg-[#ea580c]',
    check: 'text-[#f97316]',
  },
};

const categoryIcons: Record<CreatorTheme, LucideIcon> = {
  purple: Camera,
  teal: Video,
  dark: Drone,
  orange: User,
};

export type FeaturedCreatorCardProps = {
  name: string;
  title: string;
  rating: number;
  experience: string;
  price: string;
  image: string;
  theme: CreatorTheme;
  alt: string;
};

export function FeaturedCreatorCard({
  name,
  title,
  rating,
  experience,
  price,
  image,
  theme,
  alt,
}: FeaturedCreatorCardProps) {
  const styles = themeStyles[theme];
  const CategoryIcon = categoryIcons[theme];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[18px] bg-white shadow-card transition-shadow hover:shadow-card-lg">
      <div className={cn('relative overflow-visible rounded-t-[18px]', styles.imageBg)}>
        <Image
          src={image}
          alt={alt}
          className="aspect-[1.17] w-full rounded-t-[18px] object-cover"
        />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-ink shadow-sm">
          <BadgeCheck className={cn('h-3.5 w-3.5', styles.check)} strokeWidth={2.5} />
          Verified
        </span>
        <div
          className={cn(
            'absolute -bottom-6 left-4 flex h-13 w-13 items-center justify-center rounded-2xl border-[3px] border-white shadow-md',
            styles.iconBg,
          )}
        >
          <CategoryIcon className="h-6 w-6 text-white" strokeWidth={2} />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-4 pt-8">
        <h3 className="text-lg font-extrabold leading-tight text-ink">{name}</h3>
        <p className="mt-1 text-sm leading-snug text-ink-muted">{title}</p>

        <div className="mt-3 flex items-center gap-2 text-sm">
          <Star className="h-3.5 w-3.5 fill-star text-star" strokeWidth={0} />
          <span className="font-bold text-star">{rating.toFixed(2)}</span>
          <span className="text-ink-light">·</span>
          <span className="text-ink-muted">{experience}</span>
        </div>

        <div className="mt-5 border-t border-border pt-4" />

        <div className="mt-auto flex items-center justify-between gap-2">
          <p className="text-lg font-extrabold text-ink">
            {price}
            <span className="text-xs font-medium text-ink-muted">/event</span>
          </p>
          <button
            type="button"
            className={cn(
              'inline-flex h-10 shrink-0 items-center gap-1 rounded-xl px-4 text-xs font-bold text-white shadow-sm transition-colors',
              styles.button,
            )}
          >
            Book Now
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
  );
}
