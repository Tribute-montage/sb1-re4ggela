import React from 'react';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Order } from '../../types/order';
import { cn } from '../../lib/utils';

interface OrderCategoriesProps {
  orders: Order[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function OrderCategories({ orders, selectedCategory, onSelectCategory }: OrderCategoriesProps) {
  const categories = [
    {
      id: 'active',
      name: 'Active',
      icon: Clock,
      count: orders.filter(o => ['pending', 'in-progress'].includes(o.status)).length,
    },
    {
      id: 'completed',
      name: 'Completed',
      icon: CheckCircle,
      count: orders.filter(o => o.status === 'completed').length,
    },
    {
      id: 'attention',
      name: 'Need Attention',
      icon: AlertTriangle,
      count: orders.filter(o => o.status === 'review').length,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            "relative rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow",
            "flex items-center space-x-4",
            selectedCategory === category.id && "ring-2 ring-indigo-500"
          )}
        >
          <div className="flex-shrink-0">
            <category.icon className={cn(
              "h-6 w-6",
              selectedCategory === category.id ? "text-indigo-600" : "text-gray-400"
            )} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {category.name}
            </p>
            <p className="text-sm text-gray-500">
              {category.count} orders
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}