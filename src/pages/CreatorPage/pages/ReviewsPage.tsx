import { Star } from 'lucide-react';
import { useAuth } from '@/store';

export function ReviewsPage() {
  const { user } = useAuth();
  const rating = user?.rating;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
        <p className="text-sm text-gray-500">See what clients are saying about your work.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm text-center">
          <p className="text-4xl font-bold text-gray-900">{rating?.average?.toFixed(1) || '0.0'}</p>
          <div className="flex justify-center gap-0.5 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${star <= Math.round(rating?.average ?? 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
              />
            ))}
          </div>
          <p className="mt-1 text-sm text-gray-500">{rating?.totalReviews || 0} reviews</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm text-center md:col-span-2">
          <div className="flex flex-col items-center justify-center h-full">
            <Star className="h-10 w-10 text-gray-200 mb-2" />
            <p className="text-sm text-gray-500">Review details coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}