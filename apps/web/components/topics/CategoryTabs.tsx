"use client";

import { TOPIC_CATEGORIES, Category } from "../../../../packages/shared-types/src/topic.types";

interface CategoryTabsProps {
  selected?: Category | "all";
  onChange: (category: Category | "all") => void;
}

export default function CategoryTabs({ selected = "all", onChange }: CategoryTabsProps) {
  const categories = ["all", ...TOPIC_CATEGORIES] as const;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category as Category | "all")}
          className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
            selected === category
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {category === "all" ? "All" : category}
        </button>
      ))}
    </div>
  );
}
