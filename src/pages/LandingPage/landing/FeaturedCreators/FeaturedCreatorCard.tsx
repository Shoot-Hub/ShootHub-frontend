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
import { Link, useNavigate } from 'react-router-dom';
import { Image } from '@/components/ui/Image';
import { useAuth } from '@/features/auth';
import { cn } from '@/lib/utils';

export type CreatorTheme = 'purple' | 'teal' | 'dark' | 'orange';

const themeStyles: Record<
  CreatorTheme,
  { imageBg: string; iconBg: string; button: string; check: string; outline: string }
> = {
  purple: {
    imageBg: 'bg-[#4c1d95]',
    iconBg: 'bg-[#6d00ff]',
    button: 'bg-[#6d00ff] hover:bg-primary-700',
    check: 'text-primary-500',
    outline: 'border-[#6d00ff]/30 text-[#6d00ff] hover:bg-[#F3EEFF]',
  },
  teal: {
    imageBg: 'bg-[#0f766e]',
    iconBg: 'bg-[#14b8a6]',
    button: 'bg-[#0ea5a3] hover:bg-[#0f766e]',
    check: 'text-[#14b8a6]',
    outline: 'border-[#0ea5a3]/35 text-[#0ea5a3] hover:bg-[#E6FFFB]',
  },
  dark: {
    imageBg: 'bg-[#111827]',
    iconBg: 'bg-[#111827]',
    button: 'bg-[#111827] hover:bg-black',
    check: 'text-[#1e293b]',
    outline: 'border-[#111827]/25 text-[#111827] hover:bg-[#F8F9FB]',
  },
  orange: {
    imageBg: 'bg-[#ea580c]',
    iconBg: 'bg-[#ff8a00]',
    button: 'bg-[#ff8a00] hover:bg-[#ea580c]',
    check: 'text-[#f97316]',
    outline: 'border-[#ff8a00]/35 text-[#ea580c] hover:bg-[#FFF4E5]',
  },
};

const categoryIcons: Record<CreatorTheme, LucideIcon> = {
  purple: Camera,
  teal: Video,
  dark: Drone,
  orange: User,
};

export type FeaturedCreatorCardProps = {
  id: string;
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
  id,
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
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const profilePath = `/creators/${id}`;

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: profilePath, intent: 'book' } });
      return;
    }
    navigate(profilePath);
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[18px] bg-white shadow-card transition-shadow hover:shadow-card-lg">
      <Link to={profilePath} className={cn('relative block overflow-visible rounded-t-[18px]', styles.imageBg)}>
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
      </Link>

      <div className="flex flex-1 flex-col px-5 pb-4 pt-8">
        <Link to={profilePath}>
          <h3 className="text-lg font-extrabold leading-tight text-ink transition-colors hover:text-[#6B46FE]">
            {name}
          </h3>
        </Link>
        <p className="mt-1 text-sm leading-snug text-ink-muted">{title}</p>

        <div className="mt-3 flex items-center gap-2 text-sm">
          <Star className="h-3.5 w-3.5 fill-star text-star" strokeWidth={0} />
          <span className="font-bold text-star">{rating.toFixed(2)}</span>
          <span className="text-ink-light">·</span>
          <span className="text-ink-muted">{experience}</span>
        </div>

        <div className="mt-5 border-t border-border pt-4" />

        <div className="mt-auto space-y-2.5">
          <p className="text-lg font-extrabold text-ink">
            {price}
            <span className="text-xs font-medium text-ink-muted">/event</span>
          </p>
          <div className="flex items-center gap-2">
            <Link
              to={profilePath}
              className={cn(
                'inline-flex h-10 flex-1 items-center justify-center rounded-xl border bg-white px-3 text-xs font-bold transition-colors',
                styles.outline,
              )}
            >
              View Profile
            </Link>
            <button
              type="button"
              onClick={handleBookNow}
              className={cn(
                'inline-flex h-10 flex-1 items-center justify-center gap-1 rounded-xl px-3 text-xs font-bold text-white shadow-sm transition-colors',
                styles.button,
              )}
            >
              Book Now
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
