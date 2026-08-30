import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Bell, Plus } from 'lucide-react';
import { t } from '../../i18n/index.js';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { challengeService } from '../../services/challengeService.js';
import { notificationService } from '../../services/notificationService.js';
import { DEMO_CHALLENGES, DEMO_NOTIFICATIONS } from '../../utils/demoData.js';

export default function CitizenDashboard() {
  const [challenges, setChallenges] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [ch, notif] = await Promise.all([
          challengeService.getMy(),
          notificationService.getAll(),
        ]);
        setChallenges((ch.challenges || ch).slice(0, 3));
        setNotifications((notif.notifications || notif).slice(0, 5));
      } catch {
        setChallenges(DEMO_CHALLENGES.slice(0, 2));
        setNotifications(DEMO_NOTIFICATIONS);
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner className="py-16" />;

  const stats = {
    total: challenges.length,
    inReview: challenges.filter((c) => c.status === 'in_review').length,
    active: challenges.filter((c) => ['matched', 'project_active'].includes(c.status)).length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Citizen Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your submitted challenges and notifications.</p>
          {isDemo && <Badge color="accent" className="mt-2">{t('common.demoData')}</Badge>}
        </div>
        <Link to="/citizen/challenges/new">
          <Button><Plus className="w-4 h-4" /> Report Challenge</Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="My Challenges" value={stats.total} icon={FileText} />
        <StatCard label="In Review" value={stats.inReview} />
        <StatCard label="Active Projects" value={stats.active} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Recent Challenges" action={
          <Link to="/citizen/challenges" className="text-sm text-primary-500 hover:text-primary-700">View all</Link>
        }>
          {challenges.length === 0 ? (
            <p className="text-sm text-gray-500">No challenges submitted yet.</p>
          ) : (
            <ul className="space-y-3">
              {challenges.map((c) => (
                <li key={c._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Link to={`/citizen/challenges/${c._id}`} className="text-sm font-medium text-primary-700 hover:text-primary-500">
                      {c.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">{c.district}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Notifications" action={<Bell className="w-4 h-4 text-gray-400" />}>
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications.</p>
          ) : (
            <ul className="space-y-3">
              {notifications.map((n) => (
                <li key={n._id} className={`text-sm p-3 rounded-lg ${n.read ? 'bg-gray-50 text-gray-600' : 'bg-primary-50 text-primary-800'}`}>
                  {n.message}
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
