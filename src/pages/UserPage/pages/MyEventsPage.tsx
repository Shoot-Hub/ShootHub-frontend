import { Calendar, Clock3, MapPin, UserRound } from 'lucide-react';

const myEvents = [
  {
    id: 'EVT-101',
    title: 'Riya & Kunal Wedding',
    date: '12 Dec 2026',
    time: '10:30 AM',
    venue: 'Jaipur Palace, Jaipur',
    creator: 'Harsh Sharma',
    status: 'Upcoming',
  },
  {
    id: 'EVT-089',
    title: 'Engagement Ceremony',
    date: '18 Oct 2026',
    time: '6:00 PM',
    venue: 'The Grand Oak, Delhi',
    creator: 'Aditi Films',
    status: 'Confirmed',
  },
  {
    id: 'EVT-074',
    title: 'Pre-Wedding Shoot',
    date: '02 Sep 2026',
    time: '4:00 PM',
    venue: 'Lodhi Garden, Delhi',
    creator: 'LensCraft Studio',
    status: 'Completed',
  },
];

export function MyEventsPage() {
  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-bold text-[#2D3436]">My Events</h2>
        <p className="mt-1 text-sm text-[#8B93A1]">
          Manage all your booked shoots and upcoming event schedules.
        </p>
      </div>

      <div className="grid gap-4">
        {myEvents.map((event) => (
          <article
            key={event.id}
            className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A0A4B0]">
                  {event.id}
                </p>
                <h3 className="mt-1 text-lg font-bold text-[#2D3436]">{event.title}</h3>
              </div>
              <span className="rounded-full bg-[#F3EEFF] px-3 py-1 text-xs font-bold text-[#6B46FE]">
                {event.status}
              </span>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-[#5B6472] sm:grid-cols-2 lg:grid-cols-4">
              <p className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#8A60FF]" />
                {event.date}
              </p>
              <p className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[#8A60FF]" />
                {event.time}
              </p>
              <p className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#8A60FF]" />
                {event.venue}
              </p>
              <p className="inline-flex items-center gap-2">
                <UserRound className="h-4 w-4 text-[#8A60FF]" />
                {event.creator}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
