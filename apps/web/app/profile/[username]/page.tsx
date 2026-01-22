"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // ✅ useRouter ekle
import ProfileHeader from "../../../components/users/ProfileHeader";
import TopicGrid from "../../../components/users/TopicGrid";
import { userApi } from "../../../../../packages/api-client/src/user.api";
import {
  PublicUserProfile,
  AuthenticatedUser,
} from "../../../../../packages/shared-types/src/user.types";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter(); // ✅ router'ı ekle
  const username = params.username as string;

  const [profileUser, setProfileUser] = useState<
    PublicUserProfile | AuthenticatedUser | null
  >(null);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        let loggedInUser: AuthenticatedUser | null = null;
        try {
          loggedInUser = await userApi.getMe();
          setCurrentUser(loggedInUser);
        } catch {
          setCurrentUser(null);
        }

        const targetUser = await userApi.getUserByUsername(username);
        setProfileUser(targetUser);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profileUser) {
    return <div>User not found</div>;
  }

  const isOwnProfile = currentUser?.username === profileUser.username;
  const isLoggedIn = !!currentUser;
  const isFriend = false;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419]">
      <ProfileHeader
        user={profileUser}
        topicsCount={profileUser.topicsCount || 0}
        isOwnProfile={isOwnProfile}
        isLoggedIn={isLoggedIn}
        isFriend={isFriend}
        onEditProfile={() => {
          router.push('/profile/edit');
        }}
        onViewArchive={() => {
          router.push(`/profile/${username}/archive`);
        }}
        onAddFriend={() => {
          console.log("Add friend clicked");
        }}
        onSendMessage={() => {
          console.log("Send message clicked");
        }}
      />

      <TopicGrid userId={profileUser._id} />
    </div>
  );
}
