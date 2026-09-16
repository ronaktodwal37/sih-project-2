import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { t } from '../../i18n/index.js';
import { ROLES } from '../../utils/constants.js';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  role: z.enum(['citizen', 'university', 'faculty', 'student', 'industry']),
  district: z.string().optional(),
  organization: z.string().optional(),
});

const roleOptions = [
  { value: ROLES.CITIZEN, label: 'Citizen' },
  { value: ROLES.UNIVERSITY, label: 'University Representative' },
  { value: ROLES.FACULTY, label: 'Faculty' },
  { value: ROLES.STUDENT, label: 'Student' },
  { value: ROLES.INDUSTRY, label: 'Industry / CSR' },
];

export default function RegisterPage() {
  // const { register: registerUser, getDashboardPath } = useAuth();
  // const navigate = useNavigate();
  // const [error, setError] = useState('');

  // const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
  //   resolver: zodResolver(schema),
  //   defaultValues: { role: ROLES.CITIZEN },
  // });

  // const onSubmit = async (data) => {
  //   setError('');
  //   try {
  //     await registerUser(data);
  //     navigate(getDashboardPath(), { replace: true });
  //   } catch (err) {
  //     setError(err.message || 'Registration failed. Please try again.');
  //   }
  // };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Card title={t('auth.registerTitle')}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700" role="alert">
              {error}
            </div>
          )}
          <Input label={t('auth.name')} required error={errors.name?.message} {...register('name')} />
          <Input label={t('auth.email')} type="email" required error={errors.email?.message} {...register('email')} />
          <Input label={t('auth.password')} type="password" required error={errors.password?.message} {...register('password')} />
          <Select label={t('auth.role')} options={roleOptions} required error={errors.role?.message} {...register('role')} />
          <Input label="District (optional)" {...register('district')} />
          <Input label="Organization (optional)" {...register('organization')} />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('common.loading') : t('auth.registerBtn')}
          </Button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="text-primary-500 hover:underline font-medium">
            {t('nav.login')}
          </Link>
        </p>
      </Card>
    </div>
  );
}
