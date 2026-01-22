"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProfileHeader from "../../../components/users/ProfileHeader";
import TopicGrid from "../../../components/users/TopicGrid";
import { userApi } from "../../../../../packages/api-client/src/user.api";
import {
  PublicUserProfile,
  AuthenticatedUser,
} from "../../../../../packages/shared-types/src/user.types";
import { useAuth } from "../../../hooks/useAuth";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const { user: currentUser, isAuthenticated, openAuthModal } = useAuth();
  
  const [profileUser, setProfileUser] = useState<
    PublicUserProfile | AuthenticatedUser | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
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
    return <div>Loading...</div>; // will be changed later
  }

  if (!profileUser) {
    return <div>User not found</div>;
  }

  const isOwnProfile = currentUser?.username === profileUser.username;
  const isFriend = false;

  const handleAddFriend = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    // Friend request logic for logged in users
    console.log("Add friend clicked");
  };

  return (
    <>
      <ProfileHeader
        user={profileUser}
        isOwnProfile={isOwnProfile}
        isLoggedIn={isAuthenticated}
        isFriend={isFriend}
        topicsCount={0}
        onEditProfile={() => {
          router.push('/profile/edit');
        }}
        onViewArchive={() => {
          router.push(`/profile/${username}/archive`);
        }}
        onAddFriend={handleAddFriend}
        onSendMessage={() => {
          console.log("Send message clicked");
        }}
      />
      <TopicGrid userId={profileUser._id} />
    </>
  );
}
