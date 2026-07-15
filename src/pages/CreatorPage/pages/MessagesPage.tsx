import { MessageSquare } from 'lucide-react';

export function MessagesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
        <p className="text-sm text-gray-500">Chat with your clients and manage inquiries.</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-white p-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 mb-4">
          <MessageSquare className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No messages yet</h3>
        <p className="mt-1 text-sm text-gray-500">Your messages will appear here.</p>
      </div>
    </div>
  );
}