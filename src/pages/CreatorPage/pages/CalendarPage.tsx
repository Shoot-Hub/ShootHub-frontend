import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DatesSetArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  MoreHorizontal,
} from 'lucide-react';

type ViewId = 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth';

const EVENT_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  purple: { border: '#6B46FE', bg: '#F3EEFF', text: '#6B46FE' },
  blue: { border: '#3498DB', bg: '#E8F4FD', text: '#3498DB' },
  green: { border: '#28C76F', bg: '#E4F8ED', text: '#28C76F' },
  orange: { border: '#FF9F43', bg: '#FFF4E5', text: '#FF9F43' },
  red: { border: '#EA5455', bg: '#FFE8E8', text: '#EA5455' },
  violet: { border: '#8B5CF6', bg: '#F5F3FF', text: '#8B5CF6' },
};

const calendarEvents = [
  {
    id: '1',
    title: 'Product Shoot',
    start: '2024-05-12T09:00:00',
    end: '2024-05-12T11:00:00',
    extendedProps: { colorKey: 'purple', client: 'Brand Co.' },
  },
  {
    id: '2',
    title: 'Client Meeting',
    start: '2024-05-13T11:00:00',
    end: '2024-05-13T13:00:00',
    extendedProps: { colorKey: 'blue', client: 'Mehta Family' },
  },
  {
    id: '3',
    title: 'Wedding Shoot',
    start: '2024-05-14T10:00:00',
    end: '2024-05-14T13:00:00',
    extendedProps: { colorKey: 'green', client: 'Priya & Rahul' },
  },
  {
    id: '4',
    title: 'Pre Wedding',
    start: '2024-05-15T13:00:00',
    end: '2024-05-15T15:00:00',
    extendedProps: { colorKey: 'orange', client: 'Ananya & Vikram' },
  },
  {
    id: '5',
    title: 'Studio Session',
    start: '2024-05-16T09:00:00',
    end: '2024-05-16T11:00:00',
    extendedProps: { colorKey: 'red', client: 'Fashion Edit' },
  },
  {
    id: '6',
    title: 'Portrait Shoot',
    start: '2024-05-17T12:00:00',
    end: '2024-05-17T14:00:00',
    extendedProps: { colorKey: 'violet', client: 'Solo Client' },
  },
  {
    id: '7',
    title: 'Wedding Shoot',
    start: '2024-05-18T14:00:00',
    end: '2024-05-18T17:00:00',
    extendedProps: { colorKey: 'green', client: 'Priya & Rahul' },
  },
];

const upcomingEvents = [
  {
    title: 'Wedding Shoot',
    client: 'Priya & Rahul',
    date: 'Sat, May 18',
    time: '2:00 PM',
    location: 'Udaipur Palace',
    color: 'bg-[#28C76F]',
  },
  {
    title: 'Pre Wedding Shoot',
    client: 'Ananya & Vikram',
    date: 'Wed, May 15',
    time: '1:00 PM',
    location: 'Jaipur Fort',
    color: 'bg-[#FF9F43]',
  },
  {
    title: 'Client Meeting',
    client: 'Mehta Family',
    date: 'Mon, May 13',
    time: '11:00 AM',
    location: 'Studio Office',
    color: 'bg-[#3498DB]',
  },
];

