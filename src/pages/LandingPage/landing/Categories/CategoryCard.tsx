import type { LucideIcon } from 'lucide-react';
import { Image } from '@/components/ui/Image';

export type CategoryCardProps = {
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
  alt: string;
};

export function CategoryCard({ title, description, image, icon: Icon, alt }: CategoryCardProps) {
  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-[20px] bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg">
      <div className="relative">
        <Image
          src={image}
          alt={alt}
          className="aspect-[4/3] w-full object-cover"
        />
        <div className="absolute -bottom-5 left-1/2 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-xl border border-primary-100 bg-white shadow-md">
          <Icon className="h-5 w-5 text-primary-500" strokeWidth={2} />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-4 pb-5 pt-8 text-center">
        <h3 className="text-base font-extrabold text-ink">{title}</h3>
        <p className="mt-1.5 text-[13px] leading-snug text-ink-muted">{description}</p>
      </div>
    </article>
  );
}
