// apps/web/components/AuthModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isAuthModalOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Prevent scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore scroll
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
      {/* Backdrop - clicking closes modal */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-[2px]"
        onClick={closeAuthModal}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4 py-20 pointer-events-none">
        {/* Modal Content - re-enable pointer events */}
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative max-h-[calc(100vh-160px)] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Heading */}
          <h1 className="font-heading text-3xl font-bold text-center mb-4">
            {activeTab === 'login' ? 'Log In' : 'Sign Up'}
          </h1>

          {/* Legal Text */}
          <p className="font-body text-sm text-gray-600 text-center mb-6">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:underline">
              User Agreement
            </a>{' '}
            and acknowledge that you understand the{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>.
          </p>
          
          {/* Form Content */}
          {activeTab === 'login' ? (
            <>
              <LoginForm />
              
              {/* Switch to Sign Up */}
              <div className="mt-6 text-center">
                <p className="font-body text-sm text-gray-600">
                  New to our platform?{' '}
                  <button
                    onClick={() => setActiveTab('register')}
                    className="font-heading font-medium text-blue-600 hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <RegisterForm />
              
              {/* Switch to Log In */}
              <div className="mt-6 text-center">
                <p className="font-body text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => setActiveTab('login')}
                    className="font-heading font-medium text-blue-600 hover:underline"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