function formatRangeLabel(start: Date, end: Date, viewType: string) {
  if (viewType === 'timeGridDay') {
    return start.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
  if (viewType === 'dayGridMonth') {
    return start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
  const endDay = new Date(end);
  endDay.setDate(endDay.getDate() - 1);
  const sameMonth = start.getMonth() === endDay.getMonth();
  const left = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const right = endDay.toLocaleDateString('en-US', {
    month: sameMonth ? undefined : 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${left} – ${right}`;
}

function MiniMonth({
  cursor,
  onPrev,
  onNext,
  onSelectDay,
}: {
  cursor: Date;
  onPrev: () => void;
  onNext: () => void;
  onSelectDay: (date: Date) => void;
}) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = new Date();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weekStart = new Date(cursor);
  weekStart.setDate(cursor.getDate() - cursor.getDay());
  const weekDays = new Set(
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }),
  );

  const cells = useMemo(() => {
    const list: Array<number | null> = [];
    for (let i = 0; i < firstDay; i++) list.push(null);
    for (let d = 1; d <= daysInMonth; d++) list.push(d);
    return list;
  }, [firstDay, daysInMonth]);

  return (
    <div className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#2D3436]">{monthLabel}</h3>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onPrev}
            className="rounded-lg p-1 text-[#A0A4B0] hover:bg-[#F8F9FB]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-lg p-1 text-[#A0A4B0] hover:bg-[#F8F9FB]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mb-1 grid grid-cols-7 text-center">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span key={d} className="py-1 text-[10px] font-semibold text-[#A0A4B0]">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center">
        {cells.map((day, i) => {
          if (!day) return <span key={i} />;
          const date = new Date(year, month, day);
          const key = `${year}-${month}-${day}`;
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          const isSelected =
            day === cursor.getDate() &&
            month === cursor.getMonth() &&
            year === cursor.getFullYear();
          const inWeek = weekDays.has(key);

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectDay(date)}
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs transition-colors ${
                isSelected || isToday
                  ? 'bg-[#6B46FE] font-bold text-white shadow-sm shadow-[#6B46FE]/30'
                  : inWeek
                    ? 'bg-[#F3EEFF] font-semibold text-[#6B46FE]'
                    : 'font-medium text-[#2D3436] hover:bg-[#F8F9FB]'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function renderEventContent(arg: EventContentArg) {
  const colorKey = (arg.event.extendedProps.colorKey as string) || 'purple';
  const palette = EVENT_COLORS[colorKey] || EVENT_COLORS.purple;
  const start = arg.event.start;
  const end = arg.event.end;
  const timeLabel =
    start && end
      ? `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} – ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
      : arg.timeText;

  if (arg.view.type === 'dayGridMonth') {
    return (
      <div className="flex w-full items-center gap-1 overflow-hidden px-1 py-0.5">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: palette.border }}
        />
        <span className="truncate text-[11px] font-semibold" style={{ color: palette.text }}>
          {arg.event.title}
        </span>
      </div>
    );
  }

  return (
    <div
      className="fc-sh-event flex h-full w-full flex-col overflow-hidden rounded-lg border-l-[3px] px-2 py-1.5"
      style={{
        backgroundColor: palette.bg,
        borderLeftColor: palette.border,
      }}
    >
      <div className="flex items-start justify-between gap-1">
        <p className="truncate text-xs font-bold" style={{ color: palette.text }}>
          {arg.event.title}
        </p>
        <MoreHorizontal className="h-3 w-3 shrink-0 text-[#A0A4B0]" />
      </div>
      <p className="mt-0.5 text-[10px] font-medium text-[#636E72]">{timeLabel}</p>
    </div>
  );
}

export function CalendarPage() {
  const calendarRef = useRef<FullCalendar>(null);
  const [view, setView] = useState<ViewId>('timeGridWeek');
  const [cursorDate, setCursorDate] = useState(() => new Date(2024, 4, 14));
  const [rangeLabel, setRangeLabel] = useState('May 12 – 18, 2024');

  const goTo = (date: Date) => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api.gotoDate(date);
    setCursorDate(date);
  };

  const shiftMain = (dir: 'prev' | 'next' | 'today') => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    if (dir === 'prev') api.prev();
    else if (dir === 'next') api.next();
    else api.today();
    setCursorDate(api.getDate());
  };

  const changeView = (next: ViewId) => {
    setView(next);
    calendarRef.current?.getApi().changeView(next);
  };

  const onDatesSet = (arg: DatesSetArg) => {
    setRangeLabel(formatRangeLabel(arg.start, arg.end, arg.view.type));
    setCursorDate(arg.view.currentStart);
  };

  const onEventClick = (_arg: EventClickArg) => {
    // reserved for event detail modal
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2D3436]">Calendar</h2>
          <p className="mt-0.5 text-sm text-[#636E72]">
            Plan shoots, meetings, and deadlines in one place.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6B46FE] to-[#8A60FF] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6B46FE]/25 transition-all hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          New Event
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <MiniMonth
              cursor={cursorDate}
              onPrev={() => {
                const d = new Date(cursorDate);
                d.setMonth(d.getMonth() - 1);
                goTo(d);
              }}
              onNext={() => {
                const d = new Date(cursorDate);
                d.setMonth(d.getMonth() + 1);
                goTo(d);
              }}
              onSelectDay={goTo}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-[#EEF0F4] bg-white p-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]"
          >
            <h3 className="mb-3 text-sm font-bold text-[#2D3436]">Upcoming Events</h3>
            <div className="space-y-3">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.title + ev.date}
                  className="flex gap-3 rounded-xl border border-[#F5F6F8] bg-[#FAFBFC] p-3 transition-colors hover:bg-[#F5F6FA]"
                >
                  <div className={`mt-1 h-10 w-1 shrink-0 rounded-full ${ev.color}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#2D3436]">{ev.title}</p>
                    <p className="truncate text-xs text-[#636E72]">{ev.client}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#A0A4B0]">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {ev.date} · {ev.time}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {ev.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]"
        >
          <div className="flex flex-col gap-3 border-b border-[#EEF0F4] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => shiftMain('prev')}
                className="rounded-lg p-1.5 text-[#A0A4B0] hover:bg-[#F8F9FB]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h3 className="text-sm font-bold text-[#2D3436]">{rangeLabel}</h3>
              <button
                type="button"
                onClick={() => shiftMain('next')}
                className="rounded-lg p-1.5 text-[#A0A4B0] hover:bg-[#F8F9FB]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => shiftMain('today')}
                className="ml-1 rounded-lg border border-[#EEF0F4] px-2.5 py-1 text-[11px] font-semibold text-[#636E72] hover:bg-[#F8F9FB]"
              >
                Today
              </button>
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-[#F8F9FB] p-1">
              {(
                [
                  { id: 'timeGridDay', label: 'Day' },
                  { id: 'timeGridWeek', label: 'Week' },
                  { id: 'dayGridMonth', label: 'Month' },
                ] as const
              ).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => changeView(v.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    view === v.id
                      ? 'bg-[#6B46FE] text-white shadow-sm'
                      : 'text-[#636E72] hover:text-[#2D3436]'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="shoothub-calendar p-2 sm:p-3">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              initialDate="2024-05-14"
              headerToolbar={false}
              height="auto"
              expandRows
              stickyHeaderDates
              nowIndicator
              editable
              selectable
              selectMirror
              dayMaxEvents={3}
              weekends
              events={calendarEvents}
              slotMinTime="09:00:00"
              slotMaxTime="19:00:00"
              slotDuration="01:00:00"
              allDaySlot={false}
              eventContent={renderEventContent}
              eventClick={onEventClick}
              datesSet={onDatesSet}
              eventClassNames="fc-sh-event-host"
              dayHeaderClassNames="fc-sh-day-header"
              slotLabelFormat={{
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: true,
                meridiem: 'short',
              }}
              dayHeaderFormat={{ weekday: 'short', day: 'numeric', omitCommas: true }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
