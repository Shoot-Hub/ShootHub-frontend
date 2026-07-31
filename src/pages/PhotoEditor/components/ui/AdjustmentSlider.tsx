import * as Slider from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

type Props = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  displayValue?: string;
  /** Instant preview */
  onChange: (value: number) => void;
  /** Commit to history (pointer up) */
  onCommit?: (value: number) => void;
  className?: string;
};

export function AdjustmentSlider({
  label,
  value,
  min = -100,
  max = 100,
  step = 1,
  displayValue,
  onChange,
  onCommit,
  className,
}: Props) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] font-semibold text-[var(--pe-ink-soft)]">{label}</span>
        <span className="min-w-[42px] text-right text-[11px] font-bold tabular-nums text-[var(--pe-ink)]">
          {displayValue ?? value}
        </span>
      </div>
      <Slider.Root
        className="relative flex h-5 w-full touch-none select-none items-center"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v ?? 0)}
        onValueCommit={([v]) => onCommit?.(v ?? 0)}
      >
        <Slider.Track className="pe-slider-track relative h-[4px] grow rounded-full">
          <Slider.Range className="absolute h-full rounded-full bg-[var(--pe-primary)]" />
        </Slider.Track>
        <Slider.Thumb
          className="block h-4 w-4 rounded-full border-2 border-[var(--pe-ink)] bg-[var(--pe-primary)] shadow-[0_2px_10px_var(--pe-primary-glow)] transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pe-primary)]/50"
          aria-label={label}
        />
      </Slider.Root>
    </div>
  );
}
