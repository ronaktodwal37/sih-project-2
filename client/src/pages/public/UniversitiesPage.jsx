import { useState, useEffect } from 'react';
import { MapPin, Users, BookOpen } from 'lucide-react';
import { t } from '../../i18n/index.js';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { universityService } from '../../services/universityService.js';
import { DEMO_UNIVERSITIES } from '../../utils/demoData.js';

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await universityService.getAll();
      setUniversities(data.universities || data);
      setIsDemo(false);
    } catch (err) {
      setUniversities(DEMO_UNIVERSITIES);
      setIsDemo(true);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Partner Universities</h1>
        <p className="text-gray-600 mt-1">Academic institutions collaborating on societal innovation projects.</p>
        {isDemo && <Badge color="accent" className="mt-2">{t('common.demoData')}</Badge>}
      </div>

      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : error && !isDemo ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : universities.length === 0 ? (
        <EmptyState title="No universities found" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {universities.map((uni) => (
            <Card key={uni._id}>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <BookOpen className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{uni.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" /> {uni.location}
                    </p>
                  </div>
                </div>
                <Badge color="primary">{uni.type}</Badge>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {uni.students?.toLocaleString()} students
                  </span>
                  <span>{uni.activeProjects} active projects</span>
                </div>
                {uni.specializations && (
                  <div className="flex flex-wrap gap-1">
                    {uni.specializations.map((s) => (
                      <Badge key={s} color="default">{s}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
