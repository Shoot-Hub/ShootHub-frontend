import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { AuthBannerVariant } from '@/types/auth';
import { Logo } from '@/pages/LandingPage/landing/Logo';
import { FeatureCard } from '@/components/auth/FeatureCard';
import { LOGIN_FEATURES, SIGNUP_BENEFITS } from '@/constants/auth';
import { StarRating } from '@/pages/LandingPage/landing/StarRating';
import heroPhotographer from '@/assets/landing/hero-photographer.png';
import avatar1 from '@/assets/landing/avatar-1.jpg';
import avatar2 from '@/assets/landing/avatar-2.jpg';
import avatar3 from '@/assets/landing/avatar-3.jpg';
import avatar4 from '@/assets/landing/avatar-4.jpg';

type AuthBannerProps = {
  variant: AuthBannerVariant;
};

const testimonialAvatars = [avatar1, avatar2, avatar3, avatar4];

function BlurOrbs() {
  return (
    <>
      <div className="pointer-events-none absolute -right-16 top-16 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 bottom-24 h-44 w-44 rounded-full bg-indigo-400/15 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/2 h-32 w-32 rounded-full bg-sky-300/20 blur-2xl" />
    </>
  );
}

export function AuthBanner({ variant }: AuthBannerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="relative flex h-full w-full min-h-0 flex-col overflow-hidden rounded-l-[var(--radius-auth)] bg-gradient-to-br from-blue-50 via-white to-indigo-50/60 p-6 lg:p-7"
    >
      <BlurOrbs />

      <motion.div variants={fadeIn} className="relative z-10 -mb-1 shrink-0 leading-none">
        <Logo className="block h-32 w-auto sm:h-36 lg:h-40" />
      </motion.div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {variant === 'login' ? <LoginBannerContent /> : <SignupBannerContent />}
      </div>
    </motion.div>
  );
}

function LoginBannerContent() {
  return (
    <>
      <motion.div variants={fadeInUp} className="mt-1 shrink-0">
        <h1 className="text-[1.85rem] font-bold leading-[1.15] tracking-tight text-ink">
          Every Moment.
          <br />
          Every Creator.
          <br />
          <span className="text-auth-primary">One Hub.</span>
        </h1>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
          The ultimate platform to discover, book and deliver photography experiences.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp} className="relative mt-6 min-h-0 flex-1">
        <div className="relative h-full min-h-[160px] overflow-hidden rounded-2xl">
          <img
            src={heroPhotographer}
            alt="Professional photographer capturing a scenic landscape"
            className="h-full w-full object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="relative z-10 mt-4 grid shrink-0 grid-cols-3 gap-3">
        {LOGIN_FEATURES.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </motion.div>
    </>
  );
}

function SignupBannerContent() {
  return (
    <>
      <motion.div variants={fadeInUp} className="mt-1 flex min-h-0 flex-1 flex-col gap-2.5">
        {SIGNUP_BENEFITS.map((benefit) => (
          <div
            key={benefit.title}
            className="flex shrink-0 items-start gap-3.5 rounded-2xl border border-white/80 bg-white/70 p-3.5 shadow-auth-glass backdrop-blur-md"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-auth-accent/10">
              <benefit.icon className="h-5 w-5 text-auth-accent" strokeWidth={2} />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-semibold text-ink">{benefit.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">{benefit.description}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div
        variants={fadeInUp}
        className="mt-3 shrink-0 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-auth-glass backdrop-blur-md"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-auth-accent/10">
          <Quote className="h-5 w-5 text-auth-accent" strokeWidth={2} />
        </div>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
          ShootHub made it easy to find the perfect photographer for our special day. The
          experience was seamless!
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {testimonialAvatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt=""
                  className={cn('h-8 w-8 rounded-full border-2 border-white object-cover')}
                />
              ))}
            </div>
            <span className="rounded-full bg-auth-accent/10 px-2 py-0.5 text-xs font-semibold text-auth-accent">
              +2K
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-ink-muted">Happy Clients</p>
            <StarRating rating={5} size="sm" className="mt-1 justify-end" />
          </div>
        </div>
      </motion.div>
    </>
  );
}
