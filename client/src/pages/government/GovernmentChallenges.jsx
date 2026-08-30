import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { t } from '../../i18n/index.js';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import PriorityBadge from '../../components/ui/PriorityBadge.jsx';
import { governmentService } from '../../services/governmentService.js';
import { challengeService } from '../../services/challengeService.js';

export default function GovernmentChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('under_review');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await governmentService.getChallenges({ status: filter });
        setChallenges(data.data || data.challenges || []);
      } catch {
        const fallback = await challengeService.getAll({ status: filter });
        setChallenges(fallback.data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filter]);

  const handleValidate = async (id, isValid) => {
    try {
      await challengeService.validate(id, { isValid, notes: isValid ? 'Validated by government officer' : 'Rejected' });
      setChallenges((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message || 'Validation failed');
    }
  };

  if (loading) return <LoadingSpinner className="py-16" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Challenge Validation</h1>
      <p className="text-gray-600 mb-6">Review and validate citizen-submitted challenges.</p>

      <div className="flex gap-2 mb-6">
        {['under_review', 'submitted', 'validated', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setLoading(true); }}
            className={`px-3 py-1.5 rounded text-sm border capitalize ${
              filter === s ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {challenges.length === 0 ? (
        <Card><p className="text-gray-500 text-sm">No challenges in this status.</p></Card>
      ) : (
        <div className="space-y-4">
          {challenges.map((c) => (
            <Card key={c._id}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{c.title}</h3>
                    <StatusBadge status={c.status} />
                    {c.priorityLabel && <PriorityBadge level={c.priorityLabel} score={c.priorityScore} />}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{c.description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {c.location?.district} · {c.category} · {c.submittedBy?.name || 'Citizen'}
                  </p>
                  {c.aiAnalysis?.summary && (
                    <p className="text-xs text-primary-600 mt-2 bg-primary-50 p-2 rounded">
                      AI Summary: {c.aiAnalysis.summary}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link to={`/challenges/${c._id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                  {(c.status === 'submitted' || c.status === 'under_review') && (
                    <>
                      <Button size="sm" onClick={() => handleValidate(c._id, true)}>Validate</Button>
                      <Button variant="danger" size="sm" onClick={() => handleValidate(c._id, false)}>Reject</Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-4">* Some data may be {t('common.demoData').toLowerCase()}</p>
    </div>
  );
}
