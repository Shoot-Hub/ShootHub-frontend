import * as Slider from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

type Props = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  displayValue?: string;
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
  className?: string;
  showInput?: boolean;
};

export function SliderField({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  displayValue,
  onChange,
  onCommit,
  className,
  showInput,
}: Props) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] font-semibold text-[var(--ve-ink-soft)]">{label}</span>
        {showInput ? (
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-7 w-14 rounded-[8px] border border-[var(--ve-border-strong)] bg-[var(--ve-card)] px-1.5 text-right text-[11px] font-bold tabular-nums text-[var(--ve-ink)] outline-none focus:border-[var(--ve-primary)]"
          />
        ) : (
          <span className="min-w-[42px] text-right text-[11px] font-bold tabular-nums text-[var(--ve-ink)]">
            {displayValue ?? value}
          </span>
        )}
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
        <Slider.Track className="ve-slider-track relative h-[4px] grow rounded-full">
          <Slider.Range className="absolute h-full rounded-full bg-[var(--ve-primary)]" />
        </Slider.Track>
        <Slider.Thumb
          className="block h-3.5 w-3.5 rounded-full border-2 border-[var(--ve-ink)] bg-[var(--ve-primary)] shadow-[0_2px_10px_var(--ve-primary-glow)] transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ve-primary)]/50"
          aria-label={label}
        />
      </Slider.Root>
    </div>
  );
}
