'use client';

import { useState } from 'react';
import { CreateTopicRequest, Category } from '../../../../packages/shared-types/src/topic.types';
import { TOPIC_CATEGORIES } from '../../../../packages/shared-types/src/topic.types';

interface TopicFormProps {
  onSubmit: (data: CreateTopicRequest, images: File[]) => Promise<void>;
  initialData?: Partial<CreateTopicRequest>;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

export default function TopicForm({ onSubmit, initialData, isEditing, isSubmitting }: TopicFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState<Category>(initialData?.category || 'Education');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    setImages([...images, ...files]);

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

    try {
      await onSubmit({ title, content, category }, images);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save topic');
    }
  };

  const isLoading = isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Compact card container */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
        
        {/* Error Alert - Compact */}
        {error && (
          <div className="px-4 py-2.5 bg-red-500/10 border-b border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* Title & Category - Two column on larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Title - 2 columns */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter topic title..."
                maxLength={120}
                disabled={isLoading}
                className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg
                  text-gray-100 placeholder-gray-500 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
              <p className="text-xs text-gray-500">{title.length}/120</p>
            </div>

            {/* Category - 1 column */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                disabled={isLoading}
                className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg
                  text-gray-100 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {TOPIC_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Content - Compact textarea */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">
              Content <span className="text-red-400">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your topic content..."
              rows={6}
              maxLength={5000}
              disabled={isLoading}
              className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg
                text-gray-100 placeholder-gray-500 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-y"
            />
            <p className="text-xs text-gray-500">{content.length}/5000</p>
          </div>

          {/* Images - Compact upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Images <span className="text-gray-500 text-xs">(optional, max 5)</span>
            </label>
            
            {/* Compact upload button instead of large drag area */}
            <div className="flex items-center gap-3">
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
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
                  ${images.length >= 5
                    ? 'border-gray-800 bg-gray-900 text-gray-600 cursor-not-allowed'
                    : 'border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800 cursor-pointer'
                  }`}
              >
                {images.length >= 5 ? 'Max images reached' : '+ Add Images'}
              </label>
              <span className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</span>
            </div>

            {/* Compact image previews - horizontal scroll */}
            {imagePreviews.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative flex-shrink-0 group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={isLoading}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white 
                        rounded-full w-5 h-5 flex items-center justify-center text-xs
                        opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky footer with actions */}
        <div className="px-4 py-3 bg-gray-900/80 border-t border-gray-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            disabled={isLoading}
            className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200
              transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !title.trim() || !content.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
              font-medium text-sm transition-colors disabled:opacity-50 
              disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update Topic' : 'Create Topic'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
