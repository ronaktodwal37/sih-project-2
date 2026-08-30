export default function StatCard({ label, value, icon: Icon, trend, className = '' }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-primary-500 mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.positive ? 'text-success-500' : 'text-danger-500'}`}>
              {trend.positive ? '+' : ''}{trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2 bg-primary-50 rounded-lg">
            <Icon className="w-5 h-5 text-primary-500" />
          </div>
        )}
      </div>
    </div>
  );
}
