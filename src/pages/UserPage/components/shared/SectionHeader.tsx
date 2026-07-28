import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionTo?: string;
  rightSlot?: ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  actionLabel,
  actionTo,
  rightSlot,
}: SectionHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
      <div className="min-w-0 max-w-2xl">
        {eyebrow ? (
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B46FE]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-xl font-bold tracking-tight text-[#111827] sm:text-2xl">{title}</h2>
        {subtitle ? <p className="mt-1.5 text-sm leading-relaxed text-[#6B7280]">{subtitle}</p> : null}
      </div>
      {rightSlot
        ? rightSlot
        : actionLabel && actionTo
          ? (
              <Link
                to={actionTo}
                className="shrink-0 text-sm font-semibold text-[#6B46FE] transition-colors hover:text-[#5530e8]"
              >
                {actionLabel}
              </Link>
            )
          : null}
    </div>
  );
}
