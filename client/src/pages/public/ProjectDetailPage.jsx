import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Users, MapPin } from 'lucide-react';
import { t } from '../../i18n/index.js';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import ProgressBar from '../../components/ui/ProgressBar.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import { projectService } from '../../services/projectService.js';
import { DEMO_PROJECTS } from '../../utils/demoData.js';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await projectService.getById(id);
      setProject(data.project || data);
      setIsDemo(false);
    } catch (err) {
      setProject(DEMO_PROJECTS.find((p) => p._id === id) || DEMO_PROJECTS[0]);
      setIsDemo(true);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  if (loading) return <LoadingSpinner className="py-16" />;
  if (!project) return <ErrorState message="Project not found." />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </Link>

      {isDemo && <Badge color="accent" className="mb-4">{t('common.demoData')}</Badge>}

      <div className="flex flex-wrap items-center gap-2 mb-2">
        <StatusBadge status={project.status} />
        <Badge color="primary">{project.phase}</Badge>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{project.title}</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Progress" value={`${project.progress}%`} />
        <StatCard label="Team Size" value={project.teamSize} icon={Users} />
        <StatCard label="District" value={project.district} icon={MapPin} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Project Progress">
            <ProgressBar value={project.progress} label={project.phase} color="accent" />
          </Card>

          {project.impactMetrics && (
            <Card title="Impact Metrics">
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(project.impactMetrics).map(([key, val]) => (
                  <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-primary-500">{val.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card title="Partners">
            <dl className="space-y-3 text-sm">
              {project.challenge && (
                <div>
                  <dt className="text-gray-500">Challenge</dt>
                  <dd className="font-medium">{project.challenge.title}</dd>
                </div>
              )}
              {project.university && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <div>
                    <dt className="text-gray-500">University</dt>
                    <dd className="font-medium">{project.university.name}</dd>
                  </div>
                </div>
              )}
              {project.industry && (
                <div>
                  <dt className="text-gray-500">Industry Partner</dt>
                  <dd className="font-medium">{project.industry.name}</dd>
                </div>
              )}
              {project.startDate && (
                <div>
                  <dt className="text-gray-500">Start Date</dt>
                  <dd className="font-medium">{new Date(project.startDate).toLocaleDateString()}</dd>
                </div>
              )}
            </dl>
          </Card>

          {error && !isDemo && <ErrorState message={error} onRetry={fetchData} />}
        </div>
      </div>
    </div>
  );
}
