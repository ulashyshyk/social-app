"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../../hooks/useAuth";
import { useTopic } from "../../../../hooks/useTopics";
import TopicForm from "../../../../components/topics/TopicForm";
import Spinner from "../../../../components/users/Spinner";

export default function EditTopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;
  
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: topic, isLoading: topicLoading, error } = useTopic(topicId);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (topic && user && topic.author._id !== user._id) {
      router.push(`/topics/${topicId}`);
    }
  }, [isAuthenticated, authLoading, topic, user, router, topicId]);

  if (authLoading || topicLoading) {
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
          Topic not found or you don't have permission to edit it.
        </div>
      </div>
    );
  }

  return <TopicForm topic={topic} isEditing />;
}
