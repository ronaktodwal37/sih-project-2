import { NavLink, Outlet } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/layout/Header.jsx';

export default function DashboardLayout({ sidebarLinks }) {
  // const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-32">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Dashboard</p>
            <p className="text-sm font-medium text-gray-900 mb-4 capitalize">{user?.role} Portal</p>
            <nav className="space-y-1">
              {sidebarLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded text-sm transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
