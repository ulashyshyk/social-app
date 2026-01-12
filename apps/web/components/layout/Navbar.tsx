// apps/web/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import SearchBar from '../search/SearchBar';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, isAuthenticated, openAuthModal, logout, isLoading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="bg-white dark:bg-[#1A1A1B] border-b border-gray-300 dark:border-[#343536] sticky top-0 z-30">
      <div className="max-w-full px-4">
        <div className="flex items-center justify-between h-12">
          {/* Left Section - Logo & Home */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-[#272729] rounded-md px-2 py-1">
              <div className="w-8 h-8 bg-[#FF4500] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl hidden sm:block text-gray-900 dark:text-white">YourApp</span>
            </Link>
          </div>

          {/* Center Section - Search Bar */}
          <SearchBar className="flex-1 max-w-2xl mx-4 hidden md:block" />

          {/* Right Section - Actions & User */}
          <div className="flex items-center gap-2">
            {!isLoading && !isAuthenticated ? (
              /* Logged Out State */
              <>
                <button className="hidden sm:flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#272729] rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ask
                </button>

                <button className="hidden sm:flex items-center px-4 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#272729] rounded-full border border-gray-300 dark:border-[#343536]">
                  Get App
                </button>

                <button
                  onClick={openAuthModal}
                  className="px-6 py-1.5 bg-[#FF4500] text-white text-sm font-bold rounded-full hover:bg-[#ff5414] transition-colors"
                >
                  Log In
                </button>

                <button className="p-1 hover:bg-gray-100 dark:hover:bg-[#272729] rounded-md">
                  <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </>
            ) : (
              /* Logged In State */
              <>
                {/* Chat Icon */}
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#272729] rounded-md relative">
                  <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>

                {/* Notifications Icon */}
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#272729] rounded-md relative">
                  <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>

                {/* Create Button */}
                <button className="hidden sm:flex items-center gap-1 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-[#272729] rounded-md text-gray-900 dark:text-gray-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-medium text-sm">Create</span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-[#272729] rounded-md"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-xs font-medium text-gray-900 dark:text-gray-200">{user?.username || 'User'}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1A1A1B] rounded-md shadow-lg border border-gray-200 dark:border-[#343536] py-1 z-50">
                      <Link
                        href={`/profile/${user?.username}`}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#272729]"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        Profile
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#272729]"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        Settings
                      </Link>

                      <hr className="my-1 border-gray-200 dark:border-[#343536]" />

                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#272729]"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-2">
        <SearchBar />
      </div>
    </nav>
  );
}
