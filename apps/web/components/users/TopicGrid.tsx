"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Topic {
  _id: string;
  title: string;
  content: string;
  type: "EDUCATION" | "TOURISM" | "GENERAL";
  author: {
    username: string;
    profilePicture?: string;
  };
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

interface TopicGridProps {
  userId: string;
}

const TopicGrid: React.FC<TopicGridProps> = ({ userId }) => {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserTopics = async () => {
      setIsLoading(true);
      try {
        setTopics([]);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
        setTopics([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTopics();
  }, [userId]);

  const getTypeColor = (type: Topic["type"]) => {
    switch (type) {
      case "EDUCATION":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      case "TOURISM":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "GENERAL":
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    }
  };

  const getTypeLabel = (type: Topic["type"]) => {
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const handleTopicClick = (topicId: string) => {
    router.push(`/topics/${topicId}`);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-gray-800 rounded-lg p-5 animate-pulse"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-6 w-20 bg-gray-200 dark:bg-[#0f1419] rounded-full"></div>
                <div className="h-4 w-16 bg-gray-200 dark:bg-[#0f1419] rounded"></div>
              </div>
              <div className="h-6 bg-gray-200 dark:bg-[#0f1419] rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-[#0f1419] rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-[#0f1419] rounded mb-4 w-5/6"></div>
              <div className="flex gap-6">
                <div className="h-4 w-12 bg-gray-200 dark:bg-[#0f1419] rounded"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-[#0f1419] rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="text-center py-12 bg-white dark:bg-[#1a1f2e] rounded-lg border border-gray-200 dark:border-gray-800">
          {" "}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-[#0f1419] mb-4">
            <svg
              className="w-8 h-8 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg mb-1">
            No topics yet
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Start sharing topics about education, tourism, and more!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="space-y-4">
        {topics.map((topic) => (
          <div
            key={topic._id}
            onClick={() => handleTopicClick(topic._id)}
            className="bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-gray-800 rounded-lg p-5 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-black/50 hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer group"
          >
            {/* Header: Type Badge + Date */}
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border ${getTypeColor(
                  topic.type
                )}`}
              >
                {getTypeLabel(topic.type)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(topic.createdAt)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {topic.title}
            </h3>

            {/* Content Preview */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {topic.content}
            </p>

            {/* Footer: Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              {/* Likes */}
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>{topic.likesCount}</span>
              </div>

              {/* Comments */}
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>{topic.commentsCount} comments</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicGrid;
