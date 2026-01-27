"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { useCreateTopic } from "../../../hooks/useTopics";
import TopicForm from "../../../components/topics/TopicForm";
import Spinner from "../../../components/users/Spinner";
import type { CreateTopicRequest } from "../../../../../packages/shared-types/src/topic.types";

export default function CreateTopicPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const createTopic = useCreateTopic();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  // Submit handler
  const handleSubmit = async (data: CreateTopicRequest, images: File[]) => {
    try {
      setError("");
      
      const newTopic = await createTopic.mutateAsync({
        data,
        images,
      });
      
      // Success → Redirect to main page
      router.push("/");
    } catch (err: any) {
      console.error("Create topic error:", err);
      setError(err.response?.data?.message || "Failed to create topic");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Create New Topic
      </h1>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <TopicForm onSubmit={handleSubmit} />
    </div>
  );
}
