// apps/web/components/topics/TopicForm.tsx
'use client';

import { useState } from 'react';
import { CreateTopicRequest, Category } from '../../../../packages/shared-types/src/topic.types';
import { TOPIC_CATEGORIES } from '../../../../packages/shared-types/src/topic.types';

interface TopicFormProps {
  onSubmit: (data: CreateTopicRequest, images: File[]) => Promise<void>;
  initialData?: Partial<CreateTopicRequest>;
  isEditing?: boolean;
}

export default function TopicForm({ onSubmit, initialData, isEditing }: TopicFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState<Category>(initialData?.category || 'Education');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    setImages([...images, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setError('');
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (title.length > 120) {
      setError('Title must be 120 characters or less');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    if (content.length > 5000) {
      setError('Content must be 5000 characters or less');
      return;
    }

    setIsLoading(true);

    try {
      await onSubmit({ title, content, category }, images);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save topic');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded border border-red-200">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter topic title..."
          maxLength={120}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <p className="text-sm text-gray-500 mt-1">
          {title.length}/120 characters
        </p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          {TOPIC_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your topic content..."
          rows={10}
          maxLength={5000}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <p className="text-sm text-gray-500 mt-1">
          {content.length}/5000 characters
        </p>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Images (optional, max 5)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          disabled={isLoading || images.length >= 5}
          className="w-full"
        />

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img 
                  src={preview} 
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400 font-medium"
      >
        {isLoading ? 'Saving...' : isEditing ? 'Update Topic' : 'Create Topic'}
      </button>
    </form>
  );
}
