// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useState } from 'react';
// import { useAuth } from '../../context/AuthContext.jsx';
// import { t } from '../../i18n/index.js';
// import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const { login, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      await login(data);
      const from = location.state?.from?.pathname;
      navigate(from || getDashboardPath(), { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Card title={t('auth.loginTitle')}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700" role="alert">
              {error}
            </div>
          )}
          <Input
            label={t('auth.email')}
            type="email"
            autoComplete="email"
            required
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label={t('auth.password')}
            type="password"
            autoComplete="current-password"
            required
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('common.loading') : t('auth.loginBtn')}
          </Button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-primary-500 hover:underline font-medium">
            {t('nav.register')}
          </Link>
        </p>
      </Card>
    </div>
  );
}
