"use client";

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { topicApi } from '../../../packages/api-client/src/topic.api';
import type {
  Topic,
  CreateTopicRequest,
  UpdateTopicRequest,
  TopicFilters,
  Category
} from '../../../packages/shared-types/src/topic.types';

// Query keys factory
export const topicKeys = {
  all: ['topics'] as const,
  lists: () => [...topicKeys.all, 'list'] as const,
  list: (filters?: TopicFilters) => [...topicKeys.lists(), filters] as const,
  details: () => [...topicKeys.all, 'detail'] as const,
  detail: (id: string) => [...topicKeys.details(), id] as const,
};

// Get all topics with filters (pagination)
export function useTopics(filters?: TopicFilters) {
  return useQuery({
    queryKey: topicKeys.list(filters),
    queryFn: () => topicApi.getAll(filters),
    staleTime: 30000, // 30 seconds
  });
}

// Infinite scroll variant
export function useInfiniteTopics(filters?: Omit<TopicFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: [...topicKeys.lists(), 'infinite', filters],
    queryFn: ({ pageParam = 1 }) =>
      topicApi.getAll({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined,
    initialPageParam: 1,
  });
}

// Get single topic by ID
export function useTopic(id: string) {
  return useQuery({
    queryKey: topicKeys.detail(id),
    queryFn: () => topicApi.getById(id),
    enabled: !!id,
    retry: false, // Don't retry on invalid ID
  });
}

// Create topic mutation
export function useCreateTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, images }: { data: CreateTopicRequest; images?: File[] }) =>
      topicApi.create(data, images),
    onSuccess: () => {
      // Invalidate all topic lists
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() });
    },
  });
}

// Update topic mutation - FIXED VERSION
export function useUpdateTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ 
      id, 
      data, 
      images 
    }: { 
      id: string; 
      data: UpdateTopicRequest; 
      images?: File[] 
    }) => topicApi.update(id, data, images),
    onSuccess: (updatedTopic, variables) => {
      // Update detail cache
      queryClient.setQueryData(topicKeys.detail(variables.id), updatedTopic);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() });
    },
  });
}

// Delete topic mutation
export function useDeleteTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (topicId: string) => topicApi.delete(topicId),
    onSuccess: (_, topicId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: topicKeys.detail(topicId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() });
    },
  });
}

// Toggle like mutation (optimistic updates)
export function useToggleLike(topicId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ isLiked }: { isLiked: boolean }) =>
      isLiked ? topicApi.unlike(topicId) : topicApi.like(topicId),
    // Optimistic update
    onMutate: async ({ isLiked }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: topicKeys.detail(topicId) });
      await queryClient.cancelQueries({ queryKey: topicKeys.lists() });

      // Snapshot previous value
      const previousTopic = queryClient.getQueryData(topicKeys.detail(topicId));

      // Optimistically update detail
      queryClient.setQueryData(topicKeys.detail(topicId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          isLikedByUser: !isLiked,
          likesCount: isLiked ? old.likesCount - 1 : old.likesCount + 1,
        };
      });

      // Update in lists as well
      queryClient.setQueriesData<{ topics: Topic[]; pagination?: any }>(
        { queryKey: topicKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            topics: old.topics.map((topic) =>
              topic._id === topicId
                ? {
                    ...topic,
                    isLikedByUser: !isLiked,
                    likesCount: isLiked ? topic.likesCount - 1 : topic.likesCount + 1,
                  }
                : topic
            ),
          };
        }
      );
      return { previousTopic };
    },
    // On error, rollback
    onError: (err, variables, context) => {
      if (context?.previousTopic) {
        queryClient.setQueryData(topicKeys.detail(topicId), context.previousTopic);
      }
    },
    // Always refetch after error or success (BOTH detail AND lists)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: topicKeys.detail(topicId) });
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() });
    },
  });
}
