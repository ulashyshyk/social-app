'use client';

import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const { user, updateProfile, isLoading, requireAuth } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Open auth modal if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      requireAuth(); // Opens modal without pending action
    }
  }, [user, isLoading, requireAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-600">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setFormData({
      fullName: user.fullName || '',
      bio: user.bio || ''
    });
    setEditing(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      await updateProfile(formData);
      setEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {!editing ? (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div>
            <p className="text-sm text-gray-600 mb-1">Username</p>
            <p className="text-lg font-medium">{user.username}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="text-lg">{user.email}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Full Name</p>
            <p className="text-lg">{user.fullName || 'Not set'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Bio</p>
            <p className="text-lg">{user.bio || 'No bio yet'}</p>
          </div>
          
          <button 
            onClick={handleEdit}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              maxLength={160}
              placeholder="Tell us about yourself (max 160 characters)"
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.bio.length}/160 characters
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              type="submit" 
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button"
              onClick={() => setEditing(false)}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
