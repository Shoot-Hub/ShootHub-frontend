import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export function StarPicker({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="rounded-lg p-0.5 transition hover:scale-110"
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            className={cn(
              'h-7 w-7 sm:h-8 sm:w-8',
              star <= value
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-[#D1D5DB]',
            )}
          />
        </button>
      ))}
      <span className="ml-2 text-xs text-[#A0A4B0]">
        {value > 0 ? `${value}/5` : 'Select rating'}
      </span>
    </div>
  );
}
