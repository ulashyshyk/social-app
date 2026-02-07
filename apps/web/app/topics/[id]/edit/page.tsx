"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../../hooks/useAuth";
import { useTopic, useUpdateTopic } from "../../../../hooks/useTopics";
import TopicForm from "../../../../components/topics/TopicForm";
import Spinner from "../../../../components/users/Spinner";
import type { UpdateTopicRequest } from "../../../../../../packages/shared-types/src/topic.types";

export default function EditTopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;
  
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: topic, isLoading: topicLoading, error } = useTopic(topicId);
  const updateTopic = useUpdateTopic();
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (topic && user && topic.author._id !== user._id) {
      router.push(`/topics/${topicId}`);
    }
  }, [isAuthenticated, authLoading, topic, user, router, topicId]);

  const handleSubmit = async (data: UpdateTopicRequest, images: File[]) => {
    try {
      setSubmitError("");
      await updateTopic.mutateAsync({
        id: topicId,
        data,
        images,
      });
      router.push(`/topics/${topicId}`);
    } catch (err: any) {
      console.error("Update topic error:", err);
      setSubmitError(err.response?.data?.message || "Failed to update topic");
    }
  };

  if (authLoading || topicLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading topic</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1419] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Topic</h1>
          <p className="text-gray-400">Update your topic details</p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {submitError}
          </div>
        )}

        <TopicForm
          initialData={topic}
          onSubmit={handleSubmit}
          isEditing={true}
          // isSubmitting={updateTopic.isPending}
        />
      </div>
    </div>
  );
}
