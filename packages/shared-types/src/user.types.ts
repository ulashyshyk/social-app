// packages/shared-types/src/user.types.ts

// For JWT payload - minimal data to keep token size small
export interface UserPayload {
    userId: string;
    username: string;
    email: string;
}

// For authenticated user responses (without including password)
export interface AuthenticatedUser {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    bio?: string;
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Public profile (what others see - no sensitive data)
export interface PublicUserProfile {
    _id: string;
    username: string;
    fullName: string;
    bio?: string;
    profilePicture?: string;
    createdAt: Date;
    topicsCount?: number; // Virtual field from backend
}
  
// Profile update request
export interface UpdateProfileRequest {
    fullName?: string;
    bio?: string;
    profilePicture?: string;
}