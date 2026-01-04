// apps/web/components/topics/TopicCard.tsx
'use client';

import { Topic } from '../../../../packages/shared-types/src/topic.types';
import { topicApi } from '../../../../packages/api-client/src/topic.api';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Link from 'next/link';

interface TopicCardProps {
  topic: Topic;
}

export default function TopicCard({ topic }: TopicCardProps) {
  const { requireAuth } = useAuth();
  const [isLiked, setIsLiked] = useState(topic.isLikedByUser);
  const [likesCount, setLikesCount] = useState(topic.likesCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    const canProceed = requireAuth();
    if (!canProceed) return;

    setIsLoading(true);

    // Optimistic UI update
    const previousLiked = isLiked;
    const previousCount = likesCount;
    
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      if (isLiked) {
        await topicApi.unlike(topic._id);
      } else {
        await topicApi.like(topic._id);
      }
    } catch (error) {
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition bg-white">
      {/* Category Badge */}
      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
        {topic.category}
      </span>

      {/* Title */}
      <Link href={`/topics/${topic._id}`}>
        <h3 className="text-xl font-bold mt-2 hover:text-blue-600 cursor-pointer">
          {topic.title}
        </h3>
      </Link>

      {/* Content Preview */}
      <p className="text-gray-600 mt-2 line-clamp-3">
        {topic.content}
      </p>

      {/* Images Preview */}
      {topic.images && topic.images.length > 0 && (
        <div className="mt-3 flex gap-2">
          {topic.images.slice(0, 3).map((img, index) => (
            <img 
              key={index}
              src={img} 
              alt={`${topic.title} - ${index + 1}`}
              className="w-20 h-20 object-cover rounded"
            />
          ))}
          {topic.images.length > 3 && (
            <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-sm">
              +{topic.images.length - 3}
            </div>
          )}
        </div>
      )}

      {/* Author & Timestamp */}
      <p className="text-sm text-gray-500 mt-3">
        By <span className="font-medium">{topic.author.username}</span> • {new Date(topic.createdAt).toLocaleDateString()}
      </p>

      {/* Footer: Likes & Comments */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={isLoading}
          className={`flex items-center gap-1 ${
            isLiked ? 'text-red-500' : 'text-gray-500'
          } hover:text-red-500 transition`}
        >
          {isLiked ? '❤️' : '🤍'} {likesCount}
        </button>

        {/* Comments */}
        <Link 
          href={`/topics/${topic._id}`}
          className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition"
        >
          💬 {topic.commentsCount || 0}
        </Link>
      </div>
    </div>
  );
}
