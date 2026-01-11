// apps/web/components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
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
        <label className="font-body text-xs text-gray-600 block mb-2">
          Email or username <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className={`font-body w-full px-4 py-3 rounded-full border-2 bg-gray-50 
            transition-colors focus:outline-none focus:bg-white
            ${error 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-200 focus:border-blue-500'
            }`}
          required
          placeholder="Email or username"
          disabled={isLoading}
        />
      </div>

      {/* Password Input */}
      <div>
        <label className="font-body text-xs text-gray-600 block mb-2">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`font-body w-full px-4 py-3 rounded-full border-2 bg-gray-50 
              transition-colors focus:outline-none focus:bg-white pr-12
              ${error 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-blue-500'
              }`}
            required
            placeholder="Password"
            disabled={isLoading}
          />
          {/* Toggle Password Visibility */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm font-body bg-red-50 px-4 py-2 rounded-lg">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Forgot Password Link */}
      <div className="text-left">
        <button
          type="button"
          className="font-body text-sm text-blue-600 hover:underline"
          onClick={() => {/* Add forgot password logic */}}
        >
          Forgot password?
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !identifier || !password}
        className="font-heading font-medium w-full bg-gradient-to-r from-blue-600 to-blue-700 
          text-white py-3 rounded-full hover:from-blue-700 hover:to-blue-800 
          disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg 
          hover:shadow-xl disabled:hover:shadow-lg"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Logging in...
          </span>
        ) : (
          'Log In'
        )}
      </button>
    </form>
  );
}
