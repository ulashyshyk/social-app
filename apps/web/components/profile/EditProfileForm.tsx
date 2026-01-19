"use client";

import { useState, FormEvent, ChangeEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { AuthenticatedUser } from "../../../../packages/shared-types/src/user.types";
import Image from "next/image";

interface EditProfileFormProps {
  user: AuthenticatedUser;
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter();
  const { updateProfileWithFile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    bio: user.bio || "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    user.profilePicture || ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccessMessage(null);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    setError(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formDataToSend = new FormData();

      if (formData.fullName)
        formDataToSend.append("fullName", formData.fullName);
      if (formData.bio) formDataToSend.append("bio", formData.bio);
      if (selectedFile) formDataToSend.append("profilePicture", selectedFile);

      // Use the context method which calls the API client
      await updateProfileWithFile(formDataToSend);

      setSuccessMessage("Profile updated successfully!");

      setTimeout(() => {
        router.push(`/profile/${user.username}`);
      }, 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-lg"
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Profile Picture Section */}
        <div className="flex items-center gap-6 p-6 border-b border-gray-200 dark:border-gray-800">
          <button
            type="button"
            onClick={triggerFileInput}
            className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={user.username}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600 dark:text-gray-400">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </button>

          <div className="flex-1">
            <h3 className="font-semibold text-sm dark:text-white">
              {user.username}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {formData.fullName || "Add your name"}
            </p>
          </div>

          <button
            type="button"
            onClick={triggerFileInput}
            className="px-4 py-2 text-sm font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 transition-colors"
          >
            Change photo
          </button>
        </div>

        {/* Full Name Field */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            maxLength={100}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            placeholder="Enter your full name"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Help people discover your account by using the name you're known by.
          </p>
        </div>

        {/* Username (Read-only) */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            value={user.username}
            disabled
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Username cannot be changed
          </p>
        </div>

        {/* Email (Read-only) */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Email cannot be changed
          </p>
        </div>

        {/* Bio Field */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            maxLength={150}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none dark:text-white"
            placeholder="Tell us about yourself..."
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
            {formData.bio?.length || 0} / 150
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-6 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
          >
            {isSubmitting ? "Saving..." : "Submit"}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/profile/${user.username}`)}
            disabled={isSubmitting}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
