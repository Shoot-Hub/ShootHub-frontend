import { BellRing } from 'lucide-react';

type Props = {
  onEnable: () => void;
};

export function ReminderBanner({ onEnable }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-[#E4D9FF] bg-gradient-to-r from-[#F3EEFF] to-[#E8F4FD] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6B46FE] shadow-sm">
          <BellRing className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-extrabold text-slate-900">Never Miss a Moment!</p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500 sm:text-sm">
            Enable notifications to get reminded before each key event.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onEnable}
        className="shrink-0 rounded-xl bg-[#6B46FE] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B46FE]/25 transition hover:bg-[#5A2FE0]"
      >
        Enable Reminders
      </button>
    </div>
  );
}
