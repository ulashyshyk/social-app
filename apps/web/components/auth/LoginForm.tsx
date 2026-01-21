// apps/web/components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login({ identifier, password });
    } catch (err: any) {
      setError(err.message || 'Invalid username or password.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email/Username Input */}
      <div>
        <label className="font-body block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email or username *
        </label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className={`font-body w-full px-4 py-3 rounded-full border-2 
            bg-gray-50 dark:bg-gray-800 
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            transition-colors focus:outline-none 
            focus:bg-white dark:focus:bg-gray-700
            ${error
              ? 'border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400'
              : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400'
            }`}
          required
          placeholder="Email or username"
          disabled={isLoading}
        />
      </div>

      {/* Password Input */}
      <div>
        <label className="font-body block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Password *
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`font-body w-full px-4 py-3 rounded-full border-2 
              bg-gray-50 dark:bg-gray-800
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              transition-colors focus:outline-none 
              focus:bg-white dark:focus:bg-gray-700 pr-12
              ${error
                ? 'border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400'
                : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400'
              }`}
            required
            placeholder="Password"
            disabled={isLoading}
          />

          {/* Toggle Password Visibility */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            tabIndex={-1}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm font-body bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          {error}
        </div>
      )}

      {/* Forgot Password Link */}
      <div className="text-right">
        <button
          type="button"
          onClick={() => {/* Add forgot password logic */}}
          className="font-body text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Forgot password?
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="font-body w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
}
