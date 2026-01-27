'use client';

import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import EditProfileForm from '../../../components/profile/EditProfileForm';
import Spinner from '../../../components/users/Spinner';

export default function EditProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !user) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Edit profile</h1>
        <EditProfileForm user={user} />
      </div>
    </div>
  );
}
