import type { Variants, Transition } from 'framer-motion';

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export const floatingCard: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

type FloatOptions = {
  delay?: number;
  duration?: number;
  distance?: number;
};

export function createFloatAnimation({
  delay = 0,
  duration = 3.5,
  distance = 10,
}: FloatOptions = {}) {
  return {
    y: [0, -distance, 0],
    transition: {
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    } satisfies Transition,
  };
}

export const floatAnimation = createFloatAnimation();
