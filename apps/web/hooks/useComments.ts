import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi, CommentWithReplies } from "../../../packages/api-client/src/comment.api";
import type { Comment } from "../../../packages/shared-types/src/comment.types";

// Fetch comments for a topic
export function useComments(topicId: string) {
  return useQuery<CommentWithReplies[]>({
    queryKey: ["comments", topicId],
    queryFn: () => commentApi.getByTopicId(topicId),
    enabled: !!topicId,
  });
}

// Create a comment
export function useCreateComment(topicId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => commentApi.create(topicId, content),
    onSuccess: () => {
      // Invalidate comments list and topic (to update comment count)
      queryClient.invalidateQueries({ queryKey: ["comments", topicId] });
      queryClient.invalidateQueries({ queryKey: ["topic", topicId] });
    },
  });
}

// Delete a comment
export function useDeleteComment(topicId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentApi.delete(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", topicId] });
      queryClient.invalidateQueries({ queryKey: ["topic", topicId] });
    },
  });
}

// Export types
export type { Comment, CommentWithReplies };
