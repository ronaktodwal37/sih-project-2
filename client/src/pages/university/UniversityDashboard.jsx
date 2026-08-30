import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FolderKanban, Users } from 'lucide-react';
import { t } from '../../i18n/index.js';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import ProgressBar from '../../components/ui/ProgressBar.jsx';
import { universityService } from '../../services/universityService.js';
import { DEMO_CHALLENGES, DEMO_PROJECTS } from '../../utils/demoData.js';

export default function UniversityDashboard() {
  const [challenges, setChallenges] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [ch, proj, st] = await Promise.all([
          universityService.getAssignedChallenges(),
          universityService.getProjects(),
          universityService.getStats(),
        ]);
        setChallenges((ch.challenges || ch).slice(0, 4));
        setProjects((proj.projects || proj).slice(0, 3));
        setStats(st.stats || st);
      } catch {
        setChallenges(DEMO_CHALLENGES.filter((c) => ['validated', 'matched'].includes(c.status)));
        setProjects(DEMO_PROJECTS);
        setStats({ activeProjects: 3, assignedChallenges: 5, teamMembers: 28 });
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner className="py-16" />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">University Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage assigned challenges and active projects.</p>
        {isDemo && <Badge color="accent" className="mt-2">{t('common.demoData')}</Badge>}
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Assigned Challenges" value={stats?.assignedChallenges ?? challenges.length} icon={BookOpen} />
        <StatCard label="Active Projects" value={stats?.activeProjects ?? projects.length} icon={FolderKanban} />
        <StatCard label="Team Members" value={stats?.teamMembers ?? 0} icon={Users} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Assigned Challenges">
          {challenges.length === 0 ? (
            <p className="text-sm text-gray-500">No assigned challenges.</p>
          ) : (
            <ul className="space-y-3">
              {challenges.map((c) => (
                <li key={c._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{c.title}</p>
                    <p className="text-xs text-gray-500">{c.district} · {c.category}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Active Projects">
          {projects.length === 0 ? (
            <p className="text-sm text-gray-500">No active projects.</p>
          ) : (
            <ul className="space-y-4">
              {projects.map((p) => (
                <li key={p._id}>
                  <div className="flex items-center justify-between mb-1">
                    <Link to={`/projects/${p._id}`} className="text-sm font-medium text-primary-700 hover:text-primary-500">
                      {p.title}
                    </Link>
                    <StatusBadge status={p.status} />
                  </div>
                  <ProgressBar value={p.progress} label={p.phase} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
