const statusStyles = {
  submitted: 'bg-gray-100 text-gray-700 border-gray-200',
  in_review: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  validated: 'bg-blue-50 text-blue-700 border-blue-200',
  matched: 'bg-purple-50 text-purple-700 border-purple-200',
  project_active: 'bg-green-50 text-green-700 border-green-200',
  resolved: 'bg-success-500/10 text-success-600 border-success-500/20',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  active: 'bg-green-50 text-green-700 border-green-200',
  pilot: 'bg-orange-50 text-orange-700 border-orange-200',
  completed: 'bg-primary-50 text-primary-700 border-primary-200',
  draft: 'bg-gray-100 text-gray-600 border-gray-200',
};

const statusLabels = {
  submitted: 'Submitted',
  in_review: 'In Review',
  validated: 'Validated',
  matched: 'Matched',
  project_active: 'Project Active',
  resolved: 'Resolved',
  rejected: 'Rejected',
  active: 'Active',
  pilot: 'Pilot',
  completed: 'Completed',
  draft: 'Draft',
};

export default function StatusBadge({ status, className = '' }) {
  const style = statusStyles[status] || statusStyles.submitted;
  const label = statusLabels[status] || status?.replace(/_/g, ' ');

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border capitalize ${style} ${className}`}>
      {label}
    </span>
  );
}
