"use client";

import Image from "next/image";
import Link from "next/link";
import { Topic } from "../../../../packages/shared-types/src/topic.types";
import { Heart, MessageCircle, MoreVertical } from "lucide-react";
import { useToggleLike } from "../../hooks/useTopics";
import { useAuth } from "../../hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

interface TopicCardProps {
  topic: Topic;
  onDelete?: (topicId: string) => void;
}

export default function TopicCard({ topic, onDelete }: TopicCardProps) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const toggleLike = useToggleLike(topic._id);

  // Early return if author is missing
  if (!topic.author) {
    console.error("Topic author is null:", topic);
    return null;
  }

  const isOwner = user?._id === topic.author._id;

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    // ✅ Login olmadan modal aç
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    toggleLike.mutate({ isLiked: topic.isLikedByUser });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link
          href={`/profile/${topic.author.username}`}
          className="flex items-center gap-3"
        >
          {topic.author.profilePicture ? (
            <Image
              src={topic.author.profilePicture}
              alt={topic.author.username}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {topic.author.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {topic.author.fullName || topic.author.username}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{topic.author.username} •{" "}
              {formatDistanceToNow(new Date(topic.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </Link>

        {isOwner && (
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <MoreVertical size={20} />
          </button>
        )}
      </div>

      {/* Content */}
      <Link href={`/topics/${topic._id}`} className="block">
        <div className="px-4 pb-3">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full mb-2">
            {topic.category}
          </span>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {topic.title}
          </h2>

          <p className="text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">
            {topic.content}
          </p>
        </div>

        {topic.images && topic.images.length > 0 && (
          <div
            className={`grid gap-1 ${
              topic.images.length === 1
                ? "grid-cols-1"
                : topic.images.length === 2
                  ? "grid-cols-2"
                  : topic.images.length === 3
                    ? "grid-cols-3"
                    : "grid-cols-2"
            }`}
          >
            {topic.images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className="relative aspect-video bg-gray-200 dark:bg-gray-700"
              >
                <Image
                  src={image}
                  alt={`${topic.title} - image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {index === 3 && topic.images.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      +{topic.images.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-6 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLikeClick}
          disabled={toggleLike.isPending}
          className={`flex items-center gap-2 transition-colors cursor-pointer ${
            topic.isLikedByUser
              ? "text-red-500"
              : "text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <Heart
            size={20}
            className={topic.isLikedByUser ? "fill-current" : ""}
          />
          <span className="text-sm font-medium">{topic.likesCount}</span>
        </button>

        <Link
          href={`/topics/${topic._id}#comments`}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          <MessageCircle size={20} />
          <span className="text-sm font-medium">{topic.commentsCount}</span>
        </Link>
      </div>
    </div>
  );
}
