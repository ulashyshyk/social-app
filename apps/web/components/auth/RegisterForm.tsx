'use client'

import { useState, useContext } from 'react'
import {useAuth} from '../../hooks/useAuth'
export default function RegisterForm() {
  const {checkEmail,register} = useAuth()
  const [step, setStep] = useState<'email' | 'details'>('email')

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const exists = await checkEmail(email)
      
      if (exists) {
        setError('An account with this email already exists.')
      } else {
        setStep('details')
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await register({email,username,password,fullName})
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

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
            disabled={loading}
            className='w-full bg-black text-white py-2 rounded disabled:opacity-50'
          >
            {loading ? 'Checking...' : 'Continue'}
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

          {/* <div>
            <label className='block text-sm font-medium'>
              Full Name <span className='text-gray-400'>(optional)</span>
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className='w-full border px-3 py-2 rounded'
            />
          </div> */}

          {error && <p className='text-red-500 text-sm'>{error}</p>}

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-black text-white py-2 rounded disabled:opacity-50'
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      )}
    </div>
  )
}
