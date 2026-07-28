import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface MotionSectionProps extends HTMLMotionProps<'section'> {
  children: ReactNode;
  delay?: number;
}

export function MotionSection({ children, delay = 0, className, ...props }: MotionSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}
