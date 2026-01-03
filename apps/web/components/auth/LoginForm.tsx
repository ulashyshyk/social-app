'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login({ identifier, password });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium'>Email or Username</label>
        <input
          type='text'
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className='w-full border px-3 py-2 rounded'
          required
          placeholder='Email or username'
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
          placeholder='Password'
        />
      </div>

      {error && <p className='text-red-500 text-sm'>{error}</p>}

      <button
        type='submit'
        disabled={isLoading}
        className='w-full bg-black text-white py-2 rounded disabled:opacity-50'
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
