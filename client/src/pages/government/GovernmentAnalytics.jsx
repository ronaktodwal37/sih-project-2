import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { t } from '../../i18n/index.js';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { governmentService } from '../../services/governmentService.js';
import { DEMO_GOVERNMENT_STATS } from '../../utils/demoData.js';

const COLORS = ['#1e3a5f', '#e67e22', '#27ae60', '#3498db', '#9b59b6', '#95a5a6'];

export default function GovernmentAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await governmentService.getAnalytics();
      setAnalytics(data.analytics || data);
      setIsDemo(false);
    } catch (err) {
      setAnalytics(DEMO_GOVERNMENT_STATS);
      setIsDemo(true);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <LoadingSpinner className="py-16" />;
  if (!analytics) return <ErrorState message="Unable to load analytics." onRetry={fetchData} />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Government Analytics</h1>
        <p className="text-gray-600 mt-1">Data-driven insights on challenges and projects across districts.</p>
        {isDemo && <Badge color="accent" className="mt-2">{t('common.demoData')}</Badge>}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Challenges by District">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={analytics.byDistrict}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="district" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="challenges" fill="#1e3a5f" name="Challenges" radius={[4, 4, 0, 0]} />
              <Bar dataKey="projects" fill="#e67e22" name="Projects" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Challenges by Status">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={analytics.byStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ status, count }) => `${status}: ${count}`}
              >
                {analytics.byStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Challenges by Category" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.byCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={120} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#1e3a5f" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {error && !isDemo && (
        <div className="mt-6"><ErrorState message={error} onRetry={fetchData} /></div>
      )}
    </div>
  );
}
