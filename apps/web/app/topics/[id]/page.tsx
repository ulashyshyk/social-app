"use client";

import { useParams, useRouter } from "next/navigation";
import { useTopic, useDeleteTopic } from "../../../hooks/useTopics";
import { useAuth } from "../../../hooks/useAuth";
import Spinner from "../../../components/users/Spinner";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useToggleLike } from "../../../hooks/useTopics";
import { useState } from "react";

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;
  
  const { user, isAuthenticated, openAuthModal } = useAuth(); // openAuthModal eklendi
  const { data: topic, isLoading, error } = useTopic(topicId);
  const toggleLike = useToggleLike(topicId);
  const deleteTopic = useDeleteTopic();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = user?._id === topic?.author._id;

  // Login modal açma eklendi
  const handleLikeClick = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    toggleLike.mutate({ isLiked: topic?.isLikedByUser || false });
  };

  const handleDelete = async () => {
    try {
      await deleteTopic.mutateAsync(topicId);
      router.push("/");
    } catch (err) {
      console.error("Failed to delete topic:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
          Topic not found or failed to load.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <Link
              href={`/profile/${topic.author.username}`}
              className="flex items-center gap-3"
            >
              {topic.author.profilePicture ? (
                <Image
                  src={topic.author.profilePicture}
                  alt={topic.author.username}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                  {topic.author.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {topic.author.fullName || topic.author.username}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{topic.author.username} •{" "}
                  {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
                </p>
              </div>
            </Link>

            {isOwner && (
              <div className="flex gap-2">
                <Link
                  href={`/topics/${topicId}/edit`}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit size={20} />
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Category */}
          <span className="inline-block mt-4 px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
            {topic.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {topic.title}
          </h1>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {topic.content}
          </p>
        </div>

        {/* Images */}
        {topic.images && topic.images.length > 0 && (
          <div className="px-6 pb-6">
            <div className={`grid gap-2 ${
              topic.images.length === 1 ? 'grid-cols-1' : 
              topic.images.length === 2 ? 'grid-cols-2' : 
              'grid-cols-2 md:grid-cols-3'
            }`}>
              {topic.images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={`${topic.title} - image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-6 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          {/* Like Button - Cursor eklendi */}
          <button
            onClick={handleLikeClick}
            disabled={toggleLike.isPending}
            className={`flex items-center gap-2 transition-all duration-200 cursor-pointer ${
              topic.isLikedByUser
                ? "text-red-500"
                : "text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
            } disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100`}
          >
            <Heart
              size={24}
              className={topic.isLikedByUser ? "fill-current" : ""}
            />
            <span className="font-medium">{topic.likesCount}</span>
          </button>

          {/* Comment Button - Cursor eklendi */}
          <a
            href="#comments"
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <MessageCircle size={24} />
            <span className="font-medium">{topic.commentsCount}</span>
          </a>
        </div>

        {/* Comments Section Placeholder */}
        <div id="comments" className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Comments
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Comments feature coming soon...
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Delete Topic?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this topic? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleteTopic.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {deleteTopic.isPending ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteTopic.isPending}
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
