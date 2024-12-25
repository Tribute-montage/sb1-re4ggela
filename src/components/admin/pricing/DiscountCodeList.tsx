import React from 'react';
import { useDiscountCodes } from '../../../hooks/admin/useDiscountCodes';
import { DiscountCodeForm } from './DiscountCodeForm';
import { Plus, Edit2, Archive } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { formatCurrency } from '../../../lib/utils/format';

export function DiscountCodeList() {
  const { discountCodes, loading, createDiscountCode, updateDiscountCode } = useDiscountCodes();
  const [editingCode, setEditingCode] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-200 rounded" />
      <div className="h-64 bg-gray-100 rounded" />
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Discount Codes</h2>
        <button
          onClick={() => setShowForm(true)}
          className={cn(
            "inline-flex items-center px-4 py-2 border border-transparent",
            "rounded-md shadow-sm text-sm font-medium text-white",
            "bg-indigo-600 hover:bg-indigo-700"
          )}
        >
          <Plus className="h-5 w-5 mr-2" />
          New Discount Code
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valid Until
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {discountCodes.map((code) => (
              <tr key={code.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {code.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {code.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {code.discountType === 'percentage' 
                    ? `${code.discountValue}%`
                    : formatCurrency(code.discountValue)
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {code.usedCount} / {code.usageLimit || '∞'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {code.validUntil 
                    ? new Date(code.validUntil).toLocaleDateString()
                    : 'No expiry'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                    code.active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  )}>
                    {code.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingCode(code.id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showForm || editingCode) && (
        <DiscountCodeForm
          code={editingCode ? discountCodes.find(c => c.id === editingCode) : undefined}
          onSubmit={async (data) => {
            if (editingCode) {
              await updateDiscountCode(editingCode, data);
            } else {
              await createDiscountCode(data);
            }
            setShowForm(false);
            setEditingCode(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingCode(null);
          }}
        />
      )}
    </div>
  );
}