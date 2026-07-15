import { CalendarCheck } from 'lucide-react';

export function BookingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
        <p className="text-sm text-gray-500">Manage your client bookings and schedule.</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-white p-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 mb-4">
          <CalendarCheck className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No bookings yet</h3>
        <p className="mt-1 text-sm text-gray-500">Your bookings will appear here.</p>
      </div>
    </div>
  );
}