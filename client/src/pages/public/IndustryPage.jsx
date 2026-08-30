import { useState, useEffect } from 'react';
import { Factory, MapPin, Handshake } from 'lucide-react';
import { t } from '../../i18n/index.js';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { industryService } from '../../services/industryService.js';
import { DEMO_INDUSTRY } from '../../utils/demoData.js';

export default function IndustryPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await industryService.getPartners();
      setPartners(data.partners || data);
      setIsDemo(false);
    } catch (err) {
      setPartners(DEMO_INDUSTRY);
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
        <h1 className="text-2xl font-bold text-gray-900">Industry & CSR Partners</h1>
        <p className="text-gray-600 mt-1">Corporate partners providing funding, mentorship, and technology support.</p>
        {isDemo && <Badge color="accent" className="mt-2">{t('common.demoData')}</Badge>}
      </div>

      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : error && !isDemo ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : partners.length === 0 ? (
        <EmptyState title="No industry partners found" />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {partners.map((p) => (
            <Card key={p._id}>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent-500/10 rounded-lg">
                  <Factory className="w-6 h-6 text-accent-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <Badge color="primary">{p.sector}</Badge>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {p.location}</span>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Handshake className="w-3.5 h-3.5" /> {p.contribution}
                  </p>
                  <p className="text-sm text-gray-500">{p.activeProjects} active projects</p>
                  {p.focus && (
                    <div className="flex flex-wrap gap-1">
                      {p.focus.map((f) => <Badge key={f} color="default">{f}</Badge>)}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
