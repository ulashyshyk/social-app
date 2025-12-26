'use client';

import { useState } from 'react';
import type { AuthResponse } from '../../../../packages/shared-types/src/api.types'; // <-- path sende farklı olabilir

export default function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const [identifier, setIdentifier] = useState(''); // email OR username
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }), // backend buna göre
      });

      const data = (await res.json()) as any;

      if (!res.ok) {
        throw new Error(data?.message || 'Login failed');
      }

      const auth = data as AuthResponse; // ✅ artık shared-types kullanıyoruz

      console.log('ACCESS TOKEN:', auth.accessToken);
      console.log('REFRESH TOKEN:', auth.refreshToken);
      console.log('USER:', auth.user);

      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
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
          placeholder='email@example.com or username'
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
        disabled={loading}
        className='w-full bg-black text-white py-2 rounded disabled:opacity-50'
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

