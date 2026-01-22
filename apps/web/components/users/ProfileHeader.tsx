"use client";

import React from "react";
import Button from "../ui/Button";
import { ThemeToggle } from "../ui/ThemeToggle";
import { AuthenticatedUser, PublicUserProfile } from "../../../../packages/shared-types/src/user.types";

interface ProfileHeaderProps {
  user: PublicUserProfile | AuthenticatedUser;
  topicsCount: number;
  isOwnProfile: boolean;
  isLoggedIn: boolean;
  isFriend?: boolean;
  onEditProfile?: () => void;
  onViewArchive?: () => void;
  onAddFriend?: () => void;
  onSendMessage?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  topicsCount,
  isOwnProfile,
  isLoggedIn,
  isFriend = false,
  onEditProfile,
  onViewArchive,
  onAddFriend,
  onSendMessage,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-[#1a1f2e] border-b border-gray-200 dark:border-gray-800">
      {" "}
      {/* Theme Toggle - Sadece kendi profilinde göster */}
      {isOwnProfile && (
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
      )}
      
      <div className="flex items-start gap-8">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.username}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-gray-200 dark:border-gray-700">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 min-w-0">
          {/* Username and Buttons */}
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white truncate">
              {user.username}
            </h1>
            
            {/* Conditional Buttons */}
            {isOwnProfile ? (
              // Kendi profilin - Edit ve Archive butonları
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onEditProfile}
                  className="whitespace-nowrap"
                >
                  Edit profile
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onViewArchive}
                  className="whitespace-nowrap"
                >
                  View archive
                </Button>
              </>
            ) : isLoggedIn ? (
              // Başkasının profili ve login olduysan - Add Friend veya Send Message
              <>
                {isFriend ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onSendMessage}
                    className="whitespace-nowrap"
                  >
                    Send message
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onAddFriend}
                    className="whitespace-nowrap"
                  >
                    Add friend
                  </Button>
                )}
              </>
            ) : null}
            {/* Login olmadıysan hiç buton gösterme */}
          </div>

          {/* Stats */}
          <div className="flex gap-8 mb-4">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900 dark:text-white">
                {topicsCount}
              </span>
              <span className="text-gray-600 dark:text-gray-400">topics</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900 dark:text-white">
                0
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                followers
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900 dark:text-white">
                0
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                following
              </span>
            </div>
          </div>

          {/* Bio */}
          {user.fullName && (
            <p className="font-semibold text-gray-900 dark:text-white mb-1">
              {user.fullName}
            </p>
          )}
          {user.bio && (
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {user.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
