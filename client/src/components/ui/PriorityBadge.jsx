import { getPriorityColor } from '../../utils/constants.js';

export default function PriorityBadge({ level, score }) {
  const colorClass = getPriorityColor(level);
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClass}`}>
      {level}{score != null ? ` (${score})` : ''}
    </span>
  );
}
