import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, ShoppingCart, LogOut, Dumbbell, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children }) {
  const { adminLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', path: '/admin/users', icon: User },
  ];


  return (
    <div className="min-h-screen bg-surface-dim flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-outline-variant/30 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-outline-variant/30 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <Dumbbell size={24} />
          </div>
          <h1 className="text-h3 font-extrabold text-on-surface">JERAI<span className="text-primary text-sm align-top ml-1">Admin</span></h1>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-body-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface-variant hover:bg-surface hover:text-on-surface'
                }`
              }
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-outline-variant/30">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-body-sm font-medium text-error hover:bg-error/10 transition-colors w-full"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
