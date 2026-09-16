import { useState, useEffect } from 'react';
import { Users, FileText, FolderKanban, Activity } from 'lucide-react';
import { t } from '../../i18n/index.js';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import { DEMO_ADMIN_STATS } from '../../utils/demoData.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // const load = async () => {
    //   try {
    //     const res = await fetch('/api/admin/dashboard');
    //     if (!res.ok) throw new Error('Failed');
    //     const data = await res.json();
    //     setStats(data.stats || data);
    //   } catch {
    //     setStats(DEMO_ADMIN_STATS);
    //     setIsDemo(true);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // load();
  }, []);

  // if (loading) return <LoadingSpinner className="py-16" />;

  return (
    <div>
      <div className="mb-6">
        {/* <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1> */}
        {/* <p className="text-gray-600 mt-1">System overview and platform management.</p> */}
        {/* {isDemo && <Badge color="accent" className="mt-2">{t('common.demoData')}</Badge>} */}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* <StatCard label="Total Users" value={stats?.totalUsers} icon={Users} /> */}
        {/* <StatCard label="Total Challenges" value={stats?.totalChallenges} icon={FileText} /> */}
        {/* <StatCard label="Total Projects" value={stats?.totalProjects} icon={FolderKanban} /> */}
        {/* <StatCard label="Active Sessions" value="12" icon={Activity} /> */}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Users by Role">
          <ul className="space-y-2">
            {stats?.usersByRole?.map((r) => (
              <li key={r.role} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                {/* <span className="text-sm font-medium text-gray-700">{r.role}</span> */}
                {/* <span className="text-sm font-bold text-primary-500">{r.count}</span> */}
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Recent Activity">
          <ul className="space-y-3">
            {stats?.recentActivity?.map((a, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <div>
                  {/* <p className="font-medium text-gray-900">{a.action}</p> */}
                  {/* <p className="text-gray-500">{a.user}</p> */}
                </div>
                {/* <span className="text-xs text-gray-400">{a.time}</span> */}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
