// apps/web/components/topics/CategoryFilter.tsx
'use client';

import { Category } from '../../../../packages/shared-types/src/topic.types';

interface CategoryFilterProps {
  activeCategory?: Category;
  onCategoryChange: (category: Category | undefined) => void;
}

const CATEGORIES: { value: Category | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'Education', label: '📚 Education' },
  { value: 'Tourism', label: '✈️ Tourism' },
  { value: 'Business', label: '💼 Business' },
  { value: 'Culture', label: '🎭 Culture' },
  { value: 'Sports', label: '⚽ Sports' },
  { value: 'Entertainment', label: '🎬 Entertainment' }
];

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {CATEGORIES.map(cat => (
        <button
          key={cat.label}
          onClick={() => onCategoryChange(cat.value)}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
            activeCategory === cat.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
