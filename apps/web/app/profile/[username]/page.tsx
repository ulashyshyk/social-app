"use client";

import { useAuth } from "../../../hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader from "../../../components/users/ProfileHeader";
import TopicGrid from "../../../components/users/TopicGrid";

export default function ProfilePage() {
  const { user, isLoading, requireAuth } = useAuth();
  const router = useRouter();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      requireAuth();
    }
  }, [user, isLoading, requireAuth]);

  const handleEditProfile = () => {
    router.push("/profile/edit");  // ✅ Fixed: matches your created route
  };

  const handleViewArchive = () => {
    router.push("/archive");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-600">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419]">
      <ProfileHeader
        user={user}
        topicsCount={0}
        onEditProfile={handleEditProfile}
        onViewArchive={handleViewArchive}
      />
      <div className="border-t border-gray-200 dark:border-gray-800" />
      <TopicGrid userId={user._id} />
    </div>
  );
}
