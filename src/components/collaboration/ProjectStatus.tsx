import React from 'react';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ProjectStatusProps {
  status: 'pending' | 'in-progress' | 'review' | 'completed';
  progress: number;
  dueDate: string;
  assignedTo?: {
    name: string;
    role: 'editor' | 'admin';
  };
}

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  'in-progress': { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
  review: { icon: AlertTriangle, color: 'text-purple-500', bg: 'bg-purple-50' },
  completed: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
} as const;

export function ProjectStatus({ status, progress, dueDate, assignedTo }: ProjectStatusProps) {
  const { icon: Icon, color, bg } = statusConfig[status];

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <Icon className={cn("h-6 w-6 mr-2", color)} />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {status.replace('-', ' ').split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </h3>
            {assignedTo && (
              <p className="text-sm text-gray-500">
                Assigned to {assignedTo.name}
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Due Date</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date(dueDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium text-gray-900">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}