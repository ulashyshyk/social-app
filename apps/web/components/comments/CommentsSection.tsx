"use client";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useComments, useCreateComment, useDeleteComment } from "../../hooks/useComments";
import CommentItem from "./CommentItem";
import Spinner from "../users/Spinner";

interface CommentsSectionProps {
  topicId: string;
}

export default function CommentsSection({ topicId }: CommentsSectionProps) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [commentText, setCommentText] = useState("");

  const { data: comments, isLoading, error } = useComments(topicId);
  const createComment = useCreateComment(topicId);
  const deleteComment = useDeleteComment(topicId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    if (!commentText.trim()) return;

    try {
      await createComment.mutateAsync(commentText);
      setCommentText("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const handleDelete = (commentId: string) => {
    deleteComment.mutate(commentId);
  };

  return (
    <div id="comments" className="border-t border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Comments {comments ? `(${comments.length})` : ""}
        </h2>

        {/* Comment Input */}
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={
              isAuthenticated
                ? "Write a comment..."
                : "Sign in to comment"
            }
            disabled={!isAuthenticated || createComment.isPending}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed resize-none"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!isAuthenticated || !commentText.trim() || createComment.isPending}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {createComment.isPending ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>

        {/* Comments List */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-red-600 dark:text-red-400 text-center py-4">
            Failed to load comments
          </div>
        ) : !comments || comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-1">
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                currentUserId={user?._id}
                onDelete={handleDelete}
                isDeleting={deleteComment.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
