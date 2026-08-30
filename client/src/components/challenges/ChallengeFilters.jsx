import { Search } from 'lucide-react';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';
import { CHALLENGE_CATEGORIES, JHARKHAND_DISTRICTS } from '../../utils/constants.js';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_review', label: 'In Review' },
  { value: 'validated', label: 'Validated' },
  { value: 'matched', label: 'Matched' },
  { value: 'project_active', label: 'Project Active' },
  { value: 'resolved', label: 'Resolved' },
];

export default function ChallengeFilters({ filters, onChange, onReset }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          label="Search"
          placeholder="Search challenges..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
        />
        <Select
          label="Category"
          placeholder="All Categories"
          options={CHALLENGE_CATEGORIES}
          value={filters.category || ''}
          onChange={(e) => handleChange('category', e.target.value)}
        />
        <Select
          label="District"
          placeholder="All Districts"
          options={JHARKHAND_DISTRICTS}
          value={filters.district || ''}
          onChange={(e) => handleChange('district', e.target.value)}
        />
        <Select
          label="Status"
          options={STATUS_OPTIONS}
          value={filters.status || ''}
          onChange={(e) => handleChange('status', e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm">
          <Search className="w-4 h-4" /> Apply Filters
        </Button>
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
