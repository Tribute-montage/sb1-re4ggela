import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, Users, Settings, FileText, BarChart } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { 
      label: 'New Order', 
      icon: Plus, 
      onClick: () => navigate('/admin/orders/new'),
      color: 'bg-green-600',
      description: 'Create a new order'
    },
    { 
      label: 'Upload Assets', 
      icon: Upload, 
      onClick: () => navigate('/admin/assets/upload'),
      color: 'bg-blue-600',
      description: 'Upload new media assets'
    },
    { 
      label: 'Manage Users', 
      icon: Users, 
      onClick: () => navigate('/admin/users'),
      color: 'bg-purple-600',
      description: 'View and manage users'
    },
    { 
      label: 'Analytics', 
      icon: BarChart, 
      onClick: () => navigate('/admin/analytics'),
      color: 'bg-yellow-600',
      description: 'View business analytics'
    },
    { 
      label: 'Orders', 
      icon: FileText, 
      onClick: () => navigate('/admin/orders'),
      color: 'bg-indigo-600',
      description: 'Manage all orders'
    },
    { 
      label: 'Settings', 
      icon: Settings, 
      onClick: () => navigate('/admin/settings'),
      color: 'bg-gray-600',
      description: 'System settings'
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={cn(action.color, "p-3 rounded-lg text-white mb-3")}>
              <action.icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-gray-900">{action.label}</span>
            <span className="text-xs text-gray-500 text-center mt-1">{action.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}