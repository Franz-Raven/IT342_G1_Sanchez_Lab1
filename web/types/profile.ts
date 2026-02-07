export interface ProfileData {
  id: number;
  email: string;
  username: string;
  avatar: string | null;
  coverImage: string | null;
  bio: string | null;
  createdAt: string;
}

export interface ProfileUpdateRequest {
  username?: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
}

export interface ProfileResponse {
  id: number;
  email: string;
  username: string;
  avatar: string | null;
  coverImage: string | null;
  bio: string | null;
  createdAt: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}
