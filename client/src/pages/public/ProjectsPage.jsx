import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin } from 'lucide-react';
import { t } from '../../i18n/index.js';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import ProgressBar from '../../components/ui/ProgressBar.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { projectService } from '../../services/projectService.js';
import { DEMO_PROJECTS } from '../../utils/demoData.js';

const PAGE_SIZE = 6;

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await projectService.getAll();
      setProjects(data.projects || data);
      setIsDemo(false);
    } catch (err) {
      setProjects(DEMO_PROJECTS);
      setIsDemo(true);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const totalPages = Math.ceil(projects.length / PAGE_SIZE);
  const paginated = projects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Innovation Projects</h1>
        <p className="text-gray-600 mt-1">Active and completed projects addressing societal challenges.</p>
        {isDemo && <Badge color="accent" className="mt-2">{t('common.demoData')}</Badge>}
      </div>

      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : error && !isDemo ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : paginated.length === 0 ? (
        <EmptyState title="No projects found" />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((p) => (
              <Card key={p._id}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/projects/${p._id}`} className="font-semibold text-primary-700 hover:text-primary-500">
                      {p.title}
                    </Link>
                    <StatusBadge status={p.status} />
                  </div>
                  {p.challenge && (
                    <p className="text-sm text-gray-500">Challenge: {p.challenge.title}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-3.5 h-3.5" />
                    {p.university?.name}
                    {p.industry && ` · ${p.industry.name}`}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {p.district}
                  </p>
                  <ProgressBar value={p.progress} label={p.phase} color="accent" />
                </div>
              </Card>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-8" />
        </>
      )}
    </div>
  );
}
