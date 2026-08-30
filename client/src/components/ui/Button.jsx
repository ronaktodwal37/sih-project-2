const variants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 border border-primary-500',
  secondary: 'bg-white text-primary-500 hover:bg-primary-50 border border-primary-500',
  accent: 'bg-accent-500 text-white hover:bg-accent-600 border border-accent-500',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 border border-danger-500',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent',
  outline: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
