export default function ProgressBar({ value = 0, max = 100, label, showValue = true, className = '', color = 'primary' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const colors = {
    primary: 'bg-primary-500',
    accent: 'bg-accent-500',
    success: 'bg-success-500',
  };

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between text-sm mb-1">
          {label && <span className="text-gray-600">{label}</span>}
          {showValue && <span className="text-gray-500 font-medium">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`h-full rounded-full transition-all duration-300 ${colors[color] || colors.primary}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
