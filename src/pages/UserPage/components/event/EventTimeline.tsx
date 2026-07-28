import { Check } from 'lucide-react';
import type { TimelineStep } from '../../types/dashboard.types';
import { GlassCard } from '../shared/GlassCard';

interface EventTimelineProps {
  steps: TimelineStep[];
}

export function EventTimeline({ steps }: EventTimelineProps) {
  return (
    <GlassCard className="p-5 sm:p-6" hover={false}>
      <ol className="space-y-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const done = step.status === 'done';
          const current = step.status === 'current';

          return (
            <li key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast ? (
                <span
                  className={`absolute left-[15px] top-8 h-[calc(100%-20px)] w-px ${
                    done ? 'bg-[#6B46FE]/40' : 'bg-[#E5E7EB]'
                  }`}
                />
              ) : null}

              <span
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done
                    ? 'bg-[#6B46FE] text-white'
                    : current
                      ? 'bg-[#F3EEFF] text-[#6B46FE] ring-2 ring-[#6B46FE]/35'
                      : 'bg-[#F3F4F6] text-[#9CA3AF]'
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : index + 1}
              </span>

              <div className="min-w-0 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-[#111827]">{step.title}</h3>
                  {current ? (
                    <span className="rounded-full bg-[#6B46FE]/10 px-2 py-0.5 text-[10px] font-bold text-[#6B46FE]">
                      Current
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[#6B7280]">{step.description}</p>
                <p className="mt-1.5 text-[11px] font-semibold text-[#9CA3AF]">{step.date}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </GlassCard>
  );
}
