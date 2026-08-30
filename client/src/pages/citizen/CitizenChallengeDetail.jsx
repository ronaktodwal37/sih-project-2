import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { t } from '../../i18n/index.js';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import PriorityBadge from '../../components/ui/PriorityBadge.jsx';
import Timeline from '../../components/ui/Timeline.jsx';
import ChallengeMap from '../../components/Map/ChallengeMap.jsx';
import { challengeService } from '../../services/challengeService.js';
import { DEMO_CHALLENGES, DEMO_TIMELINE } from '../../utils/demoData.js';

export default function CitizenChallengeDetail() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [ch, tl] = await Promise.all([
          challengeService.getById(id),
          challengeService.getTimeline(id).catch(() => ({ timeline: DEMO_TIMELINE })),
        ]);
        setChallenge(ch.challenge || ch);
        setTimeline(tl.timeline || tl);
      } catch {
        setChallenge(DEMO_CHALLENGES.find((c) => c._id === id) || DEMO_CHALLENGES[0]);
        setTimeline(DEMO_TIMELINE);
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <LoadingSpinner className="py-16" />;
  if (!challenge) return <ErrorState message="Challenge not found." />;

  return (
    <div>
      <Link to="/citizen/challenges" className="inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to My Challenges
      </Link>

      {isDemo && <Badge color="accent" className="mb-4">{t('common.demoData')}</Badge>}

      <div className="flex flex-wrap items-center gap-2 mb-2">
        <StatusBadge status={challenge.status} />
        {challenge.priority && <PriorityBadge level={challenge.priority} score={challenge.priorityScore} />}
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{challenge.title}</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <p className="text-gray-600 leading-relaxed">{challenge.description}</p>
          </Card>

          {challenge.location && (
            <Card title="Location">
              <ChallengeMap
                center={[challenge.location.lat, challenge.location.lng]}
                selectedLocation={challenge.location}
                zoom={12}
                height="280px"
              />
            </Card>
          )}

          <Card title="Status Timeline">
            <Timeline items={timeline} />
          </Card>
        </div>

        <Card title="Challenge Info">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Category</dt><dd className="font-medium">{challenge.category}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">District</dt><dd className="font-medium">{challenge.district}</dd></div>
            {challenge.affectedPopulation && (
              <div className="flex justify-between"><dt className="text-gray-500">Affected</dt><dd className="font-medium">{challenge.affectedPopulation.toLocaleString()}</dd></div>
            )}
          </dl>
        </Card>
      </div>
    </div>
  );
}
