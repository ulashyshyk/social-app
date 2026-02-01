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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <svg 
            className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <p className="text-sm text-red-800 dark:text-red-200 font-medium">{error}</p>
        </div>
      )}

      {/* Title Field */}
      <div>
        <label 
          htmlFor="title" 
          className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter topic title..."
          maxLength={120}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-white dark:bg-[#0f1419] border border-gray-300 dark:border-gray-700 rounded-lg 
                   text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {title.length}/120 characters
        </p>
      </div>

      {/* Category Field */}
      <div>
        <label 
          htmlFor="category" 
          className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2"
        >
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-white dark:bg-[#0f1419] border border-gray-300 dark:border-gray-700 rounded-lg 
                   text-gray-900 dark:text-gray-100
                   focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {TOPIC_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Content Field */}
      <div>
        <label 
          htmlFor="content" 
          className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2"
        >
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your topic content..."
          rows={12}
          maxLength={5000}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-white dark:bg-[#0f1419] border border-gray-300 dark:border-gray-700 rounded-lg 
                   text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-none"
        />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {content.length}/5000 characters
        </p>
      </div>

      {/* Images Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Images (optional, max 5)
        </label>
        
        {/* Upload Area */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            disabled={isLoading || images.length >= 5}
            className="hidden"
            id="images-upload"
          />
          <label
            htmlFor="images-upload"
            className={`flex items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-lg 
                     transition-colors
                     ${images.length >= 5 
                       ? 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0f1419] cursor-not-allowed opacity-50' 
                       : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0f1419] hover:bg-gray-100 dark:hover:bg-[#1a1f2e] cursor-pointer group'
                     }`}
          >
            <div className="text-center">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {images.length >= 5 ? (
                  'Maximum 5 images reached'
                ) : (
                  <>
                    <span className="font-semibold text-blue-600 dark:text-blue-500">Click to upload</span> or drag and drop
                  </>
                )}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </label>
        </div>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img 
                  src={preview} 
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={isLoading}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 
                           flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 
                           transition-opacity disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={isLoading}
          className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white 
                   transition-colors font-medium disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || !title.trim() || !content.trim()}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 
                   text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow-md 
                   disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEditing ? 'Update Topic' : 'Create Topic'
          )}
        </button>
      </div>
    </form>
  );
}
