import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { AuthBannerVariant } from '@/types/auth';
import { FeatureCard } from '@/components/auth/FeatureCard';
import { LOGIN_FEATURES, SIGNUP_BENEFITS } from '@/constants/auth';
import { StarRating } from '@/pages/LandingPage/landing/StarRating';
import loginHero from '@/assets/auth/login-hero.jpg';
import avatar1 from '@/assets/landing/avatar-1.jpg';
import avatar2 from '@/assets/landing/avatar-2.jpg';
import avatar3 from '@/assets/landing/avatar-3.jpg';
import avatar4 from '@/assets/landing/avatar-4.jpg';
import { AuthBrandMark } from '@/components/auth/AuthBrandMark';

type AuthBannerProps = {
  variant: AuthBannerVariant;
};

const testimonialAvatars = [avatar1, avatar2, avatar3, avatar4];

export function AuthBanner({ variant }: AuthBannerProps) {
  const isLogin = variant === 'login';

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className={cn(
        'relative flex h-full w-full min-h-0 flex-col overflow-hidden rounded-l-[var(--radius-auth)]',
        isLogin
          ? 'bg-[#0b0618]'
          : 'bg-gradient-to-b from-[#f5f0ff] via-[#faf7ff] to-[#efe8ff]',
      )}
    >
      {isLogin ? <LoginBannerContent /> : <SignupBannerContent />}
    </motion.div>
  );
}

function LoginBannerContent() {
  return (
    <>
      <img
        src={loginHero}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#160b2e]/92 via-[#12081f]/78 to-[#0b0618]/95"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(124,58,237,0.35),transparent_55%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full min-h-0 flex-col p-7 lg:p-8 xl:p-10">
        <motion.div variants={fadeIn} className="shrink-0">
          <AuthBrandMark />
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-[12%] max-w-md shrink-0">
          <h1 className="text-[2rem] font-bold leading-[1.15] tracking-tight text-white xl:text-[2.35rem]">
            Every Moment.
            <br />
            Every Creator.
            <br />
            <span className="relative inline-block text-auth-primary">
              One Hub.
              <span
                className="absolute -bottom-1 left-0 h-[3px] w-[72%] rounded-full bg-auth-primary"
                aria-hidden="true"
              />
            </span>
          </h1>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/75">
            The ultimate platform to discover, book and deliver unforgettable photography
            experiences.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="relative z-10 mt-auto grid shrink-0 grid-cols-3 gap-3 pt-8"
        >
          {LOGIN_FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              variant="dark"
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </motion.div>
      </div>
    </>
  );
}

function SignupDotPattern() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.45]"
      aria-hidden="true"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(124,58,237,0.28) 1.1px, transparent 1.2px)',
        backgroundSize: '22px 22px',
        maskImage: 'linear-gradient(to bottom, black 0%, black 45%, transparent 78%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 45%, transparent 78%)',
      }}
    />
  );
}

function SignupBannerContent() {
  return (
    <>
      <SignupDotPattern />

      <img
        src={loginHero}
        alt=""
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] w-full object-cover object-center opacity-90"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-b from-[#f5f0ff] via-[#f5f0ff]/75 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1a0b2e]/35 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full min-h-0 flex-col p-6 lg:p-7 xl:p-8">
        <motion.div variants={fadeIn} className="shrink-0">
          <AuthBrandMark tone="light" />
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-7 shrink-0 max-w-md">
          <h1 className="text-[1.85rem] font-bold leading-[1.18] tracking-tight text-ink xl:text-[2.15rem]">
            Create. Connect.
            <br />
            <span className="text-auth-primary">Deliver Memories.</span>
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
            Join ShootHub and start your amazing journey today.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="mt-6 flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto"
        >
          {SIGNUP_BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="flex shrink-0 items-start gap-3.5 rounded-2xl border border-white/90 bg-white/90 p-3.5 shadow-auth-glass backdrop-blur-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-auth-primary/10">
                <benefit.icon className="h-5 w-5 text-auth-primary" strokeWidth={2} />
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
          className="mt-3 shrink-0 rounded-2xl border border-white/90 bg-white/95 p-4 shadow-auth-glass backdrop-blur-md"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-auth-primary/10">
            <Quote className="h-5 w-5 text-auth-primary" strokeWidth={2} />
          </div>
          <p className="mt-2.5 text-sm leading-relaxed text-ink-muted italic">
            &ldquo;ShootHub makes it easy to find the perfect photographer for our special day.
            The experience was seamless!&rdquo;
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
              <span className="rounded-full bg-auth-primary/10 px-2 py-0.5 text-xs font-semibold text-auth-primary">
                +2K
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-ink-muted">Happy Clients</p>
              <StarRating rating={5} size="sm" className="mt-1 justify-end" />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
