import { Images } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  label?: string;
};

/** Full-panel loading skeleton for lazy-loaded editor chrome. */
export function PanelSkeleton({ className, label = 'Loading editor…' }: Props) {
  return (
    <div
      className={cn(
        'flex h-full min-h-[200px] flex-col gap-3 p-4',
        className,
      )}
      role="status"
      aria-busy="true"
      aria-label={label}
    >
      <div className="pe-skeleton h-8 w-2/3 rounded-[12px]" />
      <div className="pe-skeleton h-24 w-full rounded-[14px]" />
      <div className="pe-skeleton h-10 w-full rounded-[12px]" />
      <div className="pe-skeleton h-10 w-full rounded-[12px]" />
      <div className="pe-skeleton h-10 w-4/5 rounded-[12px]" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

/** Route-level fallback while the Photo Editor chunk loads. */
export function PhotoEditorRouteFallback() {
  return (
    <div
      className="photo-editor-root flex h-dvh flex-col items-center justify-center gap-4 bg-[var(--pe-bg)] text-[var(--pe-ink)]"
      role="status"
      aria-busy="true"
      aria-label="Loading Photo Editor"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--pe-primary-soft)] text-[var(--pe-primary)]">
        <Images className="h-6 w-6" />
      </div>
      <div className="w-[min(280px,70vw)] space-y-2">
        <div className="pe-skeleton h-3 w-full rounded-full" />
        <div className="pe-skeleton mx-auto h-3 w-2/3 rounded-full" />
      </div>
      <p className="text-xs font-semibold text-[var(--pe-ink-muted)]">Loading Photo Editor…</p>
    </div>
  );
}
