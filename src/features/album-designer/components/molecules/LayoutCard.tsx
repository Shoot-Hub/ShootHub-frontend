import { cn } from '@/lib/utils';
import type { LayoutPreset } from '../../data';

type Props = {
  layout: LayoutPreset;
  onSelect: () => void;
};

export function LayoutCard({ layout, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group overflow-hidden rounded-[16px] border border-[var(--ad-border)] bg-white text-left transition-all hover:-translate-y-0.5 hover:border-[#C9B8FF] hover:shadow-[var(--ad-shadow-soft)]"
    >
      <div className="relative aspect-[4/3] bg-[#F5F6F8] p-2">
        <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-white shadow-inner">
          {layout.slots.map((slot, i) => (
            <div
              key={i}
              className={cn(
                'absolute rounded-[4px] transition-colors',
                i % 2 === 0 ? 'bg-[var(--ad-primary-mid)]' : 'bg-[#E8EAEF]',
                'group-hover:bg-[var(--ad-primary-soft)]',
              )}
              style={{
                left: `${slot.x}%`,
                top: `${slot.y}%`,
                width: `${slot.width}%`,
                height: `${slot.height}%`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="px-2.5 py-2">
        <p className="truncate text-[11px] font-bold text-[var(--ad-ink)]">{layout.name}</p>
        <p className="text-[10px] font-medium text-[var(--ad-ink-muted)]">
          {layout.slots.length} slots · {layout.category}
        </p>
      </div>
    </button>
  );
}
