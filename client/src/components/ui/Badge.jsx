const colors = {
  default: 'bg-gray-100 text-gray-700 border-gray-200',
  primary: 'bg-primary-50 text-primary-700 border-primary-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  accent: 'bg-orange-50 text-orange-700 border-orange-200',
};

export default function Badge({ children, color = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}
