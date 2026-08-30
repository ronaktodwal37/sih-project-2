import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { t } from '../../i18n/index.js';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ChallengeCard from '../../components/challenges/ChallengeCard.jsx';
import { challengeService } from '../../services/challengeService.js';
import { DEMO_CHALLENGES } from '../../utils/demoData.js';

export default function CitizenChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await challengeService.getMy();
      setChallenges(data.challenges || data);
      setIsDemo(false);
    } catch (err) {
      setChallenges(DEMO_CHALLENGES.slice(0, 3));
      setIsDemo(true);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Challenges</h1>
          {isDemo && <Badge color="accent" className="mt-2">{t('common.demoData')}</Badge>}
        </div>
        <Link to="/citizen/challenges/new">
          <Button><Plus className="w-4 h-4" /> Report New</Button>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : error && !isDemo ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : challenges.length === 0 ? (
        <EmptyState
          title="No challenges yet"
          message="Report a societal challenge from your community."
          action={<Link to="/citizen/challenges/new"><Button>Report Challenge</Button></Link>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {challenges.map((c) => (
            <ChallengeCard key={c._id} challenge={c} linkTo={`/citizen/challenges/${c._id}`} showDemo={isDemo} />
          ))}
        </div>
      )}
    </div>
  );
}
