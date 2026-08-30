import { useState, useEffect, useMemo } from 'react';
import { t } from '../../i18n/index.js';
import Badge from '../../components/ui/Badge.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import ChallengeCard from '../../components/challenges/ChallengeCard.jsx';
import ChallengeFilters from '../../components/challenges/ChallengeFilters.jsx';
import { challengeService } from '../../services/challengeService.js';
import { DEMO_CHALLENGES } from '../../utils/demoData.js';

const PAGE_SIZE = 6;

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: '', category: '', district: '', status: '' });

  const fetchChallenges = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await challengeService.getAll(filters);
      setChallenges(data.challenges || data);
      setIsDemo(false);
    } catch (err) {
      setChallenges(DEMO_CHALLENGES);
      setIsDemo(true);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChallenges(); }, []);

  const filtered = useMemo(() => {
    return challenges.filter((c) => {
      if (filters.search && !c.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.category && c.category !== filters.category) return false;
      if (filters.district && c.district !== filters.district) return false;
      if (filters.status && c.status !== filters.status) return false;
      return true;
    });
  }, [challenges, filters]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Societal Challenges</h1>
        <p className="text-gray-600 mt-1">Explore validated challenges from communities across Jharkhand.</p>
        {isDemo && <Badge color="accent" className="mt-2">{t('common.demoData')}</Badge>}
      </div>

      <ChallengeFilters
        filters={filters}
        onChange={(f) => { setFilters(f); setPage(1); }}
        onReset={() => { setFilters({ search: '', category: '', district: '', status: '' }); setPage(1); }}
      />

      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : error && !isDemo ? (
        <ErrorState message={error} onRetry={fetchChallenges} />
      ) : paginated.length === 0 ? (
        <EmptyState title="No challenges found" message="Try adjusting your filters." />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {paginated.map((c) => (
              <ChallengeCard key={c._id} challenge={c} showDemo={isDemo} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-8" />
        </>
      )}
    </div>
  );
}
