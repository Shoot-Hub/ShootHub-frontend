import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <div
      className={`rounded-3xl border border-white/70 bg-white/80 shadow-[0_8px_40px_-12px_rgba(17,24,39,0.12),0_2px_12px_-4px_rgba(107,70,254,0.08)] backdrop-blur-xl ${
        hover
          ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-16px_rgba(107,70,254,0.22),0_8px_24px_-8px_rgba(17,24,39,0.1)]'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
