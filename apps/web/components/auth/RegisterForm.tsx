'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterForm() {
  const { checkEmail, register, isLoading } = useAuth();
  
  const [step, setStep] = useState<'email' | 'details'>('email');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const exists = await checkEmail(email);
      
      if (exists) {
        setError('An account with this email already exists.');
      } else {
        setStep('details');
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await register({ email, username, password });
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      {step === 'email' && (
        <form onSubmit={handleEmailSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full border px-3 py-2 rounded'
              required
            />
          </div>

          {error && <p className='text-red-500 text-sm'>{error}</p>}

          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-black text-white py-2 rounded disabled:opacity-50'
          >
            {isLoading ? 'Checking...' : 'Continue'}
          </button>
        </form>
      )}
      
      {step === 'details' && (
        <form onSubmit={handleRegisterSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium'>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full border px-3 py-2 rounded'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full border px-3 py-2 rounded'
              required
            />
          </div>

          {error && <p className='text-red-500 text-sm'>{error}</p>}

          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-black text-white py-2 rounded disabled:opacity-50'
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      )}
    </div>
  );
}
