import { useState, useEffect } from 'react';
import { Target, Users, MapPin, CheckCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import { t } from '../../i18n/index.js';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { governmentService } from '../../services/governmentService.js';
import { DEMO_IMPACT } from '../../utils/demoData.js';

export default function ImpactPage({ title = 'Impact Dashboard' }) {
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await governmentService.getImpact();
      setImpact(data.impact || data);
      setIsDemo(false);
    } catch (err) {
      setImpact(DEMO_IMPACT);
      setIsDemo(true);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <LoadingSpinner className="py-16" />;
  if (!impact) return <ErrorState message="Unable to load impact data." onRetry={fetchData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-1">Measurable outcomes from societal innovation initiatives across Jharkhand.</p>
        {isDemo && <Badge color="accent" className="mt-2">{t('common.demoData')}</Badge>}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Beneficiaries" value={impact.totalBeneficiaries?.toLocaleString()} icon={Users} />
        <StatCard label="Villages Reached" value={impact.villagesReached} icon={MapPin} />
        <StatCard label="Projects Completed" value={impact.projectsCompleted} icon={CheckCircle} />
        <StatCard label="Districts Covered" value={impact.districtsCovered} icon={Target} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Impact by Category">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={impact.categoryBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="beneficiaries" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Monthly Progress">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={impact.monthlyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="beneficiaries" stroke="#e67e22" strokeWidth={2} />
              <Line type="monotone" dataKey="projects" stroke="#1e3a5f" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {error && !isDemo && (
        <div className="mt-6">
          <ErrorState message={error} onRetry={fetchData} />
        </div>
      )}
    </div>
  );
}
