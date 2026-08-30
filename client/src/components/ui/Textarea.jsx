export default function Textarea({ label, error, id, className = '', required, rows = 4, ...props }) {
  const textareaId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-danger-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`w-full px-3 py-2 border rounded text-sm transition-colors resize-y focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
          error ? 'border-danger-500' : 'border-gray-300'
        } ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} className="mt-1 text-sm text-danger-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
