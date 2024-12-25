```typescript
import React from 'react';
import { useRateCards } from '../../../hooks/admin/useRateCards';
import { RateCardForm } from './RateCardForm';
import { PricingTable } from './PricingTable';
import { Plus, Edit2, Archive } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function RateCardList() {
  const { rateCards, loading, createRateCard, updateRateCard, archiveRateCard } = useRateCards();
  const [editingCard, setEditingCard] = React.useState<string | null>(null);
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
        <h2 className="text-lg font-medium text-gray-900">Rate Cards</h2>
        <button
          onClick={() => setShowForm(true)}
          className={cn(
            "inline-flex items-center px-4 py-2 border border-transparent",
            "rounded-md shadow-sm text-sm font-medium text-white",
            "bg-indigo-600 hover:bg-indigo-700"
          )}
        >
          <Plus className="h-5 w-5 mr-2" />
          New Rate Card
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {rateCards.map((card) => (
            <div key={card.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{card.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{card.description}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Valid from: {new Date(card.validFrom).toLocaleDateString()}
                    {card.validUntil && ` to ${new Date(card.validUntil).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingCard(card.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => archiveRateCard(card.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Archive className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {editingCard === card.id ? (
                <RateCardForm
                  rateCard={card}
                  onSubmit={async (data) => {
                    await updateRateCard(card.id, data);
                    setEditingCard(null);
                  }}
                  onCancel={() => setEditingCard(null)}
                />
              ) : (
                <PricingTable items={card.items} />
              )}
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <RateCardForm
          onSubmit={async (data) => {
            await createRateCard(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
```