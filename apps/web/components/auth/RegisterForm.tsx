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

  // Password validation state
  const isPasswordValid = password.length >= 8;
  const isPasswordTouched = password.length > 0;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic email validation
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

    // Username validation
    if (username.length < 3) {
      setError('Username is too short.');
      return;
    }

    // Check if username contains whitespace
    if (/\s/.test(username)) {
      setError('Username cannot contain spaces.');
      return;
    }

    // Check if username contains at least one letter
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
            <label className="font-body text-xs text-gray-600 block mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`font-body w-full px-4 py-3 rounded-full border-2 bg-gray-50 
                transition-colors focus:outline-none focus:bg-white
                ${error 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-200 focus:border-blue-500'
                }`}
              required
              placeholder="your.email@example.com"
              disabled={isLoading}
            />
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

          <button
            type="submit"
            disabled={isLoading || !email}
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
                Checking...
              </span>
            ) : (
              'Continue'
            )}
          </button>
        </form>
      )}
      
      {/* Step 2: Username & Password */}
      {step === 'details' && (
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          {/* Show email (read-only) */}
          <div>
            <label className="font-body text-xs text-gray-600 block mb-2">
              Email
            </label>
            <div className="font-body w-full px-4 py-3 rounded-full border-2 border-gray-200 bg-gray-100 text-gray-600">
              {email}
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="font-body text-xs text-gray-600 block mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`font-body w-full px-4 py-3 rounded-full border-2 bg-gray-50 
                transition-colors focus:outline-none focus:bg-white
                ${error && (error.includes('Username') || error.includes('letter') || error.includes('spaces'))
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-200 focus:border-blue-500'
                }`}
              required
              placeholder="Choose a username"
              disabled={isLoading}
              minLength={3}
            />
          </div>

          {/* Password with validation */}
          <div>
            <label className="font-body text-xs text-gray-600 block mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`font-body w-full px-4 py-3 rounded-full border-2 bg-gray-50 
                    transition-all focus:outline-none focus:bg-white pr-12
                    ${isPasswordTouched 
                      ? isPasswordValid 
                        ? 'border-green-500 focus:border-green-600' 
                        : 'border-red-500 focus:border-red-600'
                      : 'border-gray-200 focus:border-blue-500'
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
              {/* Validation icon - outside the input */}
              {isPasswordTouched && (
                <div className="flex-shrink-0">
                  {isPasswordValid ? (
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              )}
            </div>
            <p className={`font-body text-xs mt-1 ml-4 transition-colors ${
              isPasswordTouched 
                ? isPasswordValid 
                  ? 'text-green-600' 
                  : 'text-red-600'
                : 'text-gray-500'
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
            <label className="font-body text-xs text-gray-600 block mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`font-body w-full px-4 py-3 rounded-full border-2 bg-gray-50 
                  transition-colors focus:outline-none focus:bg-white pr-12
                  ${error && error.includes('match') 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500'
                  }`}
                required
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
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

          {/* Back Button */}
          <button
            type="button"
            onClick={() => setStep('email')}
            className="font-body text-sm text-gray-600 hover:text-gray-800 underline"
            disabled={isLoading}
          >
            ← Change email
          </button>

          <button
            type="submit"
            disabled={isLoading || !username || !password || !confirmPassword}
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
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
