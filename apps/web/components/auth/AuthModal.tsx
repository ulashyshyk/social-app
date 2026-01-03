// apps/web/components/AuthModal.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  if (!isAuthModalOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40"
        onClick={closeAuthModal}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Tab Content */}
          {activeTab === 'login' ? (
            <>
              <LoginForm/>
              
              {/* Sign up message */}
              <div className="mt-4 text-center text-sm text-gray-600">
                New to App?{' '}
                <button
                  onClick={() => setActiveTab('register')}
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  Sign up
                </button>
              </div>
            </>
          ) : (
            <>
            <RegisterForm />
                <div className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                        onClick={() => setActiveTab('login')}
                        className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                        Log In
                    </button>
                </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
