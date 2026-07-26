import { cn } from '@/lib/utils';

const STEPS = [
  { num: 1, label: 'Album Info' },
  { num: 2, label: 'Select Photos' },
  { num: 3, label: 'Template' },
  { num: 4, label: 'Open Editor' },
] as const;

export function WizardStepper({ step }: { step: number }) {
  return (
    <nav aria-label="Wizard steps" className="flex flex-wrap items-center justify-center gap-2 sm:gap-0">
      {STEPS.map((s, idx) => {
        const done = step > s.num;
        const active = step === s.num;
        return (
          <div key={s.num} className="flex items-center">
            <div
              className="flex flex-col items-center gap-1.5"
              aria-label={s.label}
              aria-current={active ? 'step' : undefined}
            >
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all',
                  done && 'bg-[#28C76F] text-white',
                  active && 'bg-[#6B46FE] text-white shadow-md shadow-[#6B46FE]/30',
                  !done && !active && 'bg-[#EEF0F4] text-[#A0A4B0]',
                )}
              >
                {done ? '✓' : s.num}
              </div>
              <span
                className={cn(
                  'hidden text-[11px] font-semibold sm:block',
                  active ? 'text-[#6B46FE]' : 'text-[#A0A4B0]',
                )}
              >
                {s.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  'mx-2 mb-5 hidden h-0.5 w-10 sm:block sm:w-14',
                  step > s.num ? 'bg-[#28C76F]' : 'bg-[#EEF0F4]',
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
