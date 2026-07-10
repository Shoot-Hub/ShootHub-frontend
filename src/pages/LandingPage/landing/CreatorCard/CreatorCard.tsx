import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Image } from '@/components/ui/Image';

export type CreatorCardProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  showPlayButton?: boolean;
  rotation?: number;
};

export function CreatorCard({
  src,
  alt,
  className,
  imageClassName,
  showPlayButton = false,
  rotation = 0,
}: CreatorCardProps) {
  return (
    <div className={className} style={{ transform: `rotate(${rotation}deg)` }}>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="overflow-hidden rounded-[28px] bg-white p-3 shadow-card-lg"
      >
        <div className="relative overflow-hidden rounded-[20px]">
          <Image
            src={src}
            alt={alt}
            className={cn('h-full w-full object-cover', imageClassName)}
          />
          {showPlayButton && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm">
                <div className="ml-0.5 h-0 w-0 border-y-[7px] border-l-[12px] border-y-transparent border-l-primary-500" />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
