import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Image } from '@/components/ui/Image';
import { cardHover } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { type CategoryItem } from './data';
import { formatPrice } from './filters';

type CategoryDetailCardProps = {
  category: CategoryItem;
};

export function CategoryDetailCard({ category }: CategoryDetailCardProps) {
  const Icon = category.icon;

  return (
    <motion.article
      whileHover={cardHover}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-border/50 bg-white shadow-card"
    >
      <div className="relative">
        <Image
          src={category.image}
          alt={category.alt}
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {category.popular && (
            <span className="rounded-full bg-primary-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-button">
              Popular
            </span>
          )}
          {category.trending && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-600 backdrop-blur-sm">
              Trending
            </span>
          )}
        </div>

        <div className="absolute -bottom-5 left-5 flex h-11 w-11 items-center justify-center rounded-xl border border-primary-100 bg-white shadow-md">
          <Icon className="h-5 w-5 text-primary-500" strokeWidth={2} />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-8">
        <h3 className="text-lg font-extrabold text-ink">{category.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{category.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-ink-muted">
          <span className="text-sm font-extrabold text-primary-600">
            From {formatPrice(category.startingPrice)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {category.creators.toLocaleString('en-IN')} creators
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-star text-star" strokeWidth={0} />
            {category.rating}
          </span>
        </div>

        <div className={cn('mt-5 flex flex-col gap-2 sm:flex-row')}>
          <Link
            to={`/creators?category=${encodeURIComponent(category.title)}`}
            className="flex-1"
          >
            <Button fullWidth size="sm" pill>
              Book Now
            </Button>
          </Link>
          <Link
            to={`/creators?category=${encodeURIComponent(category.title)}`}
            className="flex-1"
          >
            <Button fullWidth size="sm" variant="secondary" pill>
              View Creators
            </Button>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
