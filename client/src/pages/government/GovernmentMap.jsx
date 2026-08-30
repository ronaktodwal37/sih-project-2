import { useState, useEffect } from 'react';
import { t } from '../../i18n/index.js';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import ChallengeMap from '../../components/Map/ChallengeMap.jsx';
import { governmentService } from '../../services/governmentService.js';
import { DEMO_CHALLENGES } from '../../utils/demoData.js';

export default function GovernmentMap() {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await governmentService.getMapData();
      const items = data.challenges || data.markers || data;
      setMarkers(items.map((c) => ({
        _id: c._id,
        lat: c.location?.lat || c.lat,
        lng: c.location?.lng || c.lng,
        title: c.title,
        district: c.district,
        status: c.status,
      })));
      setIsDemo(false);
    } catch (err) {
      setMarkers(DEMO_CHALLENGES.map((c) => ({
        _id: c._id,
        lat: c.location.lat,
        lng: c.location.lng,
        title: c.title,
        district: c.district,
        status: c.status,
      })));
      setIsDemo(true);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">District Challenge Map</h1>
        <p className="text-gray-600 mt-1">Geographic distribution of societal challenges across Jharkhand.</p>
        {isDemo && <Badge color="accent" className="mt-2">{t('common.demoData')}</Badge>}
      </div>

      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : (
        <Card>
          <ChallengeMap markers={markers} height="500px" zoom={7} />
          <p className="text-xs text-gray-400 mt-3 text-center">
            {markers.length} challenge{markers.length !== 1 ? 's' : ''} mapped
          </p>
        </Card>
      )}

      {error && !isDemo && (
        <div className="mt-4"><ErrorState message={error} onRetry={fetchData} /></div>
      )}
    </div>
  );
}
