// apps/web/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, isAuthenticated, openAuthModal, logout, isLoading } = useAuth();

  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Auth Button */}
          {!isLoading && (
            <div>
                <button
                  onClick={openAuthModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Log In
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
