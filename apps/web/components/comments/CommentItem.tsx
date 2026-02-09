"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import type { Comment } from "../../../../packages/shared-types/src/comment.types";
import { useState } from "react";

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onDelete: (commentId: string) => void;
  isDeleting?: boolean;
}

export default function CommentItem({
  comment,
  currentUserId,
  onDelete,
  isDeleting,
}: CommentItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isOwner = currentUserId === comment.author._id;

  return (
    <div className="flex gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-lg">
      <Link href={`/profile/${comment.author.username}`} className="flex-shrink-0">
        {comment.author.profilePicture ? (
          <Image
            src={comment.author.profilePicture}
            alt={comment.author.username}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {comment.author.username.charAt(0).toUpperCase()}
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href={`/profile/${comment.author.username}`}
              className="font-semibold text-gray-900 dark:text-white hover:underline truncate"
            >
              {comment.author.fullName || comment.author.username}
            </Link>
            <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
              @{comment.author.username}
            </span>
            <span className="text-sm text-gray-400 dark:text-gray-500 flex-shrink-0">
              • {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>

          {isOwner && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded transition-colors flex-shrink-0"
              disabled={isDeleting}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <p className="text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap break-words">
          {comment.content}
        </p>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Delete Comment?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this comment?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onDelete(comment._id);
                  setShowDeleteConfirm(false);
                }}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
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
