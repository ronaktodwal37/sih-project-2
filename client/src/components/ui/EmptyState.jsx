import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data found', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Inbox className="w-12 h-12 text-gray-300 mb-3" aria-hidden="true" />
      <h3 className="text-base font-medium text-gray-700">{title}</h3>
      {message && <p className="text-sm text-gray-500 mt-1 max-w-sm">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
