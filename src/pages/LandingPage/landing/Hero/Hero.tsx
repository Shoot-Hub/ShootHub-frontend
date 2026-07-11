import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Heart, Play, Search, Sparkles, Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { AvatarGroup } from '@/components/ui/Avatar';
import { CreatorCard } from '../CreatorCard';
import { ReviewCard } from '../ReviewCard';
import { StatsCard } from '../StatsCard';
import { StarRating } from '../StarRating';
import { fadeInUp, floatingCard, staggerContainer } from '@/lib/motion';

import heroPhotographer from '@/assets/landing/hero-photographer.png';
import heroWedding from '@/assets/landing/hero-wedding.png';
import heroDrone from '@/assets/landing/hero-drone.png';
import avatar1 from '@/assets/landing/avatar-1.jpg';
import avatar2 from '@/assets/landing/avatar-2.jpg';
import avatar3 from '@/assets/landing/avatar-3.jpg';
import avatar4 from '@/assets/landing/avatar-4.jpg';
import creatorAvatar1 from '@/assets/landing/creator-avatar-1.jpg';
import creatorAvatar2 from '@/assets/landing/creator-avatar-2.jpg';
import creatorAvatar3 from '@/assets/landing/creator-avatar-3.jpg';

const clientAvatars = [
  { src: avatar1, alt: 'Happy client' },
  { src: avatar2, alt: 'Happy client' },
  { src: avatar3, alt: 'Happy client' },
  { src: avatar4, alt: 'Happy client' },
];

const creatorAvatars = [
  { src: creatorAvatar1, alt: 'Creator' },
  { src: creatorAvatar2, alt: 'Creator' },
  { src: creatorAvatar3, alt: 'Creator' },
];

