"use client";

import React from "react";
import Button from "../ui/Button";
import { ThemeToggle } from "../ui/ThemeToggle";
import { AuthenticatedUser } from "../../../../packages/shared-types/src/user.types";

interface ProfileHeaderProps {
  user: AuthenticatedUser;
  topicsCount: number;
  onEditProfile?: () => void;
  onViewArchive?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  topicsCount,
  onEditProfile,
  onViewArchive,
}) => {
  return (
    <div className="w-full bg-white dark:bg-[#1a1f2e] border-b border-gray-200 dark:border-gray-800">
      {" "}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        <div className="flex gap-8 md:gap-16 items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-0.5">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover bg-white dark:bg-[#0f1419]"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-100 dark:bg-[#0f1419] flex items-center justify-center text-2xl md:text-5xl font-semibold text-gray-700 dark:text-gray-300">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-0">
            {/* Username and Buttons */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-5">
              <h1 className="text-xl md:text-2xl font-light text-gray-900 dark:text-gray-100">
                {user.username}
              </h1>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={onEditProfile}>
                  Edit profile
                </Button>
                <Button variant="secondary" size="sm" onClick={onViewArchive}>
                  View archive
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mb-5 text-base">
              <div className="flex gap-1">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {topicsCount}
                </span>
                <span className="text-gray-600 dark:text-gray-400">topics</span>
              </div>
              <button className="flex gap-1 hover:opacity-70 transition-opacity">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  0
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  followers
                </span>
              </button>
              <button className="flex gap-1 hover:opacity-70 transition-opacity">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  0
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  following
                </span>
              </button>
            </div>

            {/* Bio */}
            <div className="text-sm">
              {user.fullName && (
                <p className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
                  {user.fullName}
                </p>
              )}
              {user.bio && (
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {user.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
