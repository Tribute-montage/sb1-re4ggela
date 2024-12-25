import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut } from 'lucide-react';
import { NotificationBell } from '../notifications/NotificationBell';
import { Logo } from '../common/Logo';
import { cn } from '../../lib/utils';
import { BRAND } from '../../lib/theme/colors';

export function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo size="md" />

          <nav className="flex items-center space-x-4">
            {user?.role === 'client' && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                <Link to="/orders" className="text-gray-600 hover:text-gray-900">My Orders</Link>
              </>
            )}
            
            {user?.role === 'editor' && (
              <>
                <Link to="/editor" className="text-gray-600 hover:text-gray-900">Editor Dashboard</Link>
                <Link to="/editor/orders" className="text-gray-600 hover:text-gray-900">Assigned Orders</Link>
              </>
            )}
            
            {user?.role === 'admin' && (
              <>
                <Link to="/admin" className="text-gray-600 hover:text-gray-900">Admin Dashboard</Link>
                <Link to="/admin/orders" className="text-gray-600 hover:text-gray-900">All Orders</Link>
              </>
            )}

            {user && (
              <>
                <NotificationBell />
                <button
                  onClick={logout}
                  style={{ backgroundColor: BRAND.blue }}
                  className={cn(
                    "flex items-center space-x-1 px-4 py-2 rounded-md",
                    "text-white hover:opacity-90",
                    "transition-colors duration-200"
                  )}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}