export function Hero() {
  return (
    <section className="relative overflow-visible pb-4 pt-6 md:pt-8 lg:pt-10" aria-label="Hero">
      <Container size="wide" padding="tight">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,52%)_minmax(0,48%)] lg:items-center lg:gap-8 xl:gap-9">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="relative z-10 w-full min-w-0"
          >
            <motion.div variants={fadeInUp}>
              <Badge icon={<Star className="h-3.5 w-3.5 fill-primary-500 text-primary-500" />}>
                Most Trusted Creator Booking Platform in India
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mt-5 text-[44px] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-[52px] lg:text-[60px] xl:text-[66px] 2xl:text-[72px]"
            >
              Book the Perfect{' '}
              <span className="text-primary-500">Creator</span>
              <br className="hidden sm:block" />
              <span className="sm:ml-0"> for Your </span>
              <span className="relative inline-block font-script text-[50px] font-bold text-ink sm:text-[58px] lg:text-[66px] xl:text-[72px] 2xl:text-[78px]">
                Special Moments
                <Heart
                  className="ml-1 inline h-5 w-5 fill-primary-500 text-primary-500 lg:h-6 lg:w-6"
                  aria-hidden="true"
                />
                <svg
                  className="absolute -bottom-0.5 left-0 w-full"
                  viewBox="0 0 280 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 10C60 4 120 16 276 6"
                    stroke="#C7D2FE"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-5 max-w-[520px] text-[15px] leading-[1.7] text-ink-muted lg:max-w-none lg:text-base"
            >
              Find top photographers, videographers, studios and creative professionals.
              Compare, chat and book with ease.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                leftIcon={<Search className="h-5 w-5" strokeWidth={2.5} />}
                rightIcon={<ArrowRight className="h-5 w-5" strokeWidth={2.5} />}
              >
                Find Creators
              </Button>
              <Button
                size="lg"
                variant="secondary"
                leftIcon={
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white">
                    <Play className="h-3.5 w-3.5 fill-ink text-ink" />
                  </span>
                }
              >
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-7 flex flex-wrap items-center gap-4 sm:gap-5"
            >
              <div className="flex items-center gap-3">
                <AvatarGroup avatars={clientAvatars} size="sm" />
                <span className="text-sm font-semibold text-ink">
                  12,000+{' '}
                  <span className="rounded-md bg-primary-50 px-1.5 py-0.5 text-primary-600">
                    Happy Clients
                  </span>
                </span>
              </div>
              <div className="hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-ink">4.8</span>
                <StarRating rating={4.8} size="sm" />
                <span className="text-sm text-ink-muted">(2.5K Reviews)</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual — design-matched collage */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="relative mx-auto h-[480px] w-full max-w-[540px] min-w-0 sm:h-[510px] lg:mx-0 lg:ml-auto lg:h-[560px] lg:max-w-[580px] xl:h-[580px] xl:max-w-[600px]"
          >
            {/* Soft blur background */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute left-[5%] top-[10%] h-[240px] w-[240px] rounded-full bg-primary-100/75 blur-3xl" />
              <div className="absolute bottom-[8%] right-[0%] h-[220px] w-[220px] rounded-full bg-pink-100/60 blur-3xl" />
              <div className="absolute right-[15%] top-[2%] h-[160px] w-[160px] rounded-full bg-purple-100/50 blur-2xl" />
            </div>

            {/* Decorative sparkles */}
            <Sparkles
              className="absolute right-[18%] top-[8%] h-4 w-4 fill-primary-400 text-primary-400"
              aria-hidden="true"
            />
            <Sparkles
              className="absolute bottom-[24%] left-[6%] h-3.5 w-3.5 fill-primary-400 text-primary-400"
              aria-hidden="true"
            />
            <Sparkles
              className="absolute bottom-[10%] left-[18%] h-3 w-3 fill-primary-300 text-primary-300"
              aria-hidden="true"
            />
            <Sparkles
              className="absolute bottom-[8%] right-[20%] h-3 w-3 fill-primary-300 text-primary-300"
              aria-hidden="true"
            />

            {/* Dashed arrow */}
            <svg
              className="absolute -left-6 top-[40%] hidden h-[70px] w-[76px] text-primary-300 lg:block"
              viewBox="0 0 76 70"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 35C16 18 32 48 48 28C58 18 64 12 72 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5 4"
                strokeLinecap="round"
              />
              <path d="M68 4L72 8L68 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>

            {/* Main photographer — large left card */}
            <CreatorCard
              src={heroPhotographer}
              alt="Professional photographer capturing a moment"
              className="absolute left-[0%] top-[4%] z-10 w-[66%]"
              imageClassName="aspect-[3/4] min-h-[320px] lg:min-h-[380px] xl:min-h-[400px]"
              rotation={-7}
            />

            {/* Wedding couple — top right overlap */}
            <CreatorCard
              src={heroWedding}
              alt="Wedding couple portrait"
              className="absolute right-[0%] top-[0%] z-20 w-[50%]"
              imageClassName="aspect-[4/5] min-h-[250px] lg:min-h-[290px] xl:min-h-[305px]"
              rotation={7}
            />

            {/* Drone video — bottom center overlap */}
            <CreatorCard
              src={heroDrone}
              alt="Aerial drone videography"
              className="absolute bottom-[4%] left-[20%] z-30 w-[54%]"
              imageClassName="aspect-[16/10] min-h-[140px] lg:min-h-[160px] xl:min-h-[170px]"
              showPlayButton
              rotation={-4}
            />

            {/* Floating: 500+ Creators */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={floatingCard}
              transition={{ delay: 0.4 }}
              className="absolute -left-4 top-[0%] z-40 sm:-left-3"
            >
              <StatsCard
                title="500+ Creators"
                subtitle="Available"
                avatars={<AvatarGroup avatars={creatorAvatars} size="xxs" />}
                floatDelay={0.2}
              />
            </motion.div>

            {/* Floating: Easy Booking */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={floatingCard}
              transition={{ delay: 0.55 }}
              className="absolute -left-5 top-[36%] z-40 sm:-left-4"
            >
              <StatsCard
                icon={Calendar}
                title="Easy Booking"
                subtitle="In Just 3 Steps"
                floatDelay={1}
              />
            </motion.div>

            {/* Floating: Review card */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={floatingCard}
              transition={{ delay: 0.7 }}
              className="absolute bottom-[20%] -right-3 z-40 sm:right-0"
            >
              <ReviewCard rating={4.8} reviewCount="2.5K+ reviews" floatDelay={1.8} />
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
