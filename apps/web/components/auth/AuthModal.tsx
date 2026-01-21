// apps/web/components/AuthModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (isAuthModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 backdrop-blur-sm"
        onClick={closeAuthModal}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 pointer-events-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Title */}
          <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {activeTab === 'login' ? 'Log In' : 'Sign Up'}
          </h2>

          {/* User Agreement Text */}
          <p className="font-body text-sm text-gray-600 dark:text-gray-400 mb-6">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
              User Agreement
            </a>{' '}
            and acknowledge that you understand the{' '}
            <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
              Privacy Policy
            </a>
            .
          </p>

          {/* Form Content */}
          {activeTab === 'login' ? (
            <>
              <LoginForm />
              <p className="font-body text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                New to our platform?{' '}
                <button
                  onClick={() => setActiveTab('register')}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Sign Up
                </button>
              </p>
            </>
          ) : (
            <>
              <RegisterForm />
              <p className="font-body text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                Already have an account?{' '}
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Log In
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
