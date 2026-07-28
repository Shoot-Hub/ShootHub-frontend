import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetDate));

  useEffect(() => {
    const id = window.setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => window.clearInterval(id);
  }, [targetDate]);

  const units: { label: string; value: number }[] = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="rounded-2xl border border-white/15 bg-white/10 px-2 py-3 text-center backdrop-blur-md sm:px-3 sm:py-4"
        >
          <p className="text-xl font-bold tabular-nums text-white sm:text-3xl">
            {String(unit.value).padStart(2, '0')}
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/65">
            {unit.label}
          </p>
        </div>
      ))}
    </div>
  );
}
