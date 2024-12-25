import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Music, Image, Film, BookText } from 'lucide-react';
import { cn } from '../../../lib/utils';

const categories = [
  { id: 'music', label: 'Background Music', icon: Music },
  { id: 'cover', label: 'Cover Images', icon: Image },
  { id: 'scenery', label: 'Scenery Videos', icon: Film },
  { id: 'verse', label: 'Closing Verses', icon: BookText },
];

export function AssetCategories() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = React.useState(categories[0].id);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    navigate(`?category=${categoryId}`);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={cn(
              "flex flex-col items-center p-4 rounded-lg transition-colors",
              selectedCategory === category.id
                ? "bg-indigo-50 text-indigo-700"
                : "hover:bg-gray-50"
            )}
          >
            <category.icon className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}