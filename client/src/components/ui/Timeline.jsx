import { CheckCircle, Circle } from 'lucide-react';

export default function Timeline({ items = [], className = '' }) {
  if (!items.length) return null;

  return (
    <ol className={`relative ${className}`}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        const isComplete = item.complete !== false;
        return (
          <li key={item.id || i} className="relative pl-8 pb-6 last:pb-0">
            {!isLast && (
              <span className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-200" aria-hidden="true" />
            )}
            <span className="absolute left-0 top-0.5">
              {isComplete ? (
                <CheckCircle className="w-6 h-6 text-success-500" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300" />
              )}
            </span>
            <div>
              <p className="text-xs text-gray-500">{item.date}</p>
              <h4 className="text-sm font-semibold text-gray-900 mt-0.5">{item.title}</h4>
              {item.description && (
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
