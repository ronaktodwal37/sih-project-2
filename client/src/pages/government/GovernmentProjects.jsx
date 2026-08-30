import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { governmentService } from '../../services/governmentService.js';
import { projectService } from '../../services/projectService.js';

export default function GovernmentProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await governmentService.getProjects();
        setProjects(data.data || data.projects || []);
      } catch {
        const fallback = await projectService.getAll();
        setProjects(fallback.data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner className="py-16" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Government Projects</h1>
      {projects.length === 0 ? (
        <Card><p className="text-gray-500 text-sm">No projects found.</p></Card>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => (
            <Card key={p._id}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{p.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{p.description?.slice(0, 150)}...</p>
                  <div className="flex gap-2 mt-2">
                    <StatusBadge status={p.status} />
                    {p.universityId?.name && <span className="text-xs text-gray-500">{p.universityId.name}</span>}
                  </div>
                </div>
                <Link to={`/projects/${p._id}`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
