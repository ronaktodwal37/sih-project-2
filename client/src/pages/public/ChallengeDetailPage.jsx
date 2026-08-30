import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, ThumbsUp, ArrowLeft } from 'lucide-react';
import { t } from '../../i18n/index.js';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import PriorityBadge from '../../components/ui/PriorityBadge.jsx';
import Timeline from '../../components/ui/Timeline.jsx';
import ChallengeMap from '../../components/Map/ChallengeMap.jsx';
import { challengeService } from '../../services/challengeService.js';
import { DEMO_CHALLENGES, DEMO_TIMELINE } from '../../utils/demoData.js';

export default function ChallengeDetailPage() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [ch, tl] = await Promise.all([
        challengeService.getById(id),
        challengeService.getTimeline(id).catch(() => ({ timeline: DEMO_TIMELINE })),
      ]);
      setChallenge(ch.challenge || ch.data || ch);
      setTimeline(tl.timeline || tl);
      setIsDemo(false);
    } catch (err) {
      const demo = DEMO_CHALLENGES.find((c) => c._id === id) || DEMO_CHALLENGES[0];
      setChallenge(demo);
      setTimeline(DEMO_TIMELINE);
      setIsDemo(true);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  if (loading) return <LoadingSpinner className="py-16" />;
  if (!challenge) return <ErrorState message="Challenge not found." />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/challenges" className="inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Challenges
      </Link>

      {isDemo && <Badge color="accent" className="mb-4">{t('common.demoData')}</Badge>}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <StatusBadge status={challenge.status} />
              <Badge color="primary">{challenge.category}</Badge>
              {challenge.priority && <PriorityBadge level={challenge.priority} score={challenge.priorityScore} />}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{challenge.title}</h1>
            <p className="text-gray-600 mt-3 leading-relaxed">{challenge.description}</p>
          </div>

          {challenge.location && (
            <Card title="Location">
              <ChallengeMap
                center={[challenge.location.lat, challenge.location.lng]}
                selectedLocation={challenge.location}
                zoom={12}
                height="300px"
              />
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {challenge.location.address || challenge.district}
              </p>
            </Card>
          )}

          <Card title="Progress Timeline">
            <Timeline items={timeline} />
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Details">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">District</dt>
                <dd className="font-medium">{challenge.district}</dd>
              </div>
              {challenge.affectedPopulation && (
                <div className="flex justify-between">
                  <dt className="text-gray-500 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Affected</dt>
                  <dd className="font-medium">{challenge.affectedPopulation.toLocaleString()}</dd>
                </div>
              )}
              {challenge.upvotes != null && (
                <div className="flex justify-between">
                  <dt className="text-gray-500 flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> Upvotes</dt>
                  <dd className="font-medium">{challenge.upvotes}</dd>
                </div>
              )}
              {challenge.submittedBy && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Submitted by</dt>
                  <dd className="font-medium">{challenge.submittedBy.name}</dd>
                </div>
              )}
            </dl>
          </Card>

          {error && !isDemo && (
            <ErrorState message={error} onRetry={fetchData} />
          )}

          <Link to="/register">
            <Button className="w-full">Report a Similar Challenge</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
