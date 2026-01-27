"use client";

import { useState, useCallback } from "react";
import { useTopics } from "../hooks/useTopics";
import { Category } from "../../../packages/shared-types/src/topic.types";
import TopicCard from "../components/topics/TopicCard";
import CategoryTabs from "../components/topics/CategoryTabs";
import SearchBar from "../components/topics/SearchBar";
import Spinner from "../components/users/Spinner";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [category, setCategory] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useTopics({
    category: category === "all" ? undefined : category,
    search: search || undefined,
    page,
    limit: 20,
  });

  const handleCategoryChange = useCallback((newCategory: Category | "all") => {
    setCategory(newCategory);
    setPage(1);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
    setPage(1);
  }, []);

  if (isLoading && page === 1) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
          Failed to load topics. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Topics
        </h1>
        {isAuthenticated && (
          <Link
            href="/topics/create"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Create
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Category Tabs */}
      <div className="mb-6">
        <CategoryTabs selected={category} onChange={handleCategoryChange} />
      </div>

      {/* Topics List */}
      {data?.topics && data.topics.length > 0 ? (
        <>
          <div className="space-y-4 mb-6">
            {data.topics.map((topic) => (
              <TopicCard key={topic._id} topic={topic} />
            ))}
          </div>

          {/* Pagination */}
          {data.pagination && data.pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!data.pagination.hasPrevPage}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
              <span className="text-gray-700 dark:text-gray-300">
                Page {data.pagination.currentPage} of{" "}
                {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.pagination.hasNextPage}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No topics found. {isAuthenticated && "Be the first to create one!"}
          </p>
        </div>
      )}
    </div>
  );
}
