// apps/web/components/RegisterForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterForm() {
  const { checkEmail, register, isLoading } = useAuth();
  const [step, setStep] = useState<'email' | 'details'>('email');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPasswordValid = password.length >= 8;
  const isPasswordTouched = password.length > 0;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const exists = await checkEmail(email);
      if (exists) {
        setError('An account with this email already exists.');
      } else {
        setStep('details');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to verify email.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (username.length < 3) {
      setError('Username is too short.');
      return;
    }

    if (/\s/.test(username)) {
      setError('Username cannot contain spaces.');
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(username);
    if (!hasLetter) {
      setError('Username must contain at least one letter.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await register({ email, username, password });
    } catch (error: any) {
      setError(error.message || 'Registration failed.');
    }
  };

  return (
    <div>
      {/* Step 1: Email */}
      {step === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label className="font-body block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="your.email@example.com"
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm font-body bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="font-body w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Checking...' : 'Continue'}
          </button>
        </form>
      )}

      {/* Step 2: Username & Password */}
      {step === 'details' && (
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          {/* Show email (read-only) */}
          <div>
            <label className="font-body block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <div className="font-body w-full px-4 py-3 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              {email}
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="font-body block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username *
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`font-body w-full px-4 py-3 rounded-full border-2 
                bg-gray-50 dark:bg-gray-800
                text-gray-900 dark:text-white
                placeholder-gray-400 dark:placeholder-gray-500
                transition-colors focus:outline-none 
                focus:bg-white dark:focus:bg-gray-700
                ${error && (error.includes('Username') || error.includes('letter') || error.includes('spaces'))
                  ? 'border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400'
                  : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400'
                }`}
              required
              placeholder="Choose a username"
              disabled={isLoading}
              minLength={3}
            />
          </div>

          {/* Password with validation */}
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
                  transition-all focus:outline-none 
                  focus:bg-white dark:focus:bg-gray-700 pr-12
                  ${isPasswordTouched
                    ? isPasswordValid
                      ? 'border-green-500 focus:border-green-600 dark:border-green-400 dark:focus:border-green-500'
                      : 'border-red-500 focus:border-red-600 dark:border-red-400 dark:focus:border-red-500'
                    : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400'
                  }`}
                required
                placeholder="Create a password"
                disabled={isLoading}
                minLength={8}
              />

              {/* Toggle password visibility */}
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

            {/* Validation message */}
            <p className={`font-body text-xs mt-2 ${
              isPasswordTouched
                ? isPasswordValid
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {isPasswordTouched
                ? isPasswordValid
                  ? '✓ Password meets requirements'
                  : `✗ ${8 - password.length} more character${8 - password.length !== 1 ? 's' : ''} needed`
                : 'At least 8 characters'
              }
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="font-body block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`font-body w-full px-4 py-3 rounded-full border-2 
                  bg-gray-50 dark:bg-gray-800
                  text-gray-900 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  transition-colors focus:outline-none 
                  focus:bg-white dark:focus:bg-gray-700 pr-12
                  ${error && error.includes('match')
                    ? 'border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400'
                    : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400'
                  }`}
                required
                placeholder="Confirm your password"
                disabled={isLoading}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
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

          {/* Back Button */}
          <button
            type="button"
            onClick={() => setStep('email')}
            className="font-body text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline"
            disabled={isLoading}
          >
            ← Change email
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="font-body w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      )}
    </div>
  );
}
