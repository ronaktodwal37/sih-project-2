import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, FolderKanban, Clock, CheckCircle } from 'lucide-react';
import { t } from '../../i18n/index.js';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { governmentService } from '../../services/governmentService.js';
import { DEMO_GOVERNMENT_STATS, DEMO_CHALLENGES } from '../../utils/demoData.js';

export default function GovernmentDashboard() {
  const [stats, setStats] = useState(null);
  const [recentChallenges, setRecentChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await governmentService.getDashboard();
        setStats(data.stats || data);
        setRecentChallenges((data.recentChallenges || []).slice(0, 5));
      } catch {
        setStats(DEMO_GOVERNMENT_STATS);
        setRecentChallenges(DEMO_CHALLENGES.slice(0, 4));
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
        <h1 className="text-2xl font-bold text-gray-900">Government Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of societal challenges and innovation projects.</p>
        {isDemo && <Badge color="accent" className="mt-2">{t('common.demoData')}</Badge>}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Challenges" value={stats?.totalChallenges} icon={FileText} />
        <StatCard label="Pending Review" value={stats?.pendingReview} icon={Clock} />
        <StatCard label="Active Projects" value={stats?.activeProjects} icon={FolderKanban} />
        <StatCard label="Completed" value={stats?.completedProjects} icon={CheckCircle} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card title="Recent Challenges" className="lg:col-span-2">
          {recentChallenges.length === 0 ? (
            <p className="text-sm text-gray-500">No recent challenges.</p>
          ) : (
            <ul className="space-y-3">
              {recentChallenges.map((c) => (
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

        <Card title="Quick Actions">
          <div className="space-y-2">
            <Link to="/government/analytics"><Button variant="secondary" className="w-full">View Analytics</Button></Link>
            <Link to="/government/map"><Button variant="outline" className="w-full">District Map</Button></Link>
            <Link to="/impact"><Button variant="outline" className="w-full">Impact Report</Button></Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
