'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchAll } from '../../../../packages/api-client/src/search.api';
import type { Topic } from '../../../../packages/shared-types/src/topic.types';
import type { PublicUserProfile } from '../../../../packages/shared-types/src/user.types';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  isMobile?: boolean;
}

export default function SearchBar({ 
  className = '', 
  placeholder = 'Find anything',
  isMobile = false 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [users, setUsers] = useState<PublicUserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setTopics([]);
      setUsers([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    const debounce = setTimeout(async () => {
      try {
        const results = await searchAll({ q: query, limit: 5 });
        setTopics(results.topics);
        setUsers(results.users);
        setIsOpen(true);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const handleTopicClick = (topicId: string) => {
    router.push(`/topics/${topicId}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleUserClick = (username: string) => {
    router.push(`/profile/${username}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleSeeAllResults = () => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsOpen(false);
  };

  const hasResults = topics.length > 0 || users.length > 0;

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-[#343536] rounded-full bg-gray-50 dark:bg-[#272729] hover:bg-white dark:hover:bg-[#1A1A1B] hover:border-[#0079D3] dark:hover:border-[#D7DADC] focus:outline-none focus:ring-1 focus:ring-[#0079D3] focus:border-[#0079D3] focus:bg-white dark:focus:bg-[#1A1A1B] text-sm text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-500 transition-colors"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-[#1A1A1B] rounded-lg shadow-lg border border-gray-200 dark:border-[#343536] max-h-96 overflow-y-auto z-50">
          {loading && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Searching...
            </div>
          )}

          {!loading && !hasResults && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No results found
            </div>
          )}

          {!loading && hasResults && (
            <>
              {/* Topics Section */}
              {topics.length > 0 && (
                <div className="border-b border-gray-200 dark:border-[#343536]">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Topics
                  </div>
                  {topics.map((topic) => (
                    <button
                      key={topic._id}
                      onClick={() => handleTopicClick(topic._id)}
                      className="w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#272729] text-left transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">📄</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                            {topic.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {topic.category} · {topic.likesCount} likes · {topic.commentsCount} comments
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Users Section */}
              {users.length > 0 && (
                <div className="border-b border-gray-200 dark:border-[#343536]">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Users
                  </div>
                  {users.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => handleUserClick(user.username)}
                      className="w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#272729] text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.username}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user.username[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                            {user.username}
                          </div>
                          {user.fullName && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {user.fullName}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* See All Button */}
              {/* <button
                onClick={handleSeeAllResults}
                className="w-full px-4 py-3 text-sm font-medium text-[#0079D3] hover:bg-gray-100 dark:hover:bg-[#272729] transition-colors"
              >
                See all results for "{query}"
              </button> */}
            </>
          )}
        </div>
      )}
    </div>
  );
}
