import { Link } from 'react-router-dom';
import { MapPin, Users, ThumbsUp } from 'lucide-react';
import Card from '../ui/Card.jsx';
import StatusBadge from '../ui/StatusBadge.jsx';
import PriorityBadge from '../ui/PriorityBadge.jsx';
import Badge from '../ui/Badge.jsx';

export default function ChallengeCard({ challenge, linkTo, showDemo = false }) {
  const href = linkTo || `/challenges/${challenge._id}`;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Link to={href} className="text-base font-semibold text-primary-700 hover:text-primary-500 line-clamp-2">
            {challenge.title}
          </Link>
          <StatusBadge status={challenge.status} />
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{challenge.description}</p>

        <div className="flex flex-wrap items-center gap-2">
          <Badge color="primary">{challenge.category}</Badge>
          {challenge.priority && <PriorityBadge level={challenge.priority} score={challenge.priorityScore} />}
          {showDemo && <Badge color="accent">Demonstration Data</Badge>}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {challenge.district}
          </span>
          {challenge.affectedPopulation && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {challenge.affectedPopulation.toLocaleString()}
            </span>
          )}
          {challenge.upvotes != null && (
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5" /> {challenge.upvotes}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
