import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Accessibility, Globe, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { t } from '../../i18n/index.js';
import Button from '../ui/Button.jsx';

const navLinks = [
  { to: '/', label: 'nav.home' },
  { to: '/challenges', label: 'nav.challenges' },
  { to: '/universities', label: 'nav.universities' },
  { to: '/industry', label: 'nav.industry' },
  { to: '/projects', label: 'nav.projects' },
  { to: '/impact', label: 'nav.impact' },
  { to: '/about', label: 'nav.about' },
];

export default function Header() {
  const { user, logout, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="bg-primary-500 text-white text-xs py-1">
        <div className="max-w-7xl mx-auto px-4 text-center sm:text-left">
          {t('portal.govt')}
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/emblem.svg" alt="Jharkhand Emblem" className="w-10 h-10" />
            <div>
              <h1 className="text-sm sm:text-base font-bold text-primary-500 leading-tight">
                {t('portal.name')}
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">{t('portal.department')}</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <button className="text-gray-600 hover:text-primary-500 p-1" aria-label="Accessibility">
              <Accessibility className="w-5 h-5" />
            </button>
            <button className="text-gray-600 hover:text-primary-500 p-1 flex items-center gap-1 text-sm" aria-label="Language">
              <Globe className="w-4 h-4" /> EN
            </button>
            {user ? (
              <>
                <Button variant="secondary" size="sm" onClick={() => navigate(getDashboardPath())}>
                  <User className="w-4 h-4" /> {t('nav.dashboard')}
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  {t('nav.login')}
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                  {t('nav.register')}
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <nav className="bg-primary-500 text-white hidden md:block" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="block px-4 py-2.5 text-sm hover:bg-primary-600 transition-colors"
                >
                  {t(link.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {mobileOpen && (
        <nav className="md:hidden bg-white border-b border-gray-200" aria-label="Mobile navigation">
          <ul className="px-4 py-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="block py-2.5 text-sm text-gray-700 border-b border-gray-100"
                  onClick={() => setMobileOpen(false)}
                >
                  {t(link.label)}
                </Link>
              </li>
            ))}
            <li className="py-3 flex gap-2">
              {user ? (
                <>
                  <Button size="sm" onClick={() => { navigate(getDashboardPath()); setMobileOpen(false); }}>
                    Dashboard
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => { navigate('/login'); setMobileOpen(false); }}>
                    Login
                  </Button>
                  <Button size="sm" onClick={() => { navigate('/register'); setMobileOpen(false); }}>
                    Register
                  </Button>
                </>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